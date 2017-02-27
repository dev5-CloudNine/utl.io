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
				var jobDetails = Jobs.findOne({_id: invoice.jobId});
				var jobLink;
				if(jobDetails.status == 'deactivated')
					jobLink = '<a href="/jobs/' + invoice.jobId + '">' + jobDetails.title + '</a> <small>(Deactivated)</small><br><small><i>' + moment(invoice.date).format('dddd, MMMM Do YYYY, h:mm:ss a') + '</i><small>';
				else
					jobLink = '<a href="/jobs/' + invoice.jobId + '">' + jobDetails.title + '</a><br><small><i>' + moment(invoice.date).format('dddd, MMMM Do YYYY, h:mm:ss a') + '</i><small>';
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
					if(jobDetails.status == 'deactivated')
						buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a><br><small><i>Cost: 31.5 USD';
					else
						buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a><br><small><i>Cost: ' + (+(Math.round((jobDetails.buyerCost) + 'e+2') + 'e-2')) + ' USD';
				}
				else if(Roles.userIsInRole(invoice.buyerId, ['dispatcher'])) {
					buyerDetails = Dispatchers.findOne({userId: invoice.buyerId});
					if(jobDetails.status == 'deactivated')
						buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a><br><small><i>Cost: 31.5 USD';
					else
						buyerLink = '<a href="/dispatchers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a><br><small><i>Cost: ' + (+(Math.round((jobDetails.buyerCost) + 'e+2') + 'e-2')) + ' USD';
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
				var providerLink;
				if(jobDetails.status == 'deactivated')
					providerLink = '<a href="/profiles/' + providerDetails._id + '">' + providerDetails.firstName + ' ' + providerDetails.lastName + '</a><br><small><i>Earned: 30 USD';
				else
					providerLink = '<a href="/profiles/' + providerDetails._id + '">' + providerDetails.firstName + ' ' + providerDetails.lastName + '</a><br><small><i>Earned: ' + (+(Math.round((jobDetails.projectBudget) + 'e+2') + 'e-2')) + ' USD';
				return providerLink;
			},
			width: '20%'
		},
		{
			'title': 'Administrator',
			data: function(invoice) {
				var jobDetails = Jobs.findOne({_id: invoice.jobId});
				if(jobDetails.status == 'deactivated')
					return '<a>Earnings</a><br><small><i>1.5 USD</i></small>';
				else
					return '<a>Earnings</a><br><small><i>' + (+(Math.round((jobDetails.buyerCost - jobDetails.projectBudget) + 'e+2') + 'e-2')) + ' USD</i></small>';
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
	buyerOptionsObject: adminOptionsObject,
	providerOptionsObject: adminOptionsObject,
	adminOptionsObject: adminOptionsObject
})