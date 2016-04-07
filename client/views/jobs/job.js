Template.job.events({
  'click #job-deactivate': function(event, template) {
    event.preventDefault();
    Modal.show('jobDeactivate',template.data);
  },
  'click .applyJob': function(event, template) {
  	var jobId = this._id;
  	Meteor.call('applyForThisJob', jobId, function(error) {
  		if(error) {
  			toastr.error(error.message, 'Error');
  		}
  		else {
  			toastr.success("You've successfully applied for this job!");
  		}
  	})
  },
  'change #counter_type': function(event, template) {
    var counterType = $('#counter_type').val();
    if(counterType == 'fixed_pay') {
      $('#fixed-pay-counter').show();
    }
    else {
      $('#fixed-pay-counter').hide();
    }
    if(counterType == 'per_hour') {
      $('#hourly-counter').show();
    }
    else {
      $('#hourly-counter').hide();
    }
    if(counterType == 'per_device') {
      $('#per-device-counter').show();
    }
    else {
      $('#per-device-counter').hide();
    }
    if(counterType == 'blended') {
      $('#blended-counter').show();
    }
    else {
      $('#blended-counter').hide();
    }
  },
  'change #fixed_amount, keyup #fixed_amount': function(event, template) {
    var fixedamount = $('#fixed_amount').val();
    $('#total_amount').val(fixedamount);
    $('#buyer_cost').val(fixedamount);
    var freenet = fixedamount - (fixedamount * 5/100);
    $('#freelancer_nets').val(freenet);
  },
  'change #hourly_rate, keyup #hourly_rate, change #max_hours, keyup #max_hours': function(event, template) {
    var hourlyrate = $('#hourly_rate').val();
    var maxhours = $('#max_hours').val();
    var totalamount = hourlyrate * maxhours;
    $('#total_amount').val(totalamount);
    $('#buyer_cost').val(totalamount)
    var freenet = totalamount - (totalamount * 5/100);
    $('#freelancer_nets').val(freenet);
  },
  'change #device_rate, keyup #device_rate, change max_devices, keyup max_devices': function(event, template) {
    var devicerate = $('#device_rate').val();
    var maxdevices = $('#max_devices').val();
    var totalamount = devicerate * maxdevices;
    $('#total_amount').val(totalamount);
    $('#buyer_cost').val(totalamount)
    var freenet = totalamount - (totalamount * 5/100);
    $('#freelancer_nets').val(freenet);
  },
  'change #first_hours, keyup #first_hours, change #first_max_hours, keyup #first_max_hours, change #next_hours, keyup #next_hours, change #next_max_hours, keyup #next_max_hours': function(event, template) {
    var payforfirsthours = $('#first_hours').val();
    var firsthours = $('#first_max_hours').val();
    var payfornexthours = $('#next_hours').val();
    var nexthours = $('#next_max_hours').val();
    var totalforfirsthours = payforfirsthours * firsthours;
    var totalfornexthours = payfornexthours * nexthours;
    var totalamount = totalforfirsthours + totalfornexthours;
    $('#total_amount').val(totalamount);
    $('#buyer_cost').val(totalamount)
    var freenet = totalamount - (totalamount * 5/100);
    $('#freelancer_nets').val(freenet);
  },
  'change input[value="provider"]': function(event, template) {
    var totalamount = parseFloat($('#total_amount').val());
    $('#buyer_cost').val(totalamount);
    var freenet = totalamount - totalamount * 5/100;
    $('#freelancer_nets').val(freenet);
  },
  'change input[value="buyer"]': function(event, template) {
    var totalamount = parseFloat($('#total_amount').val());
    var clientCost = totalamount + totalamount * 5/100;
    $('#buyer_cost').val(clientCost);
    $('#freelancer_nets').val(totalamount);
  },
  'click .counterOffer': function(event, template) {
    var counterType = $('#counter_type').val();
    console.log(counterType);
  }
});

Template.job.helpers({
  'hasLabel': function() {
    return this.jobType || this.featured;
  },
  'appliedByCount': function() {
  	var count = 0;
  	Jobs.findOne(this._id).appliedBy.forEach(function(uId) {
  		count++;
  	});
  	return count;
  },
  'counterOfferCount': function() {
    var count = 0;
    Jobs.findOne(this._id).counterOffers.forEach(function(uId) {
      count++;
    });
    return count;
  },
  'appliedProviders': function() {
    var providersApplied = [];
    var providerIds = [];
    Jobs.findOne(this._id).appliedBy.forEach(function(providerId) {
      providerIds.push(providerId);
    });
    providerIds.forEach(function(pId) {
      providersApplied.push(Profiles.findOne({userId: pId}));
    });
    return providersApplied;
  },
  'counterOfferedProviders': function() {

  },
  'jobPostedBuyer': function() {
    var jobDetails = Jobs.findOne(this._id);
    if(jobDetails.userId == Meteor.userId())
      return true;
    else
      return false;
  }
});
