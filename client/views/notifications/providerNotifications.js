Template.providerNotifications.helpers({
	'providerNotifications': function() {
		var notifications = Notifications.find({$and: [{providerId: Meteor.userId()}, {side: 'provider'}]}, {sort: {timeStamp: -1}});
		var notificationDetails = [];
		notifications.forEach(function (notification) {
			buyerName = Buyers.findOne({userId: notification.buyerId}).name;
			jobDetails = Jobs.findOne({_id: notification.jobId});
			if(jobDetails) {
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
			}
		});
		return notificationDetails;
	},
	jobName: function() {
		return Jobs.findOne({_id: this._id}).title || "";
	}
})