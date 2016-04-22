Template.job.events({
  'click #job-deactivate': function(event, template) {
    event.preventDefault();
    Modal.show('jobDeactivate',template.data);
  },
  'click .applyJob': function(event, template) {
    event.preventDefault();
  	var jobId = this._id;
    var applicationDetails = {
      "userId": Meteor.userId(),
      "applied_at": new Date()
    }
  	Meteor.call('applyForThisJob', jobId, applicationDetails, function(error) {
  		if(error) {
  			toastr.error(error.message, 'Error');
  		}
  		else {
  			toastr.success("You've successfully applied for this job!");
  		}
  	})
  },
  'change #counter_type': function(event, template) {
    event.preventDefault();
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
  //fixed rate 
  'change #fixed_amount, keyup #fixed_amount': function(event, template) {
    event.preventDefault();
    var fixedamount = $('#fixed_amount').val();
    $('input[name="total_amount"]').val(fixedamount);
    $('input[name="buyer_cost"]').val(fixedamount);
    var freenet = fixedamount - (fixedamount * 5/100);
    $('input[name="freelancer_nets"]').val(freenet);
  },
  //hourly rate
  'change #hourly_rate, keyup #hourly_rate, change #max_hours, keyup #max_hours': function(event, template) {
    event.preventDefault();
    var hourlyrate = $('#hourly_rate').val();
    var maxhours = $('#max_hours').val();
    var totalamount = hourlyrate * maxhours;
    $('input[name="total_amount"]').val(totalamount);
    $('input[name="buyer_cost"]').val(totalamount)
    var freenet = totalamount - (totalamount * 5/100);
    $('input[name="freelancer_nets"]').val(freenet);
  },
  //device rate
  'change #device_rate, keyup #device_rate, change #max_devices, keyup #max_devices': function(event, template) {
    event.preventDefault();
    var devicerate = $('#device_rate').val();
    var maxdevices = $('#max_devices').val();
    var totalamount = devicerate * maxdevices;
    $('input[name="total_amount"]').val(totalamount);
    $('input[name="buyer_cost"]').val(totalamount)
    var freenet = totalamount - (totalamount * 5/100);
    $('input[name="freelancer_nets"]').val(freenet);
  },
  //blended rate
  'change #first_hours, keyup #first_hours, change #first_max_hours, keyup #first_max_hours, change #next_hours, keyup #next_hours, change #next_max_hours, keyup #next_max_hours': function(event, template) {
    event.preventDefault();
    var payforfirsthours = $('#first_hours').val();
    var firsthours = $('#first_max_hours').val();
    var payfornexthours = $('#next_hours').val();
    var nexthours = $('#next_max_hours').val();
    var totalforfirsthours = payforfirsthours * firsthours;
    var totalfornexthours = payfornexthours * nexthours;
    var totalamount = totalforfirsthours + totalfornexthours;
    $('input[name="total_amount"]').val(totalamount);
    $('input[name="buyer_cost"]').val(totalamount)
    var freenet = totalamount - (totalamount * 5/100);
    $('input[name="freelancer_nets"]').val(freenet);
  },
  'change input[value="provider"]': function(event, template) {
    event.preventDefault();
    var totalamount = parseFloat($('input[name="total_amount"]').val());
    $('input[name="buyer_cost"]').val(totalamount);
    var freenet = totalamount - totalamount * 5/100;
    $('input[name="freelancer_nets"]').val(freenet);
  },
  'change input[value="buyer"]': function(event, template) {
    event.preventDefault();
    var totalamount = parseFloat($('input[name="total_amount"]').val());
    var clientCost = totalamount + totalamount * 5/100;
    $('input[name="buyer_cost"]').val(clientCost);
    $('input[name="freelancer_nets"]').val(totalamount);
  },
  'click .acceptApplication': function(event, template) {
    event.preventDefault();
    var jobId = Router.current().params._id;
    var userId = this.userId;
    var applicationTime = this.appliedAt;
    Meteor.call('acceptApplication', jobId, userId, applicationTime, function (error, result) {
      if(error) {
        toastr.error("Failed to accept the application");
      }
      else {
        toastr.success("An invitation has been sent to the provider to confirm assigmnemt.");
      }
    });
  },
  'click .counterOffer': function(event, template) {
    event.preventDefault();
    var jobId = this._id;
    var counterOffer = {}
    var counterType = $('#counter_type').val();
    var fixed_amount = $('#fixed_amount').val();
    var hourly_rate = $('#hourly_rate').val();
    var max_hours = $('#max_hours').val();
    var device_rate = $('#device_rate').val();
    var max_devices = $('#max_devices').val();
    var first_hours = $('#first_hours').val();
    var first_max_hours = $('#first_max_hours').val();
    var next_hours = $('#next_hours').val();
    var next_max_hours = $('#next_max_hours').val();
    var total_amount = $('input[name="total_amount"]').val();
    var buyer_cost = $('input[name="buyer_cost"]').val();
    var freelancer_nets = $('input[name="freelancer_nets"]').val();
    if(counterType == "fixed_pay") {
      counterOffer = {
        "userId": Meteor.userId(),
        "counterType": counterType,
        "fixed_amount": fixed_amount,
        "total_amount": total_amount,
        "buyer_cost": buyer_cost,
        "freelancer_nets": freelancer_nets,
        "countered_at": new Date()
      }
    }
    else if(counterType == "per_hour") {
      counterOffer = {
        "userId": Meteor.userId(),
        "counterType": counterType,
        "hourly_rate": hourly_rate,
        "max_hours": max_hours,
        "total_amount": total_amount,
        "buyer_cost": buyer_cost,
        "freelancer_nets": freelancer_nets,
        "countered_at": new Date()
      }
    }
    else if(counterType == "per_device") {
      counterOffer = {
        "userId": Meteor.userId(),
        "counterType": counterType,
        "device_rate": device_rate,
        "max_devices": max_devices,
        "total_amount": total_amount,
        "buyer_cost": buyer_cost,
        "freelancer_nets": freelancer_nets,
        "countered_at": new Date()
      }
    }
    else if(counterType == "blended") {
      counterOffer = {
        "userId": Meteor.userId(),
        "counterType": counterType,
        "first_hours": first_hours,
        "first_max_hours": first_max_hours,
        "next_hours": next_hours,
        "next_max_hours": next_max_hours,
        "total_amount": total_amount,
        "buyer_cost": buyer_cost,
        "freelancer_nets": freelancer_nets,
        "countered_at": new Date()
      }
    }
    Meteor.call('counterOfferThisJob', jobId, counterOffer, function (error) {
      if(error) {
        toastr.error(error.message, 'Error');
      }
      else {
        toastr.success("You've counter offered to this job.");
      }
    });
  }
});

Template.job.helpers({
  'buyer': function() {
    return Buyers.findOne({userId: this.userId});
  },
  'hasLabel': function() {
    return this.jobType || this.featured;
  },
  'applicationsCount': function() {
  	var count = 0;
  	Jobs.findOne(this._id).applications.forEach(function(uId) {
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
  'counterOfferedProviders': function() {
    var counterOffers = [];
    counteredUsers = [];
    Jobs.findOne(this._id).counterOffers.forEach(function(counterOffer) {
      var pDetails = Profiles.findOne({userId: counterOffer.userId});
      providerDetails = {
        userId: counterOffer.userId,
        name: pDetails.name,
        title: pDetails.title,
        company: pDetails.companyName,
        countered_at: counterOffer.countered_at,
        fixed_amount:counterOffer.fixed_amount,
        hourly_rate: counterOffer.hourly_rate,
        max_hours: counterOffer.max_hours,
        device_rate: counterOffer.device_rate,
        max_devices: counterOffer.max_devices,
        first_hours: counterOffer.first_hours,
        first_max_hours: counterOffer.first_max_hours,
        next_hours: counterOffer.next_hours,
        next_max_hours: counterOffer.next_max_hours,
      }
      counterOffers.push(providerDetails);
    });
    return counterOffers;
  },
  'appliedProviders': function() {
    var providerIds = [];
    var providerDetails = {}
    Jobs.findOne(this._id).applications.forEach(function(providerId) {
      var pDetails = Profiles.findOne({userId: providerId.userId});
      providerDetails = {
        userId: providerId.userId,
        name: pDetails.name,
        title: pDetails.title,
        company: pDetails.companyName,
        appliedAt: providerId.applied_at
      }
      providerIds.push(providerDetails);
    });
    return providerIds;
  },
  'jobPostedBuyer': function() {
    var jobDetails = Jobs.findOne(this._id);
    if(jobDetails.userId == Meteor.userId())
      return true;
    else
      return false;
  }
});
