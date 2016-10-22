Template.invoice.events({
	'click .printInvoice': function(event, template){
		window.print();
	}
});

Template.invoice.helpers({
	invoiceId: function () {
		return Router.current().params.invoiceId;
	},
	jobDetails: function() {
		var invoiceDetails = Invoices.findOne({invoiceId: Router.current().params.invoiceId});
		return Jobs.findOne({_id: invoiceDetails.jobId});
	},
	budgetDetails: function(jobId) {
		var applicationObj;
		var jobDetails = Jobs.findOne({_id: jobId});
		if(jobDetails.applications) {
			for(var i = 0; i < jobDetails.applications.length; i++) {
				if(jobDetails.applications[i].app_status == 'accepted') {
					applicationObj = jobDetails.applications[i];
					break;
				}
			}
		}
		return applicationObj;
	},
	utlComission: function(buyerCost) {
		return buyerCost * 5/100;
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
		return Invoices.findOne({invoiceId: Router.current().params.invoiceId});
	}
});