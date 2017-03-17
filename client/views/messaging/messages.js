Template.messages.onCreated(function() {
	this.autorun(function() {
		var selectedUserId;
		if(Router.current().route.getName() == 'profile')
			selectedUserId = Profiles.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'buyer')
			selectedUserId = Buyers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dispatcher')
			selectedUserId = Dispatchers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'accountant')
			selectedUserId = Accountants.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dashboard')
			selectedUserId = Router.current().params.query.userId;
		Meteor.subscribe('userChats', Meteor.userId(), selectedUserId);
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
				var messageObject = {};
				if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
					messageObject = {
						text: message,
						sender: Meteor.userId(),
						providerRead: false,
						adminRead: false,
						time: new Date()
					}
				}
				if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
					messageObject = {
						text: message,
						sender: Meteor.userId(),
						buyerRead: false,
						adminRead: false,
						time: new Date()
					}
				}
				if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
					messageObject = {
						text: message,
						sender: Meteor.userId(),
						providerRead: false,
						buyerRead: false,
						time: new Date()
					}
				}
				Meteor.call('sendMessage', messageObject, jobId, function(err, res) {
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
		var selectedUserId;
		if(Router.current().route.getName() == 'profile')
			selectedUserId = Profiles.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'buyer')
			selectedUserId = Buyers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dispatcher')
			selectedUserId = Dispatchers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'accountant')
			selectedUserId = Accountants.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dashboard')
			selectedUserId = Router.current().params.query.userId;
		var chatExists = UserChats.findOne({$and: [{participants: {$in: [Meteor.userId()]}}, {participants: {$in: [selectedUserId]}}]});
		var message = $('#user-text').val();
		if(!!message) {
			var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
			if (charCode == 13) {
				event.stopPropagation();
				var messageObject = {}
				if(Roles.userIsInRole(selectedUserId, ['provider'])) {
					messageObject = {
						text: message,
						sender: Meteor.userId(),
						providerRead: false,
						time: new Date()
					}
				}
				if(Roles.userIsInRole(selectedUserId, ['buyer'])) {
					messageObject = {
						text: message,
						sender: Meteor.userId(),
						buyerRead: false,
						time: new Date()
					}
				}
				if(Roles.userIsInRole(selectedUserId, ['dispatcher'])) {
					messageObject = {
						text: message,
						sender: Meteor.userId(),
						dispatcherRead: false,
						time: new Date()
					}
				}
				if(Roles.userIsInRole(selectedUserId, ['accountant'])) {
					messageObject = {
						text: message,
						sender: Meteor.userId(),
						accountantRead: false,
						time: new Date()
					}
				}
				if(!chatExists) {
					Meteor.call('createUserChat', Meteor.userId(), selectedUserId, function(err, res) {
						if(!err) {
							Meteor.call('sendUserMessage', messageObject, res, function(error, result) {
								if(!error) {
									var msgDiv = $('.message-history-body');
									var height = msgDiv[0].scrollHeight;
									msgDiv.animate({scrollTop: height}, 1000)
								}
							})
						}
					});
				} else {
					Meteor.call('sendUserMessage', messageObject, chatExists._id, function(error, result) {
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
		var selectedUserId;
		if(Router.current().route.getName() == 'profile')
			selectedUserId = Profiles.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'buyer')
			selectedUserId = Buyers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dispatcher')
			selectedUserId = Dispatchers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'accountant')
			selectedUserId = Accountants.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dashboard')
			selectedUserId = Router.current().params.query.userId;
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
							var messageObject = {};
							if(Roles.userIsInRole(selectedUserId, ['provider'])) {
								messageObject = {
									file: fileDetails,
									sender: Meteor.userId(),
									providerRead: false,
									time: new Date()
								}
							}
							if(Roles.userIsInRole(selectedUserId, ['buyer'])) {
								messageObject = {
									file: fileDetails,
									sender: Meteor.userId(),
									buyerRead: false,
									time: new Date()
								}
							}
							if(Roles.userIsInRole(selectedUserId, ['dispatcher'])) {
								messageObject = {
									file: fileDetails,
									sender: Meteor.userId(),
									dispatcherRead: false,
									time: new Date()
								}
							}
							if(Roles.userIsInRole(selectedUserId, ['accountant'])) {
								messageObject = {
									file: fileDetails,
									sender: Meteor.userId(),
									accountantRead: false,
									time: new Date()
								}
							}
							Meteor.call('sendUserFile', messageObject, res, function(error, result) {
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
					if(Roles.userIsInRole(selectedUserId, ['provider'])) {
						messageObject = {
							file: fileDetails,
							sender: Meteor.userId(),
							providerRead: false,
							time: new Date()
						}
					}
					if(Roles.userIsInRole(selectedUserId, ['buyer'])) {
						messageObject = {
							file: fileDetails,
							sender: Meteor.userId(),
							buyerRead: false,
							time: new Date()
						}
					}
					if(Roles.userIsInRole(selectedUserId, ['dispatcher'])) {
						messageObject = {
							file: fileDetails,
							sender: Meteor.userId(),
							dispatcherRead: false,
							time: new Date()
						}
					}
					if(Roles.userIsInRole(selectedUserId, ['accountant'])) {
						messageObject = {
							file: fileDetails,
							sender: Meteor.userId(),
							accountantRead: false,
							time: new Date()
						}
					}
					Meteor.call('sendUserFile', messageObject, chatExists._id, function(error, result) {
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
				if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
					messageObject = {
						file: fileDetails,
						sender: Meteor.userId(),
						providerRead: false,
						adminRead: false,
						time: new Date()
					}
				}
				if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
					messageObject = {
						file: fileDetails,
						sender: Meteor.userId(),
						buyerRead: false,
						adminRead: false,
						time: new Date()
					}
				}
				if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
					messageObject = {
						file: fileDetails,
						sender: Meteor.userId(),
						providerRead: false,
						buyerRead: false,
						time: new Date()
					}
				}
				Meteor.call('sendFile', messageObject, jobId, function(err, res) {
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
		var jobId = Router.current().params.query.jobId || (Router.current().route.getName() == 'job' && Router.current().params._id);
		if(jobId)
			return true;
		return false;
	},
	userSelected: function() {
		var selectedUserId;
		if(Router.current().route.getName() == 'profile')
			selectedUserId = Profiles.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'buyer')
			selectedUserId = Buyers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dispatcher')
			selectedUserId = Dispatchers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'accountant')
			selectedUserId = Accountants.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dashboard')
			selectedUserId = Router.current().params.query.userId;
		if(selectedUserId)
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
		var userId;
		if(Router.current().route.getName() == 'profile')
			userId = Profiles.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'buyer')
			userId = Buyers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dispatcher')
			userId = Dispatchers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'accountant')
			userId = Accountants.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dashboard')
			userId = Router.current().params.query.userId;
		if(Roles.userIsInRole(userId, ['provider']))
			return Profiles.findOne({userId: userId});
		if(Roles.userIsInRole(userId, ['buyer']))
			return Buyers.findOne({userId: userId});
		if(Roles.userIsInRole(userId, ['provider']))
			return Profiles.findOne({userId: userId});
		if(Roles.userIsInRole(userId, ['dispatcher']))
			return Dispatchers.findOne({userId: userId});
		if(Roles.userIsInRole(userId, ['accountant']))
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
		var selectedUserId;
		if(Router.current().route.getName() == 'profile')
			selectedUserId = Profiles.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'buyer')
			selectedUserId = Buyers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dispatcher')
			selectedUserId = Dispatchers.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'accountant')
			selectedUserId = Accountants.findOne({_id: Router.current().params._id}).userId;
		if(Router.current().route.getName() == 'dashboard')
			selectedUserId = Router.current().params.query.userId;
		return UserChats.findOne({$and: [{participants: {$in: [Meteor.userId()]}}, {participants: {$in: [selectedUserId]}}]}).messages;
	}
})