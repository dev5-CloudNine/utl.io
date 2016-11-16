if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
	Meteor.subscribe('userWallet', Meteor.user().invitedBy);
}
Meteor.subscribe('userWallet', Meteor.userId());
Meteor.subscribe("userData");
Meteor.subscribe('corporates');
Meteor.subscribe("jobCount");
Meteor.subscribe('providers');
Meteor.subscribe('buyers');
Meteor.subscribe('dispatchers')
Meteor.subscribe("developerCount");
Meteor.subscribe("userList");
Meteor.subscribe('categories');
Meteor.subscribe('subcategories');
Meteor.subscribe('skills');
Meteor.subscribe('adminJobCount');
Meteor.subscribe('allCompletedJobs');
Meteor.subscribe('usersCount');