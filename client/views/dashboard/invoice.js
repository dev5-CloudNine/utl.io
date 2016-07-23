Template.invoice.events({
	'click .printInvoice': function(event, template){
		window.print();
	}
});

Template.invoice.helpers({
	invoiceId: function () {
		return Router.current().params.invoiceId;
	},
	jobName: function() {
		var invoices = Wallet.findOne({userId: Meteor.userId()}).invoices;
		for(var i = 0; i < invoices.length; i++) {
			if(invoices[i].invoiceId == Router.current().params.invoiceId) {
				return(Jobs.findOne({_id: invoices[i].jobId}).title);
			}
		}
	},
	providerDetails: function() {
		var invoices = Wallet.findOne({userId: Meteor.userId()}).invoices;
		if(invoices) {
			for(var i = 0; i < invoices.length; i++) {
				if(invoices[i].invoiceId == Router.current().params.invoiceId) {
					return(Profiles.findOne({userId: invoices[i].providerId}));
				}
			}
		}
	},
	buyerDetails: function() {
		var invoices = Wallet.findOne({userId: Meteor.userId()}).invoices;
		if(invoices) {
			for(var i = 0; i < invoices.length; i++) {
				if(invoices[i].invoiceId == Router.current().params.invoiceId) {
					return(Buyers.findOne({userId: invoices[i].buyerId}));
				}
			}
		}
	},
	buyerAtProvider: function() {
		return Buyers.findOne({userId: Meteor.userId()});
	},
	providerAtBuyer: function() {
		return Profiles.findOne({userId: Meteor.userId()});
	},
	invoiceDetails: function() {
		var invoices = Wallet.findOne({userId: Meteor.userId()}).invoices;
		if(invoices) {
			for(var i = 0; i < invoices.length; i++) {
				if(invoices[i].invoiceId == Router.current().params.invoiceId) {
					var jobDetails = Jobs.findOne({_id: invoices[i].jobId});
					var iDetails = {
						date: invoices[i].date,
						inoviceStatus: invoices[i].invoiceStatus,
						jobName: jobDetails.title,
						projectBudget: invoices[i].budget
					}
					return iDetails;
				}
			}
		}
	}
});