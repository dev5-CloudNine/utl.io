Template.withdraw.helpers({
	accountBalance: function() {
		console.log(Wallet.findOne({userId: Meteor.userId()}));
		return Wallet.findOne({userId: Meteor.userId()}).accountBalance;
	},
	customerTransfers: function() {
		var customerUrl = Wallet.findOne({userId: Meteor.userId()}).dwollaCustomer.location[0];
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
	}
});

Template.withdraw.events({
	'change #requestAmount, keyup #requestAmount': function(event, template) {
		var accountBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
		var reqAmount = $('input#requestAmount').val()
		if(reqAmount > accountBalance) {
			$('.enoughBalance').show();
			$('.submitWithdrawReq').prop('disabled', true);
		} else {
			$('.enoughBalance').hide();
			$('.submitWithdrawReq').prop('disabled', false);
		}
	},
	'submit #requestDwollaPay': function(event, template) {
		event.preventDefault();
		$('.submitWithdrawReq').prop('disabled', true);
		var walletDetails = Wallet.findOne({userId: Meteor.userId()});
		var reqAmount = $('input#requestAmount').val()
		if(reqAmount > walletDetails.accountBalance) {
			$('.enoughBalance').show();
			$('.submitWithdrawReq').prop('disabled', true);
			return;
		} else {
			$('.enoughBalance').hide();
			var fundingSourceUrl = walletDetails.dwollaFundingSource.location[0];
			Meteor.call('initiatePayment', fundingSourceUrl, reqAmount, function(error, result) {
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
	}
})