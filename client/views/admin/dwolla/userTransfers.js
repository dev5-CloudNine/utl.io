Template.userTransfers.onCreated(function() {
	this.autorun(function() {
		if(Roles.userIsInRole(Meteor.userId(), ['admin']))
			return Meteor.subscribe('wallet');
		return;
	})
})

Template.userTransfers.helpers({
	'userName': function() {
		var userId = Router.current().params.userId;
		if(Roles.userIsInRole(userId, ['buyer'])) {
			var buyerDetails = Buyers.findOne({userId: userId});
			return buyerDetails.firstName + ' ' + buyerDetails.lastName;
		}
	},
	'userTransfers': function() {
		var userWallet = Wallet.findOne({userId: Router.current().params.userId});
		if(userWallet && userWallet.dwollaCustomer && userWallet.fundingSourceUrl) {
			var customerUrl = userWallet.dwollaCustomer['location'][0];
			var transfersUrl = customerUrl + '/transfers'
			Meteor.call('getCustomerTransfers', transfersUrl, function(error, result) {
				if(error) {
					console.log(error)
				} else {
					Session.set('userTransfers', result._embedded.transfers);
				}
			})
			console.log(Session.get('userTransfers'))
			return Session.get('userTransfers')
		}
	}
})