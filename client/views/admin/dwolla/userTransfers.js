Template.userTransfers.onCreated(function() {
	this.autorun(function() {
		if(Roles.userIsInRole(Meteor.userId(), ['admin']))
			if(Roles.userIsInRole(Router.current().params.userId, ['buyer'])) {
				Meteor.subscribe('userTransactions', Router.current().params.userId);
			}
			return Meteor.subscribe('wallet');
		return;
	})
})

var deposits = function() {
	return Transactions.find({userID: Router.current().params.userId}).fetch();
}

var previousDepositOptions = {
	lengthMenu: [40, 80, 160, 320],
    pageLength: 40,
	order: [[4, 'desc']],
	columns: [
		{
			title: 'Transaction ID',
			data: function(transaction) {
				var transactionLink = '<a href="/wallet/deposit/transaction/' + transaction._id + '">' + transaction.trans_id + '</a>';
				return transactionLink;
			}
		},
		{
			title: 'Transaction Amount',
			data: function(transaction) {
				return transaction.dollarAmount;
			}
		},
		{
			title: 'Deposited By',
			data: function(transaction) {
				if(Roles.userIsInRole(transaction.depositedBy, ['buyer'])) {
					var buyerDetails = Buyers.findOne({userId: transaction.depositedBy});
					var buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a>';
					return buyerLink;
				} else {
					var accountantDetails = Accountants.findOne({userId: transaction.depositedBy});
					var accountantLink = '<a href="/accountants/' + accountantDetails._id + '">' + accountantDetails.firstName + ' ' + accountantDetails.lastName + '</a>';
					return accountantLink;
				}
			}
		},
		{
			title: 'Transaction Status',
			data: function(transaction) {
				return transaction.bankMessage;
			}
		},
		{
			title: 'Date/Time',
			data: function(transaction) {
				if(transaction.createdAt) {
					return moment(transaction.createdAt).format('LLLL')
				} else {
					return '';
				}
			}
		}
	]
}

Template.userTransfers.helpers({
	'isProvider': function() {
		var userId = Router.current().params.userId;
		if(Roles.userIsInRole(userId, ['provider']) && Meteor.users.findOne({_id: userId}).isDeveloper) {
			return true;
		}
		return false;
	},
	'isBuyer': function() {
		var userId = Router.current().params.userId;
		if(Roles.userIsInRole(userId, ['buyer']) && Meteor.users.findOne({_id: userId}).isBuyer) {
			return true;
		}
		return false;
	},
	previousDeposits: function() {
		return deposits;
	},
	previousDepositOptions: previousDepositOptions,
	'userName': function() {
		var userId = Router.current().params.userId;
		if(Roles.userIsInRole(userId, ['buyer'])) {
			var buyerDetails = Buyers.findOne({userId: userId});
			return buyerDetails.firstName + ' ' + buyerDetails.lastName;
		}
		if(Roles.userIsInRole(userId, ['dispatcher'])) {
			var buyerDetails = Dispatchers.findOne({userId: userId});
			return buyerDetails.firstName + ' ' + buyerDetails.lastName;
		}
		if(Roles.userIsInRole(userId, ['provider'])) {
			var providerDetails = Profiles.findOne({userId: userId});
			return providerDetails.firstName + ' ' + providerDetails.lastName;
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
			return Session.get('userTransfers')
		}
	}
})