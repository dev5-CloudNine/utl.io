Template.invoiceDetails.events({
	'click .printInvoice': function(event, template){
		window.print();
	}
});

Template.invoiceDetails.helpers({
	invoiceId: function () {
		return Router.current().params.invoiceId;
	},
	jobName: function() {
		var invoiceDetails = Invoices.findOne({invoiceId: Router.current().params.invoiceId});
		return Jobs.findOne({_id: invoiceDetails.jobId}).title;
	},
	projectBudget: function() {
		var invoiceDetails = Invoices.findOne({invoiceId: Router.current().params.invoiceId});
		return Jobs.findOne({_id: invoiceDetails.jobId}).projectBudget;
	},
	providerDetails: function() {
		var invoiceDetails = Invoices.findOne({invoiceId: Router.current().params.invoiceId});
		return Profiles.findOne({userId: invoiceDetails.providerId});
	},
	buyerDetails: function() {
		var invoiceDetails = Invoices.findOne({invoiceId: Router.current().params.invoiceId});
		return Buyers.findOne({userId: invoiceDetails.buyerId});
	},
	invoiceDetails: function() {
		console.log(Invoices.findOne({invoiceId: Router.current().params.invoiceId}));
		return Invoices.findOne({invoiceId: Router.current().params.invoiceId});
	}
});