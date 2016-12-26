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
		var invoiceDetails = Invoices.findOne({invoiceId: parseInt(Router.current().params.invoiceId)});
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
		var invoiceDetails = Invoices.findOne({invoiceId: parseInt(Router.current().params.invoiceId)});
		return Jobs.findOne({_id: invoiceDetails.jobId}).projectBudget;
	},
	providerDetails: function() {
		var invoiceDetails = Invoices.findOne({invoiceId: parseInt(Router.current().params.invoiceId)});
		return Profiles.findOne({userId: invoiceDetails.providerId});
	},
	buyerDetails: function() {
		var invoiceDetails = Invoices.findOne({invoiceId: parseInt(Router.current().params.invoiceId)});
		return Buyers.findOne({userId: invoiceDetails.buyerId});
	},
	invoiceDetails: function() {
		return Invoices.findOne({invoiceId: parseInt(Router.current().params.invoiceId)});
	},
	timeLogs:function(id){
		var logList = [];
		var totalHours = 0;
		var logs = TimeSheet.findOne({'jobID':id}, { sort: { 'logs.checkOut': -1 } }).logs;
		if(!logs) return;
		logs.map(function(log){
			var obj = {};
			obj.id = log.id;
			obj.in = moment(log.checkIn).format('llll');
			obj.out = moment(log.checkOut).format('llll');
			var inT = moment(new Date(obj.in));
			var ouT = moment(new Date(obj.out));
			var diff = ouT.diff(inT);
			var duration = moment.duration(diff,'milliseconds');
			var days = Math.floor(duration.asDays());
			var hours = Math.floor(duration.asHours());
			var mins = Math.floor(duration.asMinutes()) - hours * 60;
			var total = "Hours : "+hours+", Mins : "+mins;
			obj.total = total;
			totalHours+=diff;
			logList.push(obj);
    	});
    	var duration = moment.duration(totalHours,'milliseconds');
		var days = Math.floor(duration.asDays());
		var hours = Math.floor(duration.asHours());
		var hrs = days*24+hours;
		var mins = Math.floor(duration.asMinutes()) - hours * 60;
		var total = "Hours : "+hours+", Mins : "+mins;
		if(duration==0) {
			Session.set('totalHours','No activities are done so far');
		} else {
			Session.set('totalHours',total);
		}
		return logList;
    },
	totalHours : function(){
		return Session.get('totalHours');
	}
});