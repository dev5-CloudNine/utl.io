var allDeposits = function() {
	return Transactions.find().fetch();
}

var adminOptionsObject = {
	columns: [
		{
			title: 'Transaction Id',
			data: function(transaction) {
				var transactionLink = '<a href="/wallet/deposit/transaction/' + transaction._id + '">' + transaction.trans_id + '</a>';
				return transactionLink;
			}
		},
		{
			title: 'User',
			data: function(transaction) {
				if(Roles.userIsInRole(transaction.userID, ['buyer', 'corporate-manager'])) {
					var buyerDetails = Buyers.findOne({userId: transaction.userID});
					var buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a>';
					return buyerLink;
				}
				if(Roles.userIsInRole(transaction.userID, ['provider', 'corporate-provider'])) {
					var providerDetails = Profiles.findOne({userId: transaction.userID});
					var providerLink = '<a href="/profiles/' + providerDetails._id + '">' + providerDetails.firstName + ' ' + providerDetails.lastName + '</a>';
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
			title: 'Amount',
			data: function(transaction) {
				return '$' + transaction.dollarAmount;
			}
		},
		{
			title: 'Status',
			data: function(transaction) {
				return transaction.bankMessage;
			}
		},
		{
			title: 'Time'
		}
	]
}

Template.allDeposits.helpers({
	allDeposits: function() {
		return allDeposits;
	},
	adminOptionsObject: adminOptionsObject
})