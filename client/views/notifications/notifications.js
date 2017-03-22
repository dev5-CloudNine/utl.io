Template.notifications.onCreated(function() {
	var instance = this;
	instance.autorun(function() {
		return Meteor.subscribe('allJobs')
	})
})

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
						jobReadableId: jobDetails.readableID,
						notificationTime: moment(notification.timeStamp).format('LLLL')
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
		var notifications = Notifications.find({$and: [{providerId: Meteor.userId()}, {side: 'provider'}]}, {sort: {timeStamp: -1}, limit: 10});
		var notificationDetails = [];
		notifications.forEach(function (notification) {
			var buyerDetails;
			if(Roles.userIsInRole(notification.buyerId, ['dispatcher'])) {
				buyerDetails = Dispatchers.findOne({userId: notification.buyerId});1
			} else {
				buyerDetails = Buyers.findOne({userId: notification.buyerId});
			}
			var jobDetails = Jobs.findOne({_id: notification.jobId});
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
						jobReadableId: jobDetails.readableID,
						notificationTime: moment(notification.timeStamp).format('LLLL')
					}
				}
			}
			notificationDetails.push(notif);
		});
		return notificationDetails;
	},
	'adminNotifications': function() {
		var notifications = Notifications.find({}, {sort: {timeStamp: -1}, limit: 10}).fetch();
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
					buyerDetails = Dispatchers.findOne({userId: notification.buyerId});
				} else {
					buyerDetails = Buyers.findOne({userId: notification.buyerId});
				}
				var jobDetails = Jobs.findOne({_id: notification.jobId});
				var imgUrl;
				var imgURL = Meteor.users.findOne({_id: notification.buyerId}).imgURL;
				if(imgURL)
					imgUrl = imgURL;
				else
					imgUrl = '/images/avatar.png';
				notif = {
					notificationType: notification.notificationType,
					notificationTime: moment(notification.timeStamp).format('LLLL'),
					notificationId: notification._id,
					jobId: notification.jobId,
					jobReadableId: jobDetails.readableID,
					bname: buyerDetails.firstName + ' ' + buyerDetails.lastName,
					imgUrl: imgUrl
				}
				notificationDetails.push(notif);
			} else if(notification.notificationType == 'welcomeNotification') {
				return;
			} else if(notification.notificationType == 'addFavProvider') {
				var buyerDetails;
				if(Roles.userIsInRole(notification.buyerId, ['dispatcher'])) {
					buyerDetails = Dispatchers.findOne({userId: notification.buyerId});
				} else {
					buyerDetails = Buyers.findOne({userId: notification.buyerId});
				}
				var imgUrl;
				var img = Meteor.users.findOne({_id: notification.buyerId}).imgURL;
				if(img)
					imgUrl = img;
				else
					imgUrl = '/images/avatar.png';
				var providerDetails = Profiles.findOne({userId: notification.providerId});
				var notif = {
					notificationType: notification.notificationType,
					notificationTime: moment(notification.timeStamp).format('LLLL'),
					notificationId: notification._id,
					bname: buyerDetails.firstName + ' ' + buyerDetails.lastName,
					pname: providerDetails.firstName + ' ' + providerDetails.lastName,
					imgUrl: imgUrl
				}
				notificationDetails.push(notif)
			} else {
				var buyerDetails;
				var providerDetails = Profiles.findOne({userId: notification.providerId});
				var jobDetails = Jobs.findOne({_id: notification.jobId});
				if(Roles.userIsInRole(notification.buyerId, ['dispatcher'])) {
					buyerDetails = Dispatchers.findOne({userId: notification.buyerId});
				} else {
					buyerDetails = Buyers.findOne({userId: notification.buyerId});
				}
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
					if(jobDetails) {
						notif = {
							notificationType: notification.notificationType,
							notificationTime: moment(notification.timeStamp).format('LLLL'),
							notificationId: notification._id,
							jobId: notification.jobId,
							jobReadableId: jobDetails.readableID,
							bname: buyerDetails.firstName + ' ' + buyerDetails.lastName,
							pname: providerDetails.firstName + ' ' + providerDetails.lastName,
							imgUrl: imgUrl
						}
					}
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
	'click div.markRead': function(event, template) {
		Meteor.call('markRead', this.notificationId, this.side);
	}
});
