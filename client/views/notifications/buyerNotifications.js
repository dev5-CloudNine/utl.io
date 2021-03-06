Template.buyerNotifications.helpers({
	'buyerNotifications': function() {
		var notifications = Notifications.find({$and: [{buyerId: Meteor.userId()}, {side: 'buyer'}]}, {sort: {timeStamp: -1}});
		var notificationDetails = [];
		notifications.forEach(function(notification) {
			providerDetails = Profiles.findOne({userId: notification.providerId});
			jobDetails = Jobs.findOne({_id: notification.jobId});
			var imgUrl;
			var img = Users.findOne({_id: notification.providerId}).imgURL;
			if(img)
				imgUrl = img;
			else
				imgUrl = '/images/avatar.png';
			if(notification.notificationType == 'addFavBuyer') {
				var notif = {
					imgUrl: imgUrl,
					notificationType: notification.notificationType,
					pname: providerDetails.firstName + ' ' + providerDetails.lastName,
					providerId: providerDetails._id,
					slug: providerDetails.slug(),
					notificationId: notification._id,
					side: notification.side,
					read: notification.read,
					notificationTime: moment(notification.timeStamp).format('LLLL')
				}
			} else if(notification.notificationType == 'remFavBuyer') {
				var notif = {
					imgUrl: imgUrl,
					notificationType: notification.notificationType,
					pname: providerDetails.firstName + ' ' + providerDetails.lastName,
					providerId: providerDetails._id,
					slug: providerDetails.slug(),
					notificationId: notification._id,
					side: notification.side,
					read: notification.read,
					notificationTime: moment(notification.timeStamp).format('LLLL')
				}
			} else {
				if(jobDetails) {
					var notif = {
						imgUrl: imgUrl,
						notificationType: notification.notificationType,
						providerId: providerDetails._id,
						pname: providerDetails.firstName + ' ' + providerDetails.lastName,
						jobId: notification.jobId,
						slug: jobDetails.slug(),
						notificationId: notification._id,
						side: notification.side,
						read: notification.read,
						notificationTime: moment(notification.timeStamp).format('LLLL')
					}
				}
			}
			notificationDetails.push(notif);
		});
		return notificationDetails;
	},
	jobDetails: function(jobId) {
		return Jobs.findOne({_id: jobId});
	}
})

Template.buyerNotifications.events({
	'click div.markRead': function(event, template) {
		Meteor.call('markRead', this.notificationId, this.side);
	}
})