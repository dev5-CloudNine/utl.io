UI.registerHelper("formatDate", function(timestamp) {
	if(timestamp)
		return moment(timestamp).format('LLLL');
});

UI.registerHelper("currentUserDisplayName", function() {
	return getUserName(Meteor.user());
});

UI.registerHelper('blendedTotalHours', function(firstHours, nextHours) {
	return (firstHours + nextHours);
});

UI.registerHelper("currentUserEmail", function() {
	return getUserEmail(Meteor.user());
});

UI.registerHelper("resizeImageUrl", function(imageUrl, height, width) {
	if(imageUrl)
      return imageUrl + "-/resize/" + height + "x" + width + "/";
});

UI.registerHelper('toUpperCase', function(stringToConvert) {
	return stringToConvert.toUpperCase();
});

UI.registerHelper('buyerNotificationCount', function(userId) {
	return Notifications.find({$and: [{buyerId: userId}, {side: 'buyer'}, {read: false}]}).count();
});

UI.registerHelper('providerNotificationCount', function(userId) {
	return Notifications.find({$and: [{providerId: userId}, {side: 'provider'}, {read: false}]}).count();
})

UI.registerHelper('unreadMsgCount', function(userId) {
	return Messages.find({$and: [{recipient: userId}, {read: false}]}).count();
});

UI.registerHelper('openJobsCount', function() {
	return Jobs.find({$and: [{status: 'active'}, {$or: [{applicationStatus: 'open'}, {applicationStatus: 'frozen'}]}, {invited: false}]}).count();
})

UI.registerHelper('recommendedJobsCount', function() {
	var jobCategories = Profiles.findOne({userId: Meteor.userId()}).industryTypes;
	Meteor.subscribe('recommendedJobs', jobCategories);
	return Jobs.find({$and: [{applicationStatus: 'open'}, {jobSubCategory: {$in: jobCategories}}, {status: 'active'}]}).count()
});

UI.registerHelper('providerInvitedCount', function() {
	var invitedJobs = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
	if(invitedJobs) {
		return invitedJobs.length;
	}
	return 0;
})