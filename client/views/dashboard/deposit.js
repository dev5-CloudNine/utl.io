var deposits = function() {
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

Template.deposit.rendered =  function() {
	$('#date_of_birth').datepicker();
}

Template.deposit.helpers({
	accountBalance: function() {
		return Wallet.findOne({userId: Meteor.userId()}).accountBalance;
	},
	previousDeposits: function() {
		return deposits;
	},
	previousDepositOptions: previousDepositOptions,
	dwollaCustomer: function() {
		var userWallet = Wallet.findOne({userId: Meteor.userId()});
		if(userWallet.dwollaCustomer && userWallet.dwollaFundingSource) {
			return true;
		}
		return false;
	}
});

Template.deposit.events({
	'keyup input[name="social_security_no"], keydown input[name="social_security_no"]': function(event, template) {
		if (!((event.keyCode == 46 || 
			event.keyCode == 8  || 
			event.keyCode == 37 || 
			event.keyCode == 39 || 
			event.keyCode == 9) || 
			$(event.currentTarget).val().length < 4 &&
			((event.keyCode >= 48 && event.keyCode <= 57) ||
			(event.keyCode >= 96 && event.keyCode <= 105)))) {
			event.preventDefault();
			return false;
		}
	},
	'submit #register_dwolla': function(event, template) {
		event.preventDefault();
		var buyerDetails = Buyers.findOne({userId: Meteor.userId()});
		var dwolla_req_obj = {
			firstName: buyerDetails.firstName,
			lastName: buyerDetails.lastName,
			email: buyerDetails.userName,
			address1: buyerDetails.fullLocation.street,
			city:  buyerDetails.fullLocation.locality,
			state: buyerDetails.fullLocation.state,
			postalCode: buyerDetails.fullLocation.zip,
			dateOfBirth: moment($('#date_of_birth').val()).format('YYYY-MM-DD'),
			ssn: $('#social_security_no').val(),
			phone: buyerDetails.contactNumber,
			account_no: $('#bank_account_no').val(),
			routing_no: $('#routing_number').val(),
			account_type: $('input[name="account_type"]:checked').val()
		}
		Meteor.call('createCustomer', dwolla_req_obj, buyerDetails.userId, function(error, result) {
			if(error) {
				console.log(error);
			} else {
				console.log(result);
			}
		});
	},
	'submit #dwolla_deposit': function(event, template) {
		event.preventDefault();
		var walletDetails = Wallet.findOne({userId: Meteor.userId()});
		$('.submitWithdrawReq').prop('disabled', true);
		var reqAmount = $('input#requestAmount').val()
		$('.enoughBalance').hide();
		var fundingSourceUrl = walletDetails.dwollaFundingSource.location[0];
		Meteor.call('initiatePayment', fundingSourceUrl, Meteor.userId(), reqAmount, function(error, result) {
			if(error) {
				console.log(error);
			} else {
				Meteor.call('updateWalletAfterTransfer', reqAmount, Meteor.userId());
				var transferUrl = result._headers.location[0];
				var n = transferUrl.lastIndexOf('/');
				var transferId = transferUrl.substring(n + 1);
				Router.go('transferDetails', {id: transferId});
				$('.submitWithdrawReq').prop('disabled', false);
			}
		})
	}
})