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
		var applicationDetails = {};
		var jobDetails = Jobs.findOne({_id: jobId})
		for(var i = 0; i < jobDetails.applications.length; i++) {
			if(jobDetails.applications[i].userId == jobDetails.assignedProvider && jobDetails.applications[i].app_status == 'accepted') {
				if(jobDetails.applications[i].app_type == 'application') {
					applicationDetails = {
						appType: jobDetails.applications[i].app_type,
						appliedAt: jobDetails.applications[i].applied_at
					}
				}
				if(jobDetails.applications[i].app_type == 'counteroffer') {
					applicationDetails = {
						appType: jobDetails.applications[i].app_type,
						appliedAt: jobDetails.applications[i].applied_at,
						counter_type: jobDetails.applications[i].counterType,
						fixed_amount:jobDetails.applications[i].fixed_amount,
						hourly_rate: jobDetails.applications[i].hourly_rate,
						max_hours: jobDetails.applications[i].max_hours,
						device_rate: jobDetails.applications[i].device_rate,
						max_devices: jobDetails.applications[i].max_devices,
						first_hours: jobDetails.applications[i].first_hours,
						first_max_hours: jobDetails.applications[i].first_max_hours,
						next_hours: jobDetails.applications[i].next_hours,
						next_max_hours: jobDetails.applications[i].next_max_hours,
						buyer_cost: jobDetails.applications[i].buyer_cost,
						freelancer_nets: jobDetails.applications[i].freelancer_nets,
					}
				}
			}
		}
		var provider = Profiles.findOne({userId: jobDetails.assignedProvider});
		var providerImg = Users.findOne({_id: jobDetails.assignedProvider}).imgURL;
		var imgURL;
		if(providerImg) {
			imgURL = providerImg
		} else {
			imgURL = '/images/avatar.png'
		}
		if(applicationDetails.appType == 'application') {
			var providerDetails = {
				name: provider.firstName + ' ' + provider.lastName,
				title: provider.title,
				status: provider.status,
				imgUrl: imgURL,
				id: provider._id,
				readableID: Meteor.users.findOne({_id: provider.userId}).readableID,
				appType: applicationDetails.appType,
				appliedAt: applicationDetails.appliedAt,
				paymentType: jobDetails.ratebasis,
				gross: jobDetails.your_cost,
				freelancer_nets: jobDetails.freelancer_nets
			}
		}
		if(applicationDetails.appType == 'counteroffer') {
			var providerDetails = {
				name: provider.firstName + ' ' + provider.lastName,
				title: provider.title,
				status: provider.status,
				imgUrl: imgURL,
				id: provider._id,
				readableID: Meteor.users.findOne({_id: provider.userId}).readableID,
				appType: applicationDetails.appType,
				appliedAt: applicationDetails.appliedAt,
				paymentType: jobDetails.ratebasis,
				counter_type: applicationDetails.counter_type,
				fixed_amount:applicationDetails.fixed_amount,
				hourly_rate: applicationDetails.hourly_rate,
				max_hours: applicationDetails.max_hours,
				device_rate: applicationDetails.device_rate,
				max_devices: applicationDetails.max_devices,
				first_hours: applicationDetails.first_hours,
				first_max_hours: applicationDetails.first_max_hours,
				next_hours: applicationDetails.next_hours,
				next_max_hours: applicationDetails.next_max_hours,
				buyer_cost: applicationDetails.buyer_cost,
				freelancer_nets: applicationDetails.freelancer_nets
			}
		}
		console.log(providerDetails);
		return providerDetails;
	},
	expensesRequested: function(jobId) {
		var jobDetails = Jobs.findOne({_id: jobId});
		if(jobDetails.expenses && jobDetails.expenses.length > 0)
			return true;
		return false;
	},
	bonusRequested: function(jobId) {
		var bonusDetails = Jobs.findOne({_id: jobId}).budgetIncreases;
		if(bonusDetails && bonusDetails.length > 0)
			return true;
		return false;
	},
	bonusReqDetails: function(jobId) {
		var bonusDetails = BonusRequests.findOne({jobId: jobId});
		if(bonusDetails) {
			return bonusDetails;
		}
		return;
	},
	projectBudget: function() {
		var invoiceDetails = Invoices.findOne({invoiceId: parseInt(Router.current().params.invoiceId)});
		return Jobs.findOne({_id: invoiceDetails.jobId}).projectBudget;
	},
	buyerFinalCost: function(jobId) {
		var jobDetails = Jobs.findOne({_id: jobId});
		var free_nets = jobDetails.projectBudget;
		var buyer_nets = free_nets + (free_nets * 5/100);
		return buyer_nets;
	},
	utlCommission: function(jobId) {
		var jobDetails = Jobs.findOne({_id: jobId});
		var free_nets = jobDetails.projectBudget;
		var buyer_nets = free_nets + (free_nets * 5/100);
		return +(Math.round((buyer_nets - free_nets) + 'e+2') + 'e-2')
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