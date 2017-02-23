Template.breadcrumbs.onCreated(function() {
	this.autorun(function() {
		if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
			Meteor.subscribe('jobs');
			Meteor.subscribe('allJobs');
			Meteor.subscribe('userWallet', Meteor.userId());
			Meteor.subscribe('messages', Meteor.userId())
			return Meteor.subscribe('providerInvoices', Meteor.userId());
		}
		if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
			Meteor.subscribe('my_jobs');
			Meteor.subscribe('userWallet', Meteor.userId());
			Meteor.subscribe('accountants', Meteor.userId());
			Meteor.subscribe('messages', Meteor.userId())
			return Meteor.subscribe('buyerInvoices', Meteor.userId());
		}
		if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
			Meteor.subscribe('my_jobs');
			Meteor.subscribe('userWallet', Meteor.user().invitedBy);
			Meteor.subscribe('accountants', Meteor.user().invitedBy);
			Meteor.subscribe('messages', Meteor.userId())
			return Meteor.subscribe('buyerInvoices', Meteor.userId());
		}
		if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
			Meteor.subscribe('buyerInvoices', Meteor.userId())
			Meteor.subscribe('messages', Meteor.userId())
			return Meteor.subscribe('userWallet', Meteor.user().invitedBy);
		}
		if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
			Meteor.subscribe('invoices', Meteor.userId());
			Meteor.subscribe('allJobs');
			Meteor.subscribe('allAccountants', Meteor.userId());
			Meteor.subscribe('messages', Meteor.userId())
			return Meteor.subscribe('userWallet', Meteor.userId());
		}
	})
	Blaze._allowJavascriptUrls();
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
	utlEarnings: function() {
		if(Roles.userIsInRole(Meteor.userId(), ['admin']))
			return Wallet.findOne({userId: Meteor.userId()}).amountEarned;
		return;
	},
	userAccountBalance: function() {
		var accountBalance;
		if(Roles.userIsInRole(Meteor.userId(), ['accountant', 'dispatcher'])) {
			accountBalance =  Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
		} else {
			accountBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
		}
		return +(Math.round(accountBalance + 'e+2') + 'e-2');
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