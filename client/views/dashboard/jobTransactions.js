var jobTransactions = function() {
	return JobTransactions.find({$or: [{debitedAccount: Meteor.userId()}, {creditedAccount: Meteor.userId()}]}).fetch()
}

var optionsObject = {
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
				} else if(Roles.userIsInRole(debitedUserId, ['buyer', 'corporate-manager'])) {
					var buyerName = Buyers.findOne({userId: debitedUserId}).name;
					var buyerLink = '<a href="/buyers/' + debitedUserId + '">' + buyerName + '</a>'
					return buyerLink;
				} else if(Roles.userIsInRole(debitedUserId, ['provider', 'corporate-provider'])) {
					var providerName = Profiles.findOne({userId: debitedUserId}).name;
					var providerLink = '<a href="/profiles/' + debitedUserId + '">' + providerName + '</a>';
					return providerLink;
				}
			}
		},
		{
			title: 'Credited to',
			data: function(transaction) {
				var creditedUserId = transaction.creditedAccount;
				if(Roles.userIsInRole(creditedUserId, ['admin'])) {
					return 'Admin'
				} else if(Roles.userIsInRole(creditedUserId, ['buyer', 'corporate-manager'])) {
					var buyerName = Buyers.findOne({userId: creditedUserId}).name;
					var buyerLink = '<a href="/buyers/' + creditedUserId + '">' + buyerName + '</a>'
					return buyerLink;
				} else if(Roles.userIsInRole(creditedUserId, ['provider', 'corporate-provider'])) {
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

Template.JobTransactions.helpers({
	jobTransactions: function() {
		return jobTransactions;
	},
	optionsObject: optionsObject
})