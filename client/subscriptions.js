if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
	Meteor.subscribe('userWallet', Meteor.user().invitedBy);
}
if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
	Meteor.subscribe('buyerInvoices', Meteor.userId());
	Meteor.subscribe('my_jobs');
}
if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
	Meteor.subscribe('jobs');
	Meteor.subscribe('providerInvoices', Meteor.userId());
}
Meteor.subscribe('userWallet', Meteor.userId())
Meteor.subscribe("userData");
Meteor.subscribe('providers');
Meteor.subscribe('buyers');
Meteor.subscribe('allDispatchers');
Meteor.subscribe("developerCount");
Meteor.subscribe("userList");
Meteor.subscribe('categories');
Meteor.subscribe('subcategories');
Meteor.subscribe('skills');
Meteor.subscribe('adminJobCount');
Meteor.subscribe('allCompletedJobs');
Meteor.subscribe('usersCount');