Template.messages.onCreated(function() {
	this.autorun(function() {
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
	'click .sendMsg': function(event, template) {
		var jobId;
		if(Router.current().route.getName() == 'job')
			jobId = Router.current().params._id;
		else if(Router.current().route.getName() == 'dashboard')
			jobId = Router.current().params.query.jobId;
		var message = $('#message-text').val();
		if(!message)
			return
		Meteor.call('sendMessage', message, Meteor.userId(), jobId, new Date(), function(err, res) {
			if(!err) {
				var msgDiv = $('.message-history-body');
				var height = msgDiv[0].scrollHeight;
				msgDiv.animate({scrollTop: height}, 1000)
			}
		});
	},
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
	} 
});

Template.messages.helpers({
	jobDetails: function() {
		return Jobs.findOne({_id: Router.current().params.query.jobId});
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
	}
})