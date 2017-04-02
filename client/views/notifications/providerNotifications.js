Template.providerNotifications.helpers({
	'providerNotifications': function() {
		var notifications = Notifications.find({$and: [{providerId: Meteor.userId()}, {side: 'provider'}]}, {sort: {timeStamp: -1}});
		var notificationDetails = [];
		notifications.forEach(function (notification) {
			var buyerDetails;
			if(Roles.userIsInRole(notification.buyerId, ['dispatcher'])) {
				buyerDetails = Dispatchers.findOne({userId: notification.buyerId});1
			} else {
				buyerDetails = Buyers.findOne({userId: notification.buyerId});
			}
			jobDetails = Jobs.findOne({_id: notification.jobId});
			var imgUrl;
			var img = Users.findOne({_id: notification.buyerId}).imgURL;
			if(img)
				imgUrl = img;
			else
				imgUrl = '/images/avatar.png';
			if(notification.notificationType == 'addFavProvider') {
				var notif = {
					imgUrl: imgUrl,
					notificationType: notification.notificationType,
					bname: buyerDetails.firstName + ' ' + buyerDetails.lastName,
					buyerId: buyerDetails._id,
					slug: buyerDetails.slug(),
					notificationId: notification._id,
					side: notification.side,
					read: notification.read,
					notificationTime: moment(notification.timeStamp).format('LLLL')
				} 

			} else if(notification.notificationType == 'remFavProvider') {
				var notif = {
					imgUrl: imgUrl,
					notificationType: notification.notificationType,
					bname: buyerDetails.firstName + ' ' + buyerDetails.lastName,
					buyerId: buyerDetails._id,
					slug: buyerDetails.slug(),
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
						bname: buyerDetails.firstName + ' ' + buyerDetails.lastName,
						buyerId: buyerDetails._id,
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

Template.providerNotifications.events({
	'click div.markRead': function(event, template) {
		Meteor.call('markRead', this.notificationId, this.side);
	}
})