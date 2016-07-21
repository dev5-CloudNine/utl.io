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

Template.deposit.helpers({
	accountBalance: function() {
		return Wallet.findOne({userId: Meteor.userId()}).accountBalance;
	},
	previousDeposits: function() {
		return deposits;
	},
	previousDepositOptions: previousDepositOptions
})