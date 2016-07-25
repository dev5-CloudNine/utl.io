var invoices = function() {
	return Invoices.find().fetch();
}

var adminOptionsObject = {
	columns: [
		{
			'title': 'Invoice ID',
			data: function(invoice) {
				var invoiceLink = '<a href="/allInvoices/' + invoice.invoiceId + '">' + invoice.invoiceId + '</a>';
				return invoiceLink;
			}
		},
		{
			'title': 'Job Name',
			data: function(invoice) {
				var jobName = Jobs.findOne({_id: invoice.jobId}).title
				var jobLink = '<a href="/jobs/' + invoice.jobId + '">' + jobName + '</a>';
				return jobLink;
			}
		}
	]
}

Template.allInvoices.helpers({
	allInvoices: function() {
		return invoices;
	},
	adminOptionsObject: adminOptionsObject
})