var invoices = function() {
	return Invoices.find().fetch();
}

var allInvoicesObject = {
	lengthMenu: [40, 80, 160, 320],
	pageLength: 40,
	order: [[0, 'desc']],
	columns: [
		{
			'title': 'ID',
			data: function(invoice) {
				var invoiceLink = '<a href="/allInvoices/' + invoice.invoiceId + '">' + invoice.invoiceId + '</a>';
				return invoiceLink;
			}
		},
		{
			'title': 'Job Name',
			data: function(invoice) {
				var jobName = Jobs.findOne({_id: invoice.jobId}).title
				var jobLink = '<a href="/jobs/' + invoice.jobId + '">' + jobName + '</a><br><small><i>' + moment(invoice.date).format('dddd, MMMM Do YYYY, h:mm:ss a') + '</i><small>';
				return jobLink;
			},
			width: '40%'
		},
		{
			'title': 'Provider',
			data: function(invoice) {
				var providerDetails = Profiles.findOne({userId: invoice.providerId});
				var jobDetails = Jobs.findOne({_id: invoice.jobId});
				var providerLink = '<a href="/profiles/' + providerDetails._id + '">' + providerDetails.firstName + ' ' + providerDetails.lastName + '</a><br><small><i>Earned: ' + jobDetails.projectBudget + ' USD';
				return providerLink;
			},
			width: '20%'
		},
		{
			'title': 'Buyer',
			data: function(invoice) {
				var buyerDetails;
				var buyerLink;
				var jobDetails = Jobs.findOne({_id: invoice.jobId});
				if(Roles.userIsInRole(invoice.buyerId, ['buyer'])) {
					buyerDetails = Buyers.findOne({userId: invoice.buyerId});
					buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a><br><small><i>Cost: ' + jobDetails.buyerCost + ' USD';
				}
				else if(Roles.userIsInRole(invoice.buyerId, ['dispatcher'])) {
					buyerDetails = Dispatchers.findOne({userId: invoice.buyerId});
					buyerLink = '<a href="/dispatchers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a><br><small><i>Cost: ' + jobDetails.buyerCost + ' USD';
				}
				return buyerLink;
			},
			width: '20%'
		},
		{
			'title': 'Earnings',
			data: function(invoice) {
				var jobDetails = Jobs.findOne({_id: invoice.jobId});
				return '<a>Administrator</a><br><small><i>' + (jobDetails.buyerCost - jobDetails.projectBudget) + ' USD</i></small>';
			},
			width: '20%'
		}
	]
}

Template.allInvoices.helpers({
	allInvoices: function() {
		return invoices;
	},
	adminOptionsObject: allInvoicesObject
})