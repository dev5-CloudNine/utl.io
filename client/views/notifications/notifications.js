Template.notifications.helpers({
	'buyerNotifications': function() {
		var notifications = Notifications.find({$and: [{buyerId: Meteor.userId()}, {side: 'buyer'}]}, {sort: {timeStamp: -1}, limit: 10});
		var notificationDetails = [];
		notifications.forEach(function(notification) {
			providerDetails = Profiles.findOne({userId: notification.providerId});
			jobDetails = Jobs.findOne({_id: notification.jobId});
			var imgUrl;
			var img = Users.findOne({_id: notification.providerId}).imgURL;
			if(img)
				imgUrl = img;
			if(notification.notificationType == 'addFavBuyer') {
				var notif = {
					imgUrl: imgUrl,
					notificationType: notification.notificationType,
					pname: providerDetails.name,
					providerId: providerDetails._id,
					slug: providerDetails.slug(),
					notificationId: notification._id,
					side: notification.side,
					read: notification.read,
					notificationTime: moment(notification.timeStamp).fromNow()
				}
			} else if(notification.notificationType == 'remFavBuyer') {
				var notif = {
					imgUrl: imgUrl,
					notificationType: notification.notificationType,
					pname: providerDetails.name,
					providerId: providerDetails._id,
					slug: providerDetails.slug(),
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
						providerId: providerDetails._id,
						pname: providerDetails.name,
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
	},
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
					jobId: notification.jobId,
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