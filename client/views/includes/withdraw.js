Template.withdraw.helpers({
	accountBalance: function() {
		return Wallet.findOne({userId: Meteor.userId()}).accountBalance;
	}
})