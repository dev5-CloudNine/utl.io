Template.buyerNotifications.helpers({
	'buyerNotifications': function() {
		var notifications = Notifications.find({$and: [{buyerId: Meteor.userId()}, {side: 'buyer'}]}, {sort: {timeStamp: -1}, limit: 10});
		var notificationDetails = [];
		notifications.forEach(function(notification) {
			providerDetails = Profiles.findOne({userId: notification.providerId});
			jobDetails = Jobs.findOne({_id: notification.jobId});
			if(notification.notificationType == 'addFavBuyer') {
				var notif = {
					notificationType: notification.notificationType,
					pname: providerDetails.name,
					_id: providerDetails._id,
					slug: providerDetails.slug(),
					notificationId: notification._id,
					side: notification.side,
					read: notification.read,
					notificationTime: moment(notification.timeStamp).fromNow()
				}
			} else if(notification.notificationType == 'remFavBuyer') {
				var notif = {
					notificationType: notification.notificationType,
					pname: providerDetails.name,
					_id: providerDetails._id,
					slug: providerDetails.slug(),
					notificationId: notification._id,
					side: notification.side,
					read: notification.read,
					notificationTime: moment(notification.timeStamp).fromNow()
				}
			} else {
				if(jobDetails) {
					var notif = {
						notificationType: notification.notificationType,
						pname: providerDetails.name,
						_id: notification.jobId,
						slug: jobDetails.slug(),
						notificationId: notification._id,
						side: notification.side,
						read: notification.read,
						notificationTime: moment(notification.timeStamp).fromNow()
					}
				}
			}
			notificationDetails.push(notif);
		});
		return notificationDetails;
	},
	jobName: function() {
		return Jobs.findOne({_id: this._id}).title || "";
	}
})

Template.buyerNotifications.events({
	'click a.markRead': function(event, template) {
		Meteor.call('markRead', this.notificationId, this.side);
	}
})