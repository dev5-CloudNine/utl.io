var allJobTransactions = function() {
	return JobTransactions.find().fetch();
}

var adminOptionsObject = {
	columns: [
		{
			title: 'Job Name',
			data: function(transaction) {
				var jobName = Jobs.findOne({_id: transaction.jobId}).title;
				var jobLink = '<a href="/jobs/' + transaction.jobId + '">' + jobName + '</a>';
				return jobLink;
			}
		},
		{
			title: 'Amount (USD)',
			data: function(transaction) {
				return Jobs.findOne({_id: transaction.jobId}).your_cost;
			}
		},
		{
			title: 'Debited from',
			data: function(transaction) {
				var debitedUserId = transaction.debitedAccount;
				if(Roles.userIsInRole(debitedUserId, ['admin'])) {
					return 'Admin'
				} else {
					var buyerName = Buyers.findOne({userId: debitedUserId}).name;
					var buyerLink = '<a href="/buyers/' + debitedUserId + '">' + buyerName + '</a>'
					return buyerLink;
				}
			}
		},
		{
			title: 'Credited to',
			data: function(transaction) {
				var creditedUserId = transaction.creditedAccount;
				if(Roles.userIsInRole(creditedUserId, ['admin'])) {
					return 'Admin'
				} else {
					var creditedUserId = transaction.creditedAccount;
					var providerName = Profiles.findOne({userId: creditedUserId}).name;
					var providerLink = '<a href="/buyers/' + creditedUserId + '">' + providerName + '</a>'
					return providerLink;
				}
			}
		},
		{
			title: 'Date and Time',
			data: function(transaction) {
				return transaction.dateAndTime;
			}
		}
	]
}

Template.AllJobTransactions.helpers({
	allJobTransactions: function() {
		return allJobTransactions;
	},
	adminOptionsObject: adminOptionsObject
})