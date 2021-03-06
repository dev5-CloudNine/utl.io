Template.adminNotifications.helpers({
	'adminNotifications': function() {
		var notifications = Notifications.find({}, {sort: {timeStamp: -1}}).fetch();
		var notificationDetails = [];
		notifications.forEach(function(notification) {
			var notif = {};
			if(notification.notificationType == 'userSignUp') {
				notif = {
					notificationType: notification.notificationType,
					notificationTime: moment(notification.timeStamp).format('LLLL'),
					notificationId: notification._id
				}
				notificationDetails.push(notif);
			} else if(notification.notificationType == 'newJob') {
				var buyerDetails;
				if(Roles.userIsInRole(notification.buyerId, ['dispatcher'])) {
					buyerDetails = Dispatchers.findOne({userId: notification.buyerId});1
				} else {
					buyerDetails = Buyers.findOne({userId: notification.buyerId});
				}
				var jobDetails = Jobs.findOne({_id: notification.jobId});
				var imgURL = Meteor.users.findOne({_id: notification.buyerId}).imgURL;
				var imgUrl
				if(imgURL)
					imgUrl = imgURL
				else
					imgUrl = '/images/avatar.png';
				notif = {
					notificationType: notification.notificationType,
					notificationTime: moment(notification.timeStamp).format('LLLL'),
					notificationId: notification._id,
					jobId: notification.jobId,
					bname: buyerDetails.firstName + ' ' + buyerDetails.lastName,
					buyerId: buyerDetails._id,
					imgUrl: imgUrl
				}
				notificationDetails.push(notif);
			} else if(notification.notificationType == 'welcomeNotification') {
				return;
			} else {
				var buyerDetails;
				if(Roles.userIsInRole(notification.buyerId, ['dispatcher'])) {
					buyerDetails = Dispatchers.findOne({userId: notification.buyerId});1
				} else {
					buyerDetails = Buyers.findOne({userId: notification.buyerId});
				}
				var providerDetails = Profiles.findOne({userId: notification.providerId});
				var jobDetails = Jobs.findOne({_id: notification.jobId});
				var imgUrl;
				if(notification.side == 'buyer') {
					var imgURL = Meteor.users.findOne({_id: notification.providerId}).imgURL;
					if(imgURL)
						imgUrl = imgURL;
					else
						imgUrl = '/images/avatar.png';
				}
				if(notification.side == 'provider') {
					var imgURL = Meteor.users.findOne({_id: notification.buyerId}).imgURL;
					if(imgURL)
						imgUrl = imgURL;
					else
						imgUrl = '/images/avatar.png';
				}
				if(providerDetails && buyerDetails) {
					notif = {
						buyerId: buyerDetails._id,
						providerId: providerDetails._id,
						notificationType: notification.notificationType,
						notificationTime: moment(notification.timeStamp).format('LLLL'),
						notificationId: notification._id,
						jobId: notification.jobId,
						bname: buyerDetails.firstName + ' ' + buyerDetails.lastName,
						pname: providerDetails.firstName + ' ' + providerDetails.lastName,
						imgUrl: imgUrl
					}
				}
				notificationDetails.push(notif);
			}
		});
		return notificationDetails;
	},
	jobName: function() {
		return Jobs.findOne({_id: this.jobId}).title;
	}
})