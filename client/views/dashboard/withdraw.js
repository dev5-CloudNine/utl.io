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
		if(Session.get('customerTransfers')) {
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
	},
	dwollaCustomer: function() {
		var userWallet = Wallet.findOne({userId: Meteor.userId()});
		if(userWallet.dwollaCustomer) {
			return true;
		}
		return false;
	},
	fundingSourceUrl: function() {
		var userWallet = Wallet.findOne({userId: Meteor.userId()});
		if(userWallet.fundingSourceUrl)
			return true;
		return false;
	}
});

Template.withdraw.onCreated =  function() {
	this.autorun(function() {
		return Meteor.subscribe('userWallet', Meteor.userId());
	})
}

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
	'click #pro_register_dwolla': function(event, template) {
		event.preventDefault();
		$(event.currentTarget).button('loading');
		var providerDetails = Profiles.findOne({userId: Meteor.userId()});
		var dwolla_req_obj = {
			firstName: providerDetails.firstName,
			lastName: providerDetails.lastName,
			email: providerDetails.userName
		}
		Meteor.call('createCustomer', dwolla_req_obj, providerDetails.userId, function(error, result) {
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
	'submit #requestDwollaPay': function(event, template) {
		event.preventDefault();
		$('#spinner').show();
		$('.submitWithdrawReq').prop('disabled', true);
		var walletDetails = Wallet.findOne({userId: Meteor.userId()});
		var reqAmount = $('input#requestAmount').val()
		if(reqAmount > walletDetails.accountBalance) {
			$('.enoughBalance').show();
			$('.submitWithdrawReq').prop('disabled', true);
			return;
		} else {
			$('.enoughBalance').hide();
			var fundingSourceUrl = walletDetails.fundingSourceUrl;
			Meteor.call('initiatePayment', fundingSourceUrl, Meteor.userId(), reqAmount, function(error, result) {
				if(error) {
					console.log(error);
				} else {
					Meteor.call('updateWalletAfterTransfer', reqAmount, Meteor.userId());
					$('.submitWithdrawReq').prop('disabled', false);
					$('#spinner').hide();
					$('input#requestAmount').val('');
				}
			})
		}
	}
});

Template.withdraw.rendered = function() {
	$('#spinner').hide();
}