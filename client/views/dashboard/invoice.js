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
	utlCommission: function(jobId) {
		var jobDetails = Jobs.findOne({_id: jobId});
		var free_nets = parseFloat(jobDetails.projectBudget);
		var buyer_nets = parseFloat(jobDetails.buyerCost);
		return +(Math.round(buyer_nets - free_nets + 'e+2') + 'e-2');
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
	},
	workedLess: function(appType, jobId) {
		var jobDetails = Jobs.findOne({_id: jobId});
		var logList = [];
	    var totalHours = 0;
	    var logs = TimeSheet.findOne({'jobID':jobId}, { sort: { 'logs.checkOut': -1 } }).logs;
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
	    var timeWorked = {
			hours: hours,
			minutes: mins
	    }
	    Session.set('workedTime', timeWorked);
		var providerWorkedMins = timeWorked.hours * 60 + timeWorked.minutes;
		if(appType == 'application') {
				if(jobDetails.ratebasis == 'Per Hour') {
				var jobEstimatedMins = jobDetails.maxhours * 60;
				if(providerWorkedMins < jobEstimatedMins)
					return true;
			} else if(jobDetails.ratebasis == 'Per Device') {
				if(jobDetails.devicescompleted < jobDetails.maxdevices)
					return tru;
			} else if(jobDetails.ratebasis == 'Blended') {
				var jobEstimatedMins = jobDetails.firsthours * 60 + jobDetails.nexthours * 60;
				if(providerWorkedMins < jobEstimatedMins)
					return true;
			}
		} else if(appType == 'counteroffer') {
		var applications = jobDetails.applications;
		var acceptedApplication;
		for(var i = 0; i < applications.length; i++) {
			if(applications[i].app_status == 'accepted') {
				acceptedApplication = applications[i];
				break;
				}
			}
			if(acceptedApplication.counterType == 'per_hour') {
				var jobEstimatedMins = acceptedApplication.max_hours * 60;
				if(providerWorkedMins < jobEstimatedMins)
				return true;
			} else if(acceptedApplication.counterType == 'per_device') {
			if(jobDetails.devicescompleted < acceptedApplication.max_devices)
			return true;
			} else if(acceptedApplication.counterType == 'blended') {
				var jobEstimatedMins = acceptedApplication.first_hours * 60 + acceptedApplication.next_hours * 60;
				if(providerWorkedMins < jobEstimatedMins)
					return true;
			}
		}
		return false;
	},
	totalHours: function() {
		return Session.get('workedTime');
	},
	hourlyApprovedCost: function(appType, hourlyRate, maxHours) {
		var invoiceDetails = Invoices.findOne({invoiceId: parseInt(Router.current().params.invoiceId)});
    var jobDetails = Jobs.findOne({_id: invoiceDetails.jobId});
    var hoursWorked = Session.get('workedTime');
    var earnings = {}
    if(appType == 'application') {
      var hourlyRate = jobDetails.hourlyrate;
      var payPerMinute = hourlyRate / 60;
      if(jobDetails.paidby == 'buyer') {
        var providerWorkedMinutes = hoursWorked.hours * 60 + hoursWorked.minutes;
        var workedEarnings = providerWorkedMinutes * payPerMinute;        
        earnings = {
          buyerCost: workedEarnings + workedEarnings * 5 / 100,
          providerEarnings: workedEarnings
        }
      } else if(jobDetails.paidby == 'provider') {
        var providerWorkedMinutes = hoursWorked.hours * 60 + hoursWorked.minutes;
        var workedEarnings = providerWorkedMinutes * payPerMinute;
        earnings = {
          buyerCost: workedEarnings,
          providerEarnings: workedEarnings - workedEarnings * 5 / 100
        }
      }
    } else if(appType == 'counteroffer') {
      var hourlyRate = hourlyRate;
      var payPerMinute = hourlyRate / 60;
      var providerWorkedMinutes = hoursWorked.hours * 60 + hoursWorked.minutes;
      var workedEarnings = providerWorkedMinutes * payPerMinute;
      earnings = {
        buyerCost: workedEarnings + workedEarnings * 5 / 100,
        providerEarnings: workedEarnings
      }
    }
    return earnings;
  },
  deviceApprovedCost: function(appType, deviceRate, maxDevices) {
  	var invoiceDetails = Invoices.findOne({invoiceId: parseInt(Router.current().params.invoiceId)});
    var jobDetails = Jobs.findOne({_id: invoiceDetails.jobId});
    var devicesCompleted = jobDetails.devicescompleted;
    var earnings = {};
    if(appType == 'application') {
      var ratePerDevice = jobDetails.rateperdevice;
      if(jobDetails.paidby == 'buyer') {
        var workedEarnings = devicesCompleted * ratePerDevice;
        earnings = {
          buyerCost: workedEarnings + workedEarnings * 5 / 100,
          providerEarnings: workedEarnings
        }
      } else if(jobDetails.paidby == 'provider') {
        var workedEarnings = devicesCompleted * ratePerDevice;
        earnings = {
          buyerCost: workedEarnings,
          providerEarnings: workedEarnings - workedEarnings * 5 / 100
        }
      }
    } else if(appType == 'counteroffer') {
      var workedEarnings = devicesCompleted * deviceRate;
      earnings = {
        buyerCost: workedEarnings + workedEarnings * 5 / 100,
        providerEarnings: workedEarnings
      }
    }
    return earnings;
  },
  blendedApprovedCost: function(appType, maxFirstHours, payFirstHours, maxNextHours, payNextHours) {
  	var invoiceDetails = Invoices.findOne({invoiceId: parseInt(Router.current().params.invoiceId)});
    var jobDetails = Jobs.findOne({_id: invoiceDetails.jobId});
    var hoursWorked = Session.get('workedTime');
    var earnings = {};
    if(appType == 'application') {
      var estimatedTimeMins = jobDetails.firsthours * 60 + jobDetails.nexthours * 60;
      var providerWorkedMinutes = hoursWorked.hours * 60 + hoursWorked.minutes;
      if(jobDetails.paidby == 'buyer') {
        if(providerWorkedMinutes < jobDetails.firsthours * 60) {
          var workedEarnings = jobDetails.payforfirsthours;
          earnings = {
            buyerCost: workedEarnings + workedEarnings * 5 / 100,
            providerEarnings: workedEarnings
          }
        } else if(providerWorkedMinutes > jobDetails.firsthours * 60 && providerWorkedMinutes < estimatedTimeMins) {
          var nextMinutesWorked = providerWorkedMinutes - jobDetails.firsthours * 60;
          var payNextHourMins = jobDetails.payfornexthours / 60;
          var workedEarnings = jobDetails.payforfirsthours + nextMinutesWorked * payNextHourMins;
          earnings = {
            buyerCost: workedEarnings + workedEarnings * 5 / 100,
            providerEarnings: workedEarnings
          }
        }
      } else if(jobDetails.paidby == 'provider') {
        if(providerWorkedMinutes < jobDetails.firsthours * 60) {
          var workedEarnings = jobDetails.payforfirsthours;
          earnings = {
            buyerCost: workedEarnings,
            providerEarnings: workedEarnings - workedEarnings * 5 / 100
          }
        } else if(providerWorkedMinutes > jobDetails.firsthours * 60 && providerWorkedMinutes < estimatedTimeMins) {
          var nextMinutesWorked = providerWorkedMinutes - jobDetails.firsthours * 60;
          var payNextHourMins = jobDetails.payfornexthours / 60;
          var workedEarnings = jobDetails.payforfirsthours + nextMinutesWorked * payNextHourMins;
          earnings = {
            buyerCost: workedEarnings,
            providerEarnings: workedEarnings - workedEarnings * 5 / 100
          }
        }
      }
    } else if(appType == 'counteroffer') {
      console.log(maxFirstHours)
      var estimatedTimeMins = maxFirstHours * 60 + maxNextHours * 60;
      var providerWorkedMinutes = hoursWorked.hours * 60 + hoursWorked.minutes;
      if(providerWorkedMinutes < maxFirstHours * 60) {
        var workedEarnings = payFirstHours;
        earnings = {
          buyerCost: workedEarnings + workedEarnings * 5 / 100,
          providerEarnings: workedEarnings
        }
      } else if(providerWorkedMinutes > maxFirstHours * 60 && providerWorkedMinutes < estimatedTimeMins) {
        var nextMinutesWorked = providerWorkedMinutes - maxFirstHours * 60;
        var payNextHourMins = payNextHours / 60;
        var workedEarnings = payFirstHours + nextMinutesWorked * payNextHourMins;
        earnings = {
          buyerCost: workedEarnings + workedEarnings * 5 / 100,
          providerEarnings: workedEarnings
        }
      }
    }
    return earnings;
  }
});