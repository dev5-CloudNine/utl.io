Template.breadcrumbs.onCreated(function() {
	Blaze._allowJavascriptUrls();
	if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
		Meteor.subscribe('jobs');
		Meteor.subscribe('allJobs');
		Meteor.subscribe('userWallet', Meteor.userId());
		return Meteor.subscribe('providerInvoices', Meteor.userId());
	}
	if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
		Meteor.subscribe('my_jobs');
		Meteor.subscribe('userWallet', Meteor.userId());
		return Meteor.subscribe('buyerInvoices', Meteor.userId());
	}
	if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
		Meteor.subscribe('my_jobs');
		Meteor.subscribe('userWallet', Meteor.user().invitedBy);
		return Meteor.subscribe('buyerInvoices', Meteor.userId());
	}
	if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
		return Meteor.subscribe('userWallet', Meteor.user().invitedBy);
	}
	if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
		Meteor.subscribe('invoices', Meteor.userId());
		return Meteor.subscribe('userWallet', Meteor.userId());
	}
});

Template.breadcrumbs.helpers({
	buyer: function() {
		return Buyers.findOne({userId: Meteor.userId()});
	},
	dispatcher: function() {
		return Dispatchers.findOne({userId: Meteor.userId()});
	},
	accountant: function() {
		return Accountants.findOne({userId: Meteor.userId()});
	},
	profile: function() {
		return Profiles.findOne({userId: Meteor.userId()});
	},
	profileCreated: function() {
		return Meteor.user().isDeveloper || Meteor.user().isBuyer || Meteor.user().isDispatcher || Meteor.user().isAccountant;
	}
});

Template.breadcrumbs.events({
	'click .authUrl' : function(){
		Meteor.call('authUrl', Meteor.userId(), function (error, result) {
			if(error){
				console.log(error);
				return;
			}
			window.location = result;
		});
	},
})