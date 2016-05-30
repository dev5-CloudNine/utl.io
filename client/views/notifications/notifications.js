Template.notifications.helpers({
	'buyerNotifications': function() {
		var notifications = Notifications.find({buyerId: Meteor.userId()}, {sort: {timeStamp: -1}});
		var notificationDetails = [];
		notifications.forEach(function(notification) {
			providerName = Profiles.findOne({userId: notification.providerId}).name;
			jobDetails = Jobs.findOne({_id: notification.jobId});
			var notif = {
				notificationType: notification.notificationType,
				pname: providerName,
				_id: notification.jobId,
				slug: jobDetails.slug(),
				notificationId: notification._id
			}
			notificationDetails.push(notif);
		});
		return notificationDetails;
	},
	bjobDetails: function() {
		return Jobs.findOne({_id: this._id}).title;
	},
	pjobDetails: function() {
		return Jobs.findOne({_id: this._id}).title;
	},
	'providerNotifications': function() {
		var notifications = Notifications.find({providerId: Meteor.userId()}, {sort: {timeStamp: -1}});
		var notificationDetails = [];
		notifications.forEach(function (notification) {
			buyerName = Buyers.findOne({userId: notification.buyerId}).name;
			jobDetails = Jobs.findOne({_id: notification.jobId});
			var notif = {
				notificationType: notification.notificationType,
				bname: buyerName,
				_id: notification.jobId,
				slug: jobDetails.slug()
			}
			notificationDetails.push(notif);
		});
		return notificationDetails;
	}
});

Template.notifications.events({
	'click a.markRead': function(event, template) {
		Meteor.call('markRead', this.notificationId);
	}
})