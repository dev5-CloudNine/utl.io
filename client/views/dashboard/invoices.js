buyerInvoices = function() {
	return Invoices.find({buyerId: Meteor.userId()}).fetch();
}
providerInvoices = function() {
	return Invoices.find({providerId: Meteor.userId()}).fetch();
}
var buyerOptionsObject = {
	lengthMenu: [40, 80, 160, 320],
    pageLength: 40,
    order: [[0, 'desc']],
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
				var providerLink = '<a href="/profiles/' + providerDetails._id + '">' + providerDetails.firstName + ' ' + providerDetails.lastName + '</a>';
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
				var buyerDetails;
				if(Roles.userIsInRole(invoice.buyerId, ['buyer'])) {
					buyerDetails = Buyers.findOne({userId: invoice.buyerId});
					buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a>';
				}
				if(Roles.userIsInRole(invoice.buyerId, ['dispatcher'])) {
					buyerDetails = Dispatchers.findOne({userId: invoice.buyerId});
					buyerLink = '<a href="/dispatchers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a>';
				}
				return buyerLink;
			}
		},
		{title: 'Amount (USD)', data: function(invoice) {return invoice.budget}},
		{title: 'Date', data: function(invoice) {return moment(invoice.date).fromNow()}},
		{title: 'Status', data: function(invoice) {return invoice.invoiceStatus}}
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