Template.providerNotifications.helpers({
	'providerNotifications': function() {
		var notifications = Notifications.find({$and: [{providerId: Meteor.userId()}, {side: 'provider'}]}, {sort: {timeStamp: -1}});
		var notificationDetails = [];
		notifications.forEach(function (notification) {
			buyerDetails = Buyers.findOne({userId: notification.buyerId});
			jobDetails = Jobs.findOne({_id: notification.jobId});
			var imgUrl;
			var img = Users.findOne({_id: notification.buyerId}).imgURL;
			if(img)
				imgUrl = img;
			if(notification.notificationType == 'addFavProvider') {
				var notif = {
					imgUrl: imgUrl,
					notificationType: notification.notificationType,
					bname: buyerDetails.name,
					buyerId: buyerDetails._id,
					slug: buyerDetails.slug(),
					notificationId: notification._id,
					side: notification.side,
					read: notification.read,
					notificationTime: moment(notification.timeStamp).fromNow()
				} 

			} else if(notification.notificationType == 'remFavProvider') {
				var notif = {
					imgUrl: imgUrl,
					notificationType: notification.notificationType,
					bname: buyerDetails.name,
					buyerId: buyerDetails._id,
					slug: buyerDetails.slug(),
					notificationId: notification._id,
					side: notification.side,
					read: notification.read,
					notificationTime: moment(notification.timeStamp).fromNow()
				}
			} else {
				if(jobDetails) {
					var notif = {
						imgUrl: imgUrl,
						notificationType: notification.notificationType,
						bname: buyerDetails.name,
						buyerId: buyerDetails._id,
						jobId: notification.jobId,
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
		return Jobs.findOne({_id: this.jobId}).title || "";
	}
})

Template.providerNotifications.events({
	'click a.markRead': function(event, template) {
		Meteor.call('markRead', this.notificationId, this.side);
	}
})