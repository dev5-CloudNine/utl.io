var buyerInvoices = function() {
	if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'accountant'])) {
		var dispatcherIds = [];
		var dispatchers;
		if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
			dispatchers = Dispatchers.find({invitedBy: Meteor.userId()}).fetch();
		else if(Roles.userIsInRole(Meteor.userId(), ['accountant']))
			dispatchers = Dispatchers.find({invitedBy: Meteor.user().invitedBy}).fetch();
		for(var i = 0; i < dispatchers.length; i++) {
			dispatcherIds.push(dispatchers[i].userId);
		}
		if(Roles.userIsInRole(Meteor.userId(), ['accountant']))
			return Invoices.find({$or: [{buyerId: Meteor.user().invitedBy}, {buyerId: {$in: dispatcherIds}}]}).fetch()
		return Invoices.find({$or: [{buyerId: Meteor.userId()}, {buyerId: {$in: dispatcherIds}}]}).fetch()
	}
	else if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
		return Invoices.find({buyerId: Meteor.userId()}).fetch();
}
var providerInvoices = function() {
	return Invoices.find({providerId: Meteor.userId()}).fetch();
}

var adminInvoices = function() {
	return Invoices.find().fetch();
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
var adminOptionsObject = {
	lengthMenu: [40, 80, 160, 320],
	pageLength: 40,
	order: [[0, 'desc']],
	columns: [
		{
			'title': 'ID',
			data: function(invoice) {
				var invoiceLink = '<a href="/wallet/invoices/' + invoice.invoiceId + '">' + invoice.invoiceId + '</a>';
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
			'title': 'Administrator',
			data: function(invoice) {
				var jobDetails = Jobs.findOne({_id: invoice.jobId});
				return '<a>Earnings</a><br><small><i>' + (jobDetails.buyerCost - jobDetails.projectBudget) + ' USD</i></small>';
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
	adminInvoices: function() {
		return adminInvoices;
	},
	buyerOptionsObject: buyerOptionsObject,
	providerOptionsObject: providerOptionsObject,
	adminOptionsObject: adminOptionsObject
})