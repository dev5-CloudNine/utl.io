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
			title: 'ID',
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
				return jobName;
			},
			width: '50%'
		},
		{
			title: 'Provider Name',
			data: function(invoice) {
				var providerDetails = Profiles.findOne({userId: invoice.providerId});
				var providerLink = '<a href="/profiles/' + providerDetails._id + '">' + providerDetails.firstName + ' ' + providerDetails.lastName + '</a>';
				return providerDetails.firstName + ' ' + providerDetails.lastName;
			},
			width: '15%'
		},
		{
			title: 'Amount (USD)',
			data: 'budget',
			width: '15%'
		},
		{
			title: 'Status',
			data: function(invoice) {
				return invoice.invoiceStatus + ' ' + moment(invoice.date).fromNow()
			},
			width: '20%'
		}
		// {
		// 	title: 'Status',
		// 	data: 'invoiceStatus'
		// }
	]
};
var providerOptionsObject = {
	lengthMenu: [40, 80, 160, 320],
    pageLength: 40,
    order: [[0, 'desc']],
	columns: [
		{
			title: 'ID',
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
				return jobName;
			},
			width: '50%'
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
				return buyerDetails.firstName + ' ' + buyerDetails.lastName;
			},
			width: '15%'
		},
		{
			title: 'Amount (USD)',
			data: function(invoice) {
				return invoice.budget
			},
			width: '15%'
		},
		{
			title: 'Status',
			data: function(invoice) {
				return invoice.invoiceStatus + ' ' + moment(invoice.date).fromNow();
			},
			width: '20%'
		}
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