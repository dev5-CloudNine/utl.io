var invoices = function() {
	return Invoices.find().fetch();
}

var allInvoicesObject = {
	lengthMenu: [10, 25, 50, 100],
	pageLength: 10,
	order: [[0, 'desc']],
	columns: [
		{
			'title': 'Invoice ID',
			data: function(invoice) {
				var invoiceLink = '<a href="/allInvoices/' + invoice.invoiceId + '">' + invoice.invoiceId + '</a>';
				return invoiceLink;
			},
			width: '10%'
		},
		{
			'title': 'Job Name',
			data: function(invoice) {
				var jobName = Jobs.findOne({_id: invoice.jobId}).title
				var jobLink = '<a href="/jobs/' + invoice.jobId + '">' + jobName + '</a>';
				return jobLink;
			}
		},
		{
			'title': 'From',
			data: function(invoice) {
				var providerDetails = Profiles.findOne({userId: invoice.providerId});
				var providerLink = '<a href="/profiles/' + providerDetails._id + '">' + providerDetails.firstName + ' ' + providerDetails.lastName + '</a>';
				return providerLink;
			}
		},
		{
			'title': 'To',
			data: function(invoice) {
				var buyerDetails;
				var buyerLink;
				if(Roles.userIsInRole(invoice.buyerId, ['buyer'])) {
					buyerDetails = Buyers.findOne({userId: invoice.buyerId});
					buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a>';
				}
				else if(Roles.userIsInRole(invoice.buyerId, ['dispatcher'])) {
					buyerDetails = Dispatchers.findOne({userId: invoice.buyerId});
					buyerLink = '<a href="/dispatchers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a>';
				}
				return buyerLink;
			}
		},
		{
			'title': 'Date',
			data: function(invoice) {
				return moment(invoice.date).format("dddd, MMMM Do YYYY, h:mm:ss a")
			}
		}
	]
}

Template.allInvoices.helpers({
	allInvoices: function() {
		return invoices;
	},
	adminOptionsObject: allInvoicesObject
})