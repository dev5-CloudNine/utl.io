Template.buyerNotifications.helpers({
	buyerNotifications: function() {
		var notifications = Notifications.find({$and: [{buyerId: Meteor.userId()}, {side: 'buyer'}]}, {sort: {timeStamp: -1}, limit: 10});
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
	}
})