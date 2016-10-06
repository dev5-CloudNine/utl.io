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
				if(Roles.userIsInRole(debitedUserId, ['admin'])) {
					return 'Admin'
				} else {
					var buyerDetails = Buyers.findOne({userId: transaction.buyerId});
					var buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a>'
					return buyerLink;
				}
			}
		},
		{
			title: 'Credited to',
			data: function(transaction) {
				var creditedUserId = transaction.providerId || transaction.adminId
				if(Roles.userIsInRole(creditedUserId, ['admin'])) {
					return 'Admin'
				} else {
					var providerDetails = Profiles.findOne({userId: creditedUserId});
					var providerLink = '<a href="/buyers/' + creditedUserId + '">' + providerDetails.firstName + ' ' + providerDetails.lastName + '</a>'
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