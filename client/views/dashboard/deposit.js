var deposits = function() {
	if(Roles.userIsInRole(Meteor.userId(), ['accountant']))
		return Transactions.find({userID: Meteor.user().invitedBy}).fetch();
	return Transactions.find({userID: Meteor.userId()}).fetch();
}

var previousDepositOptions = {
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
				if(transaction.dateOrTime) {
					return transaction.dateOrTime;
				} else {
					return '';
				}
			}
		}
	]
}

Template.deposit.onCreated(function() {
	this.autorun(function() {
		return Meteor.subscribe('userWallet', Meteor.userId());
	})
})

Template.deposit.helpers({
	accountBalance: function() {
		if(Roles.userIsInRole(Meteor.userId(), ['accountant', 'dispatcher']))
			return Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
		return Wallet.findOne({userId: Meteor.userId()}).accountBalance;
	},
	previousDeposits: function() {
		return deposits;
	},
	previousDepositOptions: previousDepositOptions,
	dwollaCustomer: function() {
		var userWallet = Wallet.findOne({userId: Meteor.userId()});
		if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
			return Wallet.findOne({userId: Meteor.user().invitedBy}).dwollaCustomer? true: false;
		}
		if(userWallet.dwollaCustomer) {
			return true;
		}
		return false;
	},
	fundingSourceUrl: function() {
		var userWallet = Wallet.findOne({userId: Meteor.userId()});
		if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
			return Wallet.findOne({userId: Meteor.user().invitedBy}).fundingSourceUrl? true: false;
		}
		if(userWallet.fundingSourceUrl)
			return true;
		return false;
	},
	customerTransfers: function() {
		var userWallet = Wallet.findOne({userId: Meteor.userId()});
		var customerUrl;
		if(userWallet.dwollaCustomer && userWallet.fundingSourceUrl) {
			customerUrl = userWallet.dwollaCustomer.location[0];
			var customerTransfersUrl = customerUrl + '/transfers'
			Meteor.call('getCustomerTransfers', customerTransfersUrl, function(error, result) {
				if(error)
					console.log(error);
				else {
					Session.set('customerTransfers', result._embedded.transfers);
				}
			});
			return Session.get('customerTransfers').map(function(transfer) {
				var obj = {
					id: transfer.id,
					status: transfer.status,
					created: moment.utc(transfer.created).format('MM/DD/YYYY, hh:mm:ss A'),
					amount: transfer.amount
				}
				return obj;
			})
		} else {
			return;
		}
	}
});

Template.deposit.events({
	'click #register_dwolla': function(event, template) {
		event.preventDefault();
		$(event.currentTarget).button('loading');
		var buyerDetails = Buyers.findOne({userId: Meteor.userId()});
		var dwolla_req_obj = {
			firstName: buyerDetails.firstName,
			lastName: buyerDetails.lastName,
			email: buyerDetails.userName
		}
		Meteor.call('createCustomer', dwolla_req_obj, buyerDetails.userId, function(error, result) {
			if(error) {
				console.log(error);
			} else {
				if(result.status == 401) {
					toastr.error('There was an error creating the customer. Try again!');
					$(event.currentTarget).button('reset');
				}
				else if(result.status == 400) {
					var msg = result.body._embedded.errors[0].message;
					toastr.error(msg);
					$(event.currentTarget).button('reset');
				} else {
					Router.go('attachBankAccount');
				}
			}
		});
	},
	'submit #dwolla_deposit': function(event, template) {
		event.preventDefault();
		$('#depositBtn').button('loading');
		var walletDetails;
		if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
			walletDetails = Wallet.findOne({userId: Meteor.userId()});
		else if(Roles.userIsInRole(Meteor.userId(), ['accountant']))
			walletDetails = Wallet.findOne({userId: Meteor.user().invitedBy});
		var reqAmount = $('input#dwolla_amount').val();
		console.log(reqAmount);
		$('.enoughBalance').hide();
		var fundingSourceUrl = walletDetails.fundingSourceUrl;
		Meteor.call('initiatePayment', fundingSourceUrl, walletDetails.userId, reqAmount, function(error, result) {
			if(error) {
				console.log(error);
			} else {
				Meteor.call('updateBuyerWallet', reqAmount, walletDetails.userId);
				var transferUrl = result._headers.location[0];
				var n = transferUrl.lastIndexOf('/');
				var transferId = transferUrl.substring(n + 1);
				Router.go('transferDetails', {id: transferId});
				$('#depositBtn').button('reset');
			}
		})
	},
	// 'click .startIav': function(event, template) {
	// 	event.preventDefault();
	// 	$(event.currentTarget).button('loading');
	// 	var customerUrl = Wallet.findOne({userId: Meteor.userId()}).dwollaCustomer.location[0];
	// 	console.log(customerUrl);
	// 	Meteor.call('genIavToken', customerUrl, function(error, result) {
	// 		if(!error) {
	// 			var iavToken = result.body.token;
	// 			dwolla.config.dwollaUrl = 'https://uat.dwolla.com';
	// 			dwolla.configure('uat');
 //                dwolla.iav.start('initiateIav', iavToken, function(err, res) {
 //                    if(err) {
 //                        console.log(err);
 //                    } else {
 //                    	var fundingSourceUrl = res._links['funding-source'].href;
 //                        Meteor.call('setFundingSourceInWallet', fundingSourceUrl, Meteor.userId());
 //                    }
 //                })
	// 		} else {
	// 			console.log(error)
	// 		}
	// 	})
	// }
})