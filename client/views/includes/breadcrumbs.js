Template.breadcrumbs.onCreated(function() {
	Blaze._allowJavascriptUrls();
});

Template.breadcrumbs.helpers({
	buyer: function() {
		return Buyers.findOne({userId: Meteor.userId()});
	},
	profile: function() {
		return Profiles.findOne({userId: Meteor.userId()});
	},
	userAccountBalance: function() {
		if(Roles.userIsInRole(Meteor.userId(), ['dispatcher', 'accountant'])) {
			return Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
		}
		return Wallet.findOne({userId: Meteor.userId()}).accountBalance;
	}
})