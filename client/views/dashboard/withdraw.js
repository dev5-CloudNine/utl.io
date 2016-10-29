Template.withdraw.created = function() {
	var customerUrl = Wallet.findOne({userId: Meteor.userId()}).dwollaCustomer.location[0];
	var customerTransfersUrl = customerUrl + '/transfers'
	Meteor.call('getCustomerTransfers', customerTransfersUrl, function(error, result) {
		var tableData = function() {
			var tdata = '';
			for(var i=0; i < result._embedded.transfers.length; i++) {
				tdata += '<tr><td>' + result._embedded.transfers[i].id + '</td><td>' + result._embedded.transfers[i].created + '</td><td>$ ' + result._embedded.transfers[i].amount.value + ' ' + result._embedded.transfers[i].amount.currency.toUpperCase() + '</td><td>' + result._embedded.transfers[i].status + '</td></tr>';
			}
			return tdata;
		}
		if(error)
			console.log(error);
		else {
			$('.customerFST').html('<hr><h3>Transfers</h3><table class="table table-striped"><tr><th>Transfer ID</th><th>Date</th><th>Amount</th><th>Status</th></tr>' + tableData() +' </table>');
		}
	});
}

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