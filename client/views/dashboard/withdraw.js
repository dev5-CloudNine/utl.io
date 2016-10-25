Template.withdraw.helpers({
	accountBalance: function() {
		console.log(Wallet.findOne({userId: Meteor.userId()}));
		return Wallet.findOne({userId: Meteor.userId()}).accountBalance;
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
		var walletDetails = Wallet.findOne({userId: Meteor.userId()});
		var reqAmount = $('input#requestAmount').val()
		if(reqAmount > walletDetails.accountBalance) {
			$('.enoughBalance').show();
			$('.submitWithdrawReq').prop('disabled', true);
			return;
		} else {
			$('.enoughBalance').hide();
			$('.submitWithdrawReq').prop('disabled', false);
			var fundingSourceUrl = walletDetails.dwollaFundingSource.location[0];
			Meteor.call('initiatePayment', fundingSourceUrl, reqAmount, function(error, result) {
				if(error) {
					console.log(error);
				} else {
					console.log(result);
				}
			})
		}
	}
})