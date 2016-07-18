var allTransactions = function() {
	return Transactions.find().fetch();
}

var adminOptionsObject = {
	columns: [
		{
			title: 'Transaction Id',
			data: function(transaction) {
				var transactionLink = '<a href="/wallet/deposit/transaction/' + transaction._id + '">' + transaction._id + '</a>';
				return transactionLink;
			}
		},
		{
			title: 'User',
			data: function(transaction) {
				if(Roles.userIsInRole(transaction.userID, ['buyer', 'corporate-manager'])) {
					var buyerDetails = Buyers.findOne({userId: transaction.userID});
					var buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.name + '</a>';
					return buyerLink;
				}
				if(Roles.userIsInRole(transaction.userID, ['provider', 'corporate-provider'])) {
					var providerDetails = Profiles.findOne({userId: transaction.userID});
					var providerLink = '<a href="/profiles/' + providerDetails._id + '">' + providerDetails.name + '</a>';
					return providerLink;
				}
				if(Roles.userIsInRole(transaction.userID, ['corporate-admin'])) {
					var corporateDetails = Corporates.findOne({userId: transaction.userID});
					var corporateLink = '<a href="/corporates/' + corporateDetails._id + '">' + corporateDetails.name + '</a>';
					return corporateLink;
				}
			}
		},
		{
			title: 'Transaction Amount',
			data: function(transaction) {
				return '$' + transaction.dollarAmount;
			}
		},
		{
			title: 'Status',
			data: function(transaction) {
				return transaction.bankMessage;
			}
		}
	]
}

Template.allTransactions.helpers({
	allTransactions: function() {
		return allTransactions;
	},
	adminOptionsObject: adminOptionsObject
})