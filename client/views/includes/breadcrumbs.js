Template.breadcrumbs.onCreated(function() {
	Blaze._allowJavascriptUrls();
	if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
		Meteor.subscribe('userWallet', Meteor.userId());
		Meteor.subscribe('providerInvoices', Meteor.userId());
	}
	if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
		Meteor.subscribe('userWallet', Meteor.userId());
		Meteor.subscribe('buyerInvoices', Meteor.userId());
	}
	if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
		Meteor.subscribe('userWallet', Meteor.user().invitedBy);
		Meteor.subscribe('buyerInvoices', Meteor.userId());
	}
	if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
		Meteor.subscribe('userWallet', Meteor.user().invitedBy);
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
})