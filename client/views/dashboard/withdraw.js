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

Template.withdraw.rendered =  function() {
	$('#date_of_birth').datepicker();
}

Template.withdraw.events({
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
	'submit #pro_register_dwolla': function(event, template) {
		event.preventDefault();
		var providerDetails = Profiles.findOne({userId: Meteor.userId()});
		var dwolla_req_obj = {
			firstName: providerDetails.firstName,
			lastName: providerDetails.lastName,
			email: providerDetails.userName,
			address1: providerDetails.fullLocation.street,
			city:  providerDetails.fullLocation.locality,
			state: providerDetails.fullLocation.state,
			postalCode: providerDetails.fullLocation.zip,
			dateOfBirth: moment($('#date_of_birth').val()).format('YYYY-MM-DD'),
			ssn: $('#social_security_no').val(),
			phone: providerDetails.contactNumber,
			account_no: $('#bank_account_no').val(),
			routing_no: $('#routing_number').val(),
			account_type: $('input[name="account_type"]:checked').val()
		}
		Meteor.call('createCustomer', dwolla_req_obj, providerDetails.userId, function(error, result) {
			if(error) {
				console.log(error);
			} else {
				console.log(result);
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
	},
	'click .startIav': function(event, template) {
		event.preventDefault();
		var customerUrl = Wallet.findOne({userId: Meteor.userId()}).dwollaCustomer.location[0];
		Meteor.call('genIavToken', customerUrl, function(error, result) {
			if(!error) {
				var iavToken = result.body.token;
				dwolla.config.dwollaUrl = 'https://uat.dwolla.com';
				dwolla.configure('uat');
                dwolla.iav.start('initiateProIav', iavToken, function(err, res) {
                    if(err) {
                        console.log(err);
                    } else {
                    	var fundingSourceUrl = res._links['funding-source'].href;
                        Meteor.call('setFundingSourceInWallet', fundingSourceUrl, Meteor.userId());
                    }
                })
			}
		})
	}
});

Template.withdraw.rendered = function() {
	$('#spinner').hide();
}