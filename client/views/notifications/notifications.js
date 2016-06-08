Template.notifications.helpers({
	'buyerNotifications': function() {
		var notifications = Notifications.find({$and: [{buyerId: Meteor.userId()}, {side: 'buyer'}]}, {sort: {timeStamp: -1}});
		var notificationDetails = [];
		notifications.forEach(function(notification) {
			providerName = Profiles.findOne({userId: notification.providerId}).name;
			jobDetails = Jobs.findOne({_id: notification.jobId});
			var notif = {
				notificationType: notification.notificationType,
				pname: providerName,
				_id: notification.jobId,
				slug: jobDetails.slug(),
				notificationId: notification._id,
				side: notification.side,
				read: notification.read,
				notificationTime: moment(notification.timeStamp).fromNow()
			}
			notificationDetails.push(notif);
		});
		return notificationDetails;
	},
	jobName: function() {
		return Jobs.findOne({_id: this._id}).title || "";
	},
	'providerNotifications': function() {
		var notifications = Notifications.find({$and: [{providerId: Meteor.userId()}, {side: 'provider'}]}, {sort: {timeStamp: -1}});
		var notificationDetails = [];
		notifications.forEach(function (notification) {
			buyerName = Buyers.findOne({userId: notification.buyerId}).name;
			console.log(notification);
			jobDetails = Jobs.findOne({_id: notification.jobId});
			var notif = {
				notificationType: notification.notificationType,
				bname: buyerName,
				_id: notification.jobId,
				slug: jobDetails.slug(),
				notificationId: notification._id,
				side: notification.side,
				read: notification.read,
				notificationTime: moment(notification.timeStamp).fromNow()
			}
			notificationDetails.push(notif);
		});
		return notificationDetails;
	},
	'adminNotifications': function() {
		var notifications = Notifications.find({}, {sort: {timeStamp: -1}}).fetch();
		var notificationDetails = [];
		notifications.forEach(function(notification) {
			var notif = {};
			if(notification.notificationType == 'userSignUp') {
				notif = {
					notificationType: notification.notificationType,
					notificationTime: moment(notification.timeStamp).fromNow(),
					notificationId: notification._id
				}
				notificationDetails.push(notif);
			} else if(notification.notificationType == 'newJob') {
				var buyerName = Buyers.findOne({userId: notification.buyerId}).name;
				var jobDetails = Jobs.findOne({_id: notification.jobId});
				notif = {
					notificationType: notification.notificationType,
					notificationTime: moment(notification.timeStamp).fromNow(),
					notificationId: notification._id,
					_id: notification.jobId,
					slug: jobDetails.slug(),
					bname: buyerName
				}
				notificationDetails.push(notif);
			} else if(notification.notificationType == 'welcomeNotification') {
				return;
			} else {
				var buyerName = Buyers.findOne({userId: notification.buyerId}).name;
				var providerName = Profiles.findOne({userId: notification.providerId}).name;
				var jobDetails = Jobs.findOne({_id: notification.jobId});
				notif = {
					notificationType: notification.notificationType,
					notificationTime: moment(notification.timeStamp).fromNow(),
					notificationId: notification._id,
					_id: notification.jobId,
					slug: jobDetails.slug(),
					bname: buyerName,
					pname: providerName
				}
				notificationDetails.push(notif);
			}
		});
		return notificationDetails;
	},
	welcomeNotification: function() {
		return Notifications.findOne({$and: [{notificationType: 'welcomeNotification'}, {userId: Meteor.userId()}]});
	}
});

Template.notifications.events({
	'click a.markRead': function(event, template) {
		Meteor.call('markRead', this.notificationId, this.side);
	}
})