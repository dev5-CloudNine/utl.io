buyerInvoices = function() {
	return Invoices.find({buyerId: Meteor.userId()}).fetch();
}
providerInvoices = function() {
	return Invoices.find({providerId: Meteor.userId()}).fetch();
}
var buyerOptionsObject = {
	columns: [
		{
			title: 'Invoice ID',
			data: function(invoice) {
				var invoiceLink = '<a href="/invoices/' + invoice.invoiceId + '">' + invoice.invoiceId + '</a>';
				return invoiceLink;
			}
		},
		{
			title: 'Job Name',
			data: function(invoice) {
				var jobName = Jobs.findOne({_id: invoice.jobId}).title
				var jobLink = '<a href="/jobs/' + invoice.jobId + '">' + jobName + '</a>';
				return jobLink;
			}
		},
		{
			title: 'Provider Name',
			data: function(invoice) {
				var providerDetails = Profiles.findOne({userId: invoice.providerId});
				var providerLink = '<a href="/profiles/' + providerDetails._id + '">' + providerDetails.name + '</a>';
				return providerLink;
			}
		},
		{title: 'Amount (USD)', data: 'budget'},
		{title: 'Date', data: function(invoice) {return moment(invoice.date).fromNow()}},
		{title: 'Status', data: 'invoiceStatus'}
	]
};
var providerOptionsObject = {
	columns: [
		{
			title: 'Invoice ID',
			data: function(invoice) {
				var invoiceLink = '<a href="/invoices/' + invoice.invoiceId + '">' + invoice.invoiceId + '</a>';
				return invoiceLink;
			}
		},
		{
			title: 'Job Name',
			data: function(invoice) {
				var jobName = Jobs.findOne({_id: invoice.jobId}).title
				var jobLink = '<a href="/jobs/' + invoice.jobId + '">' + jobName + '</a>';
				return jobLink;
			}
		},
		{
			title: 'Buyer Name',
			data: function(invoice) {
				var buyerDetails = Buyers.findOne({userId: invoice.buyerId});
				var buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.name + '</a>';
				return buyerLink;
			}
		},
		{title: 'Amount', data: 'budget'},
		{title: 'Date', data: function(invoice) {return moment(invoice.date).fromNow()}},
		{title: 'Status', data: 'invoiceStatus'}
	]
}
Template.invoices.helpers({
	buyerInvoices: function() {
		return buyerInvoices;
	},
	providerInvoices: function() {
		return providerInvoices;
	},
	buyerOptionsObject: buyerOptionsObject,
	providerOptionsObject: providerOptionsObject
})