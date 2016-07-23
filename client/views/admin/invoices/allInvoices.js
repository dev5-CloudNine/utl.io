var invoices = function() {
	var allInvoices = [];
	var wallets = Wallet.find().fetch();
	for(var i = 0; i < wallets.length; i++) {
		if(wallets[i].invoices) {
			for(var j = 0; j < wallets[i].invoices.length; j++) {
				allInvoices.push(wallets[i].invoices[j]);
			}
		}
	}
	return allInvoices;
}

var adminOptionsObject = {
	columns: [
		{
			'title': 'Invoice ID',
			data: function(invoice) {
				var invoiceLink = '<a href="/invoices/' + invoice.invoiceId + '">' + invoice.invoiceId + '</a>';
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