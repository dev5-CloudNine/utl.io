Template.messages.onCreated(function() {
	this.autorun(function() {
		var selectedUser = Router.current().params.query.userId;
		Meteor.subscribe('userChats', Meteor.userId(), selectedUser);
		return Meteor.subscribe('userChannels', Meteor.userId());
	})
});

Template.messages.rendered = function() {
	this.autorun(function() {
		var msgDiv = $('.message-history-body');
		msgDiv.animate({scrollTop: $(document).height()}, 1000)
	});
}

Template.messages.events({
	'keypress #message-text': function(event, template) {
		var jobId;
		if(Router.current().route.getName() == 'job')
			jobId = Router.current().params._id;
		else if(Router.current().route.getName() == 'dashboard')
			jobId = Router.current().params.query.jobId;
		var message = $('#message-text').val();
		if(!!message) {
			var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
			if (charCode == 13) {
				event.stopPropagation();
				Meteor.call('sendMessage', message, Meteor.userId(), jobId, new Date(), function(err, res) {
					if(!err) {
						var msgDiv = $('.message-history-body');
						var height = msgDiv[0].scrollHeight;
						msgDiv.animate({scrollTop: height}, 1000)
					}
				});
				$('#message-text').val("");
				return false;
			}
		}
	},
	'keypress #user-text': function(event, template) {
		var selectedUserId = Router.current().params.query.userId;
		var chatExists = UserChats.findOne({$and: [{participants: {$in: [Meteor.userId()]}}, {participants: {$in: [selectedUserId]}}]});
		var message = $('#user-text').val();
		if(!!message) {
			var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
			if (charCode == 13) {
				event.stopPropagation();
				if(!chatExists) {
					Meteor.call('createUserChat', Meteor.userId(), selectedUserId, function(err, res) {
						if(!err) {
							Meteor.call('sendUserMessage', message, Meteor.userId(), new Date(), res, function(error, result) {
								if(!error) {
									var msgDiv = $('.message-history-body');
									var height = msgDiv[0].scrollHeight;
									msgDiv.animate({scrollTop: height}, 1000)
								}
							})
						}
					});
				} else {
					Meteor.call('sendUserMessage', message, Meteor.userId(), new Date(), chatExists._id, function(error, result) {
						if(!error) {
							var msgDiv = $('.message-history-body');
							var height = msgDiv[0].scrollHeight;
							msgDiv.animate({scrollTop: height}, 1000)
						}
					})
				}
				$('#user-text').val("");
				return false;
			}
		}
	},
	'change .user_documents': function(event, template) {
		event.preventDefault();
		$('#spinner').show();
		var selectedUserId = Router.current().params.query.userId;
		var files = $(event.currentTarget)[0].files;
		if(!files)
			return;
		var chatExists = UserChats.findOne({$and: [{participants: {$in: [Meteor.userId()]}}, {participants: {$in: [selectedUserId]}}]});
		if(!chatExists) {
			Meteor.call('createUserChat', Meteor.userId(), selectedUserId, function(err, res) {
				if(!err) {
					S3.upload({
						files: files,
						path: S3_FILEUPLOADS
					}, function(error, result) {
						if(error) {
							toastr.error('Failed to upload documents. Try again.');
							$('#spinner').hide();
						} else {
							var fileDetails = {
								fileName: result.file.original_name,
								fileUrl: result.secure_url
							}
							Meteor.call('sendUserFile', fileDetails, Meteor.userId(), new Date(), res, function(error, result) {
								if(!error) {
									$('#spinner').hide();
									var msgDiv = $('.message-history-body');
									var height = msgDiv[0].scrollHeight;
									msgDiv.animate({scrollTop: height}, 1000)
								}
							})
						}
					})
				}
			});
		} else {
			S3.upload({
				files: files,
				path: S3_FILEUPLOADS
			}, function(error, result) {
				if(error) {
					toastr.error('Failed to upload documents. Try again.');
					$('#spinner').hide();
				} else {
					var fileDetails = {
						fileName: result.file.original_name,
						fileUrl: result.secure_url
					}
					Meteor.call('sendUserFile', fileDetails, Meteor.userId(), new Date(), chatExists._id, function(error, result) {
						if(!error) {
							$('#spinner').hide();
							var msgDiv = $('.message-history-body');
							var height = msgDiv[0].scrollHeight;
							msgDiv.animate({scrollTop: height}, 1000)
						}
					})
				}
			})
		}
	},
	'change .attach_documents': function(event, template) {
		event.preventDefault();
		$('#spinner').show();
		var jobId;
		if(Router.current().route.getName() == 'job')
			jobId = Router.current().params._id;
		else if(Router.current().route.getName() == 'dashboard')
			jobId = Router.current().params.query.jobId;
		var files = $(event.currentTarget)[0].files;
		if(!files)
			return;
		S3.upload({
			files: files,
			path: S3_FILEUPLOADS
		}, function(error, result) {
			if(error) {
				toastr.error('Failed to upload documents. Try again.');
				$('#spinner').hide();
			} else {
				var fileDetails = {
					fileUrl: result.secure_url,
					fileName: result.file.original_name
				}
				Meteor.call('sendFile', fileDetails, Meteor.userId(), jobId, new Date(), function(err, res) {
					if(!err) {
						$('#spinner').hide();
						var msgDiv = $('.message-history-body');
						var height = msgDiv[0].scrollHeight;
						msgDiv.animate({scrollTop: height}, 1000)
					}
				})
			}
		})
	}
});

Template.messages.helpers({
	jobSelected: function() {
		var jobId = Router.current().params.query.jobId || Router.current().params._id;
		if(jobId)
			return true;
		return false;
	},
	userSelected: function() {
		var userId = Router.current().params.query.userId;
		if(userId)
			return true;
		return false;
	},
	jobDetails: function() {
		var jobId;
		if(Router.current().route.getName() == 'job')
			jobId = Router.current().params._id;
		else if(Router.current().route.getName() == 'dashboard')
			jobId = Router.current().params.query.jobId;
		return Jobs.findOne({_id: jobId});
	},
	userDetails: function() {
		var userId = Router.current().params.query.userId;
		if(Roles.userIsInRole(userId, ['provider']))
			return Profiles.findOne({userId: userId});
		if(Roles.userIsInRole(userId, ['dispatcher']))
			return Dispatchers.findOne({userId: userId});
		if(Roles.userIsInRole(userId, ['Accountant']))
			return Accountants.findOne({userId: userId});
	},
	messages: function() {
		Tracker.afterFlush(function() {
			var msgDiv = $('.message-history-body');
			var height = msgDiv[0].scrollHeight;
			msgDiv.animate({scrollTop: height}, 1000)
		})
		var jobId;
		if(Router.current().route.getName() == 'job')
			jobId = Router.current().params._id;
		else if(Router.current().route.getName() == 'dashboard')
			jobId = Router.current().params.query.jobId
		return Channels.findOne({jobId: jobId}).messages;
	},
	userMessages: function() {
		Tracker.afterFlush(function() {
			var msgDiv = $('.message-history-body');
			var height = msgDiv[0].scrollHeight;
			msgDiv.animate({scrollTop: height}, 1000)
		})
		return UserChats.findOne({$and: [{participants: {$in: [Meteor.userId()]}}, {participants: {$in: [Router.current().params.query.userId]}}]}).messages;
	}
})