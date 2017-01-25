Template.job.events({
  'click #appliedProviderMsg': function(event, template) {
    event.preventDefault();
    var userId = Profiles.findOne({_id: this.userId}).userId;
    Router.go('/mailbox/newpromsg?userId=' + userId);
    event.stopPropagation();
  },
  'click #loadMap': function(event, template) {
    if(GoogleMaps.loaded()) {
      $('#locationDet').geocomplete({
        map: $('#loadMapHere'),
        mapOptions: {
          center: new google.maps.LatLng(this.fullLocation.latitude, this.fullLocation.longitude),
          scrollwheel: true,
          zoom: 20
        },
        markerOptions: {
          visible: true,
          position: new google.maps.LatLng(this.fullLocation.latitude, this.fullLocation.longitude)
        }
      })
    }
  },
  'change input[name="app_type"]': function(event, template) {
    if(event.target.value == 'application') {
      $('div#app_selected').show();
      $('div#counter_selected').hide();
    } else if(event.target.value == 'counteroffer') {
      $('div#counter_selected').show();
      $('div#app_selected').hide();
    }
  },
  'click .applyInactive': function(event, template) {
    event.preventDefault();
    $(event.currentTarget).button('loading')
    var jobId = this._id;
    var applicationDetails = {
      "userId": Meteor.userId(),
      "applied_at": new Date(),
      "app_type": 'application'
    }
  	Meteor.call('applyForThisJob', jobId, applicationDetails, function(error) {
  		if(error) {
  			toastr.error(error.message, 'Error');
  		}
  		else {
  			$(event.currentTarget).removeClass('applyInactive');
        $(event.currentTarget).addClass('applyActive');
  		}
  	})
  },
  'click .applyActive': function(event, template) {
    event.preventDefault();
    $(event.currentTarget).button('loading')
    var jobId = this._id;
    Meteor.call('removeFromAppliedJobs', jobId, Meteor.userId(), function(error) {
      if(error) {
        toastr.error(error.message, 'Error');
      }
      else {
        $(event.currentTarget).removeClass('applyActive');
        $(event.currentTarget).addClass('applyInactive');
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
  'change #request_type': function(event, template) {
    event.preventDefault();
    var requestType = $('#request_type').val();
    if(requestType == 'fixed_pay') {
      $('#fixed-request').show();
      $('#fixed_amount_req').attr('required', 'required');
    }
    else {
      $('#fixed-request').hide();
      $('#fixed_amount_req').removeAttr('required');
    }
    if(requestType == 'per_hour') {
      $('#hourly-request').show();
      $('#hourly_rate_req').attr('required', 'required');
      $('#max_hours_req').attr('required', 'required');
    }
    else {
      $('#hourly-request').hide();
      $('#max_hours_req').removeAttr('required');
      $('#hourly_rate_req').removeAttr('required');
    }
    if(requestType == 'per_device') {
      $('#per-device-request').show();
    }
    else {
      $('#per-device-request').hide();
    }
    if(requestType == 'blended') {
      $('#blended-request').show();
    }
    else {
      $('#blended-request').hide();
    }
  },
  //fixed rate
  'change #fixed_amount, keyup #fixed_amount': function(event, template) {
    event.preventDefault();
    var fixedamount = parseFloat($('#fixed_amount').val());
    $('input[name="total_amount"]').val(fixedamount);
    var buyerCost = parseFloat(fixedamount + (fixedamount * 5/100));
    $('input[name="buyer_cost"]').val(buyerCost);
    var freenet = fixedamount;
    $('input[name="freelancer_nets"]').val(freenet);
  },
  //hourly rate
  'change #hourly_rate, keyup #hourly_rate, change #max_hours, keyup #max_hours': function(event, template) {
    event.preventDefault();
    var hourlyrate = parseFloat($('#hourly_rate').val());
    var maxhours = parseFloat($('#max_hours').val());
    var totalamount = hourlyrate * maxhours;
    $('input[name="total_amount"]').val(totalamount);
    var buyerCost = totalamount + (totalamount * 5/100);
    $('input[name="buyer_cost"]').val(buyerCost);
    var freenet = totalamount;
    $('input[name="freelancer_nets"]').val(freenet);
  },
  //device rate
  'change #device_rate, keyup #device_rate, change #max_devices, keyup #max_devices': function(event, template) {
    event.preventDefault();
    var devicerate = parseFloat($('#device_rate').val());
    var maxdevices = parseFloat($('#max_devices').val());
    var totalamount = devicerate * maxdevices;
    $('input[name="total_amount"]').val(totalamount);
    var buyerCost = totalamount + (totalamount * 5/100);
    $('input[name="buyer_cost"]').val(buyerCost);
    var freenet = totalamount;
    $('input[name="freelancer_nets"]').val(freenet);
  },
  //blended rate
  'change #first_hours, keyup #first_hours, change #first_max_hours, keyup #first_max_hours, change #next_hours, keyup #next_hours, change #next_max_hours, keyup #next_max_hours': function(event, template) {
    event.preventDefault();
    var payforfirsthours = parseFloat($('#first_hours').val());
    var firsthours = parseFloat($('#first_max_hours').val());
    var payfornexthours = parseFloat($('#next_hours').val());
    var nexthours = parseFloat($('#next_max_hours').val());
    var totalforfirsthours = parseFloat(payforfirsthours);
    var totalfornexthours = payfornexthours * nexthours;
    var totalamount = parseFloat(totalforfirsthours + totalfornexthours);
    $('input[name="total_amount"]').val(totalamount);
    var buyerCost = totalamount + (totalamount * 5/100);
    $('input[name="buyer_cost"]').val(buyerCost)
    var freenet = totalamount;
    $('input[name="freelancer_nets"]').val(freenet);
  },
  'change #fixed_amount_req, keyup #fixed_amount_req': function(event, template) {
    event.preventDefault();
    var fixedamount = parseFloat($('#fixed_amount_req').val());
    $('input[name="total_amount_req"]').val(fixedamount);
    var buyerCost = parseFloat(fixedamount + (fixedamount * 5/100));
    $('input[name="buyer_req_cost"]').val(buyerCost);
    var freenet = fixedamount;
    $('input[name="freelancer_req_nets"]').val(freenet);
  },
  //hourly rate
  'change #hourly_rate_req, keyup #hourly_rate_req, change #max_hours_req, keyup #max_hours_req': function(event, template) {
    event.preventDefault();
    var hourlyrate = parseFloat($('#hourly_rate_req').val());
    var maxhours = parseFloat($('#max_hours_req').val());
    var totalamount = hourlyrate * maxhours;
    $('input[name="total_amount_req"]').val(totalamount);
    var buyerCost = totalamount + (totalamount * 5/100);
    $('input[name="buyer_req_cost"]').val(buyerCost);
    var freenet = totalamount;
    $('input[name="freelancer_req_nets"]').val(freenet);
  },
  //device rate
  'change #device_rate_req, keyup #device_rate_req, change #max_devices_req, keyup #max_devices_req': function(event, template) {
    event.preventDefault();
    var devicerate = parseFloat($('#device_rate_req').val());
    var maxdevices = parseFloat($('#max_devices_req').val());
    var totalamount = devicerate * maxdevices;
    $('input[name="total_amount_req"]').val(totalamount);
    var buyerCost = totalamount + (totalamount * 5/100);
    $('input[name="buyer_req_cost"]').val(buyerCost);
    var freenet = totalamount;
    $('input[name="freelancer_req_nets"]').val(freenet);
  },
  //blended rate
  'change #first_hours_req, keyup #first_hours_req, change #first_max_hours_req, keyup #first_max_hours_req, change #next_hours_req, keyup #next_hours_req, change #next_max_hours_req, keyup #next_max_hours_req': function(event, template) {
    event.preventDefault();
    var payforfirsthours = parseFloat($('#first_hours_req').val());
    var firsthours = parseFloat($('#first_max_hours_req').val());
    var payfornexthours = parseFloat($('#next_hours_req').val());
    var nexthours = parseFloat($('#next_max_hours_req').val());
    var totalforfirsthours = parseFloat(payforfirsthours);
    var totalfornexthours = payfornexthours * nexthours;
    var totalamount = parseFloat(totalforfirsthours + totalfornexthours);
    $('input[name="total_amount_req"]').val(totalamount);
    var buyerCost = totalamount + (totalamount * 5/100);
    $('input[name="buyer_req_cost"]').val(buyerCost)
    var freenet = totalamount;
    $('input[name="freelancer_req_nets"]').val(freenet);
  },
  // 'change input[value="provider"]': function(event, template) {
  //   event.preventDefault();
  //   var totalamount = parseFloat($('input[name="total_amount"]').val());
  //   var buyerCost = totalamount - totalamount * 5/100;
  //   $('input[name="buyer_cost"]').val(buyerCost);
  //   var freenet = totalamount;
  //   $('input[name="freelancer_nets"]').val(freenet);
  // },
  // 'change input[value="buyer"]': function(event, template) {
  //   event.preventDefault();
  //   var totalamount = parseFloat($('input[name="total_amount"]').val());
  //   var clientCost = totalamount + totalamount * 5/100;
  //   $('input[name="buyer_cost"]').val(clientCost);
  //   $('input[name="freelancer_nets"]').val(totalamount);
  // },
  'click .acceptApplication': function(event, template) {
    event.preventDefault();
    $(event.currentTarget).button('loading');
    var jobId = Router.current().params._id;
    var userId = Profiles.findOne({_id: this.userId}).userId;
    var applicationTime = this.appliedAt;
    Meteor.call('acceptApplication', jobId, userId, applicationTime, function (error, result) {
      if(error) {
        $(event.currentTarget).button('reset');
        // toastr.error("Failed to accept the application");
      }
    });
  },
  'click .acceptCounterOffer': function(event, template) {
    $(event.currentTarget).button('loading');
    var jobId = Router.current().params._id;
    var userId = Profiles.findOne({_id: this.userId}).userId;
    var buyerCost = this.buyer_cost;
    var applied_at = this.appliedAt;
    var freenets = this.freelancer_nets;
    var jobDetails = Jobs.findOne({_id: jobId});
    if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
      buyerId = Meteor.userId();
    else if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
      buyerId = Meteor.user().invitedBy;
    var buyerWallet = Wallet.findOne({userId: buyerId});
    if(buyerCost > jobDetails.your_cost) {
      var diff = buyerCost - jobDetails.your_cost;
      if(diff > buyerWallet.accountBalance) {
        toastr.error('Your wallet balance is low. Please depositi sufficient funds to accept this counter offer.');
        $(event.currentTarget).button('reset');
        return;
      } else {
        Meteor.call('acceptHighBudgetCO', diff, buyerId, jobId, function(error) {
          if(error) {
            $(event.currentTarget).button('reset');
          }
        });
      }
    } else if(buyerCost < jobDetails.your_cost) {
      var diff = jobDetails.your_cost - buyerCost;
      Meteor.call('acceptLowBudgetCO', diff, buyerId, jobId, function(error) {
        if(error) {
          $(event.currentTarget).button('reset');
        }
      })
    }
    Meteor.call('acceptCounterOffer', jobId, userId, applied_at, buyerCost, freenets, function(error) {
      if(error) {
        $(event.currentTarget).button('reset');
      }
    })
  },
  'click .counterInactive': function(event, template) {
    event.preventDefault();
    $(event.currentTarget).button('loading')
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
        "applied_at": new Date(),
        "app_type": 'counteroffer'
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
        "applied_at": new Date(),
        "app_type": 'counteroffer'
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
        "applied_at": new Date(),
        "app_type": 'counteroffer'
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
        "applied_at": new Date(),
        "app_type": 'counteroffer'
      }
    }
    Meteor.call('applyForThisJob', jobId, counterOffer, function (error) {
      if(error) {
        $(event.currentTarget).button('reset');
        toastr.error(error.message, 'Error');
      }
      else {
        $(event.currentTarget).button('reset');
        $(event.currentTarget).removeClass('counterInactive');
        $(event.currentTarget).addClass('counterActive');
      }
    });
  },
  'click .counterActive': function(event, template) {
    event.preventDefault();
    $(event.currentTarget).button('loading');
    var jobId = this._id;
    Meteor.call('removeFromAppliedJobs', jobId, Meteor.userId(), function(error) {
      if(error) {
        $(event.currentTarget).button('reset');
        toastr.error(error.message, 'Error');
      }
      else {
        $(event.currentTarget).button('reset');
        $(event.currentTarget).removeClass('counterActive');
        $(event.currentTarget).addClass('counterInactive');
      }
    })
  },
  'click button.submit-task': function(event, template) {
    event.preventDefault();
    var id = $(event.currentTarget).parent().parent().parent().parent().find('.task-form').data('id');
    var obj = {};
    obj.state = $(event.currentTarget).parent().parent().parent().find('.state').val();
    obj.comments = $(event.currentTarget).parent().parent().parent().find('.comments').val();
    obj.task = $(event.currentTarget).parent().parent().parent().find('.taskName').val();
    obj.jobID = Router.current().params.jobID;

    Meteor.call('updateTask',id,obj,function(err,res){
      if(err) {
       toastr.error('Operation failed');
      }
    });
    event.preventDefault();
  },
  "change .file_bag": function(event) {
    event.preventDefault();
    var files = $(event.currentTarget)[0].files

    if (!files) return;
    var id = this._id;
    S3.upload({
        files: files,
        path: S3_FILEUPLOADS
    }, function(err, res) {
        $('.progress').remove();
        if (err) toastr.error("Failed to upload file");
        else {
            var fileDetails = {
              file_url: res.secure_url,
              file_name: res.file.original_name
            }
            Meteor.call('addFile', fileDetails, id,function (error, result) {
              if(error)
                toastr.error("Failed to upload file. Try again.");
            });
        }
    });
  },
  "click .remove-file" : function(event) {
    event.preventDefault();
    $('#spinner').show();
    var id = $(event.currentTarget).data('id');
    var url = $(event.currentTarget).data('path');
    var index = url.indexOf(S3_FILEUPLOADS)-1;
    var path = url.substr(index);
    S3.delete(path, function(err, res) {
        $('#spinner').hide();
        if (err) {
            toastr.error("Operation failed");
        } else {
            Meteor.call('deleteFile', url, id,function (error, result) {
                if(error)
                  toastr.error("Failed to delete file. Try again.");
            });
        }
    });
  },
  "change .check-in-toggle" : function(event) {
    var id = $(event.currentTarget).data('id');
    if($(event.currentTarget).is(":checked")){
      //Checked Out
      Meteor.call('recordTime',id,false,function (error, result) {});
      $('.show-checkin-time').hide();
    }
    else{
      //Checked In
      Meteor.call('recordTime',id,true,function (error, result) {});
      $('.show-checkin-time').show();
    }
  },
  "click button.remove-log-entry" : function(event) {
    var id = $(event.currentTarget).val();
    var jobID = Router.current().params._id;
    $("div[data-logid='"+id+"']").attr('data-logid','new');
    Meteor.call('removeLog',jobID,false,id,function(err,res){});
  },
  "click button.edit-log" : function(event) {
    $('button.submit-log').html('Update');
    var logID = $(event.currentTarget).parent().data('id');
    var jobID = Router.current().params._id;
    $("div[data-logid]").attr('data-logid',logID);
    var obj = TimeSheet.findOne({'jobID':jobID}).logs;
    obj.map(function(ele){
      if(ele.id==logID){
        var chkIn = moment(new Date(ele.checkIn)).format('MM/DD/YYYY h:mm A');
        var chkOut = moment(new Date(ele.checkOut)).format('MM/DD/YYYY h:mm A');
        $("#datetimepicker1").find("input").val(chkIn);
        $("#datetimepicker2").find("input").val(chkOut);
        return;
      }
    });
  },
  "click span.timesheet" : function(event)  {
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();
  },
  "click button.submit-log" : function(event) {
    var logID = $("div[data-logid]").attr('data-logid');
    var start = $("#datetimepicker1").find("input").val();
    var end = $("#datetimepicker2").find("input").val();

    var jobID = Router.current().params._id;
    start = start?new Date(start):false;
    end = end?new Date(end):false;
    if(start && end) {
      // Complete Entry
      var timeDiff = end - start;
      if(timeDiff<0) {
        toastr.warning('Checkout should be done after checking in');
        return;
      }
      var obj = {};
      obj.in = start;
      obj.out = end;
      obj.logID = logID;
      Meteor.call('recordTime',jobID,obj,false,function (error, result) {});
    } else if(start && !end) {
      // Incomplete Entry
      var obj = {};
      obj.in = start;
      Meteor.call('recordTime',jobID,obj,true,function (error, result) {});
    } else {
      // Error
      toastr.warning('Enter valid date time');
    }

    $('button.submit-log').html('Save');
    $("#datetimepicker1").find("input").val('');
    $("#datetimepicker2").find("input").val('');
    $("div[data-logid]").attr('data-logid','new');
  },
  "click button.delete-log" : function(event) {
    var logID = $(event.currentTarget).parent().data('logid');
    var jobID = Router.current().params._id;
    if(logID=="new"){
      Meteor.call('removeLog',jobID,true,'',function (error, result) {});
    } else {
      Meteor.call('removeLog',jobID,false,logID,function (error, result) {});
    }
    $("div[data-logid]").attr('data-logid','new');
    $("#datetimepicker1").find("input").val('');
    $("#datetimepicker2").find("input").val('');
    $('button.submit-log').html('Save');
  },
  "click div.date" : function(event) {
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();
  },
  "click button.clear-log" : function(event) {
    var logID = $(event.currentTarget).parent().data('logid');
    var jobID = Router.current().params._id;
    if(logID=="new"){
      Meteor.call('removeLog',jobID,true,'',function (error, result) {});
    }
    $("#datetimepicker1").find("input").val('');
    $("#datetimepicker2").find("input").val('');
    $("div[data-logid]").attr('data-logid','new');
    $('button.submit-log').html('Save');
  },
  'click button.confirmAssignment': function(event, template) {
    event.preventDefault();
    $(event.currentTarget).button('loading');
    var buyerId = this.userId;
    var jobId = this._id;
    Meteor.call('confirmAssignment', jobId, buyerId, function(error) {
      if(error) {
        $(event.currentTarget).button('reset');
      }
    })
  },
  'click button.declineAssignment': function(event, template) {
    $(event.currentTarget).button('loading');
    var jobId = this._id;
    var userId = Meteor.userId();
    Meteor.call('declineAssignment', jobId, userId, function(error) {
      if(error) {
        $(event.currentTarget).button('reset');
      }
    });
  },
  'click button.submitAssignment': function(event, template) {
    event.preventDefault();
    var applicationDetails = {};
    var jobDetails = Jobs.findOne({_id: this._id});
    var applications = jobDetails.applications;
    var total = Session.get('totalHours');
    for(var i = 0; i < applications.length; i++) {
      if(applications[i].app_status == 'accepted') {
        applicationDetails = applications[i];
        break;
      }
    }
    if(applicationDetails.app_type == 'application') {
      if(jobDetails.ratebasis == 'Per Hour') {
        var timeWorkedMins = total.hours * 60 + total.minutes;
        var jobEstimatedMins = jobDetails.maxhours * 60;
        var providerEarnings = jobDetails.freelancer_nets;
        var earningsPerMinute = providerEarnings / jobEstimatedMins;
        var workedEarnings = timeWorkedMins * earningsPerMinute;
        var diff = jobEstimatedMins - timeWorkedMins;
        var duration = moment.duration(diff, 'minutes')
        var hours = Math.floor(duration.asHours());
        var mins = Math.floor(duration.asMinutes()) - hours * 60;
        var timeWorked = {
          hours: hours,
          minutes: mins,
        }
      }
    }
    if(applicationDetails.app_type == 'counteroffer') {
      if(applicationDetails.counterType == 'per_hour') {
        var timeWorkedMins = total.hours * 60 + total.minutes;
        var jobEstimatedMins = applicationDetails.max_hours * 60;
        var providerEarnings = applicationDetails.freelancer_nets;
        var earningsPerMinute = providerEarnings/jobEstimatedMins;
        console.log(+(Math.round(earningsPerMinute + 'e+2') + 'e-2'))
        var workedEarnings = timeWorkedMins * earningsPerMinute;
        var diff = jobEstimatedMins - timeWorkedMins;
        var duration = moment.duration(diff, 'minutes')
        var hours = Math.floor(duration.asHours());
        var mins = Math.floor(duration.asMinutes()) - hours * 60;
        var lessTime = {
          hours: hours,
          minutes: mins,
        }
        if(timeWorkedMins < jobEstimatedMins) {
          console.log(lessTime);
        }
      }
    }
    $(event.currentTarget).button('loading');
    var jobId = this._id;
    Meteor.call('submitAssignment', jobId, function(error) {
      if(error) {
        $(event.currentTarget).button('reset');
        toastr.error('Failed to submit job. Please try again.');
      }
    });
  },
  'change input[name="bonus_request"]': function(event, template) {
    if($(event.currentTarget).val() == 'Yes') {
      var bonusObject = BonusRequests.findOne({jobId: Router.current().params._id});
      var jobDetails = Jobs.findOne({_id: Router.current().params._id});
      var userWallet = Wallet.findOne({userId: Meteor.userId()});
      if(jobDetails.bonusRequested && bonusObject) {
        if(bonusObject.buyer_cost > userWallet.accountBalance) {
          $('.noReqBal').show();
          $('button.increaseBudget').attr('disabled', 'disabled');
        } else {
          $('.noReqBal').hide();
          $('button.increaseBudget').removeAttr('disabled', 'disabled');
        }
      }
    }
  },
  'click button.increaseBudget': function(event, template) {
    event.preventDefault();
    var approveBonus = $('input[name="bonus_request"]:checked').val();
  },
  'click button.approveAssignment': function(event, template) {
    event.preventDefault();
    $(event.currentTarget).button('loading');
    var jobDetails = Jobs.findOne({_id: Router.current().params._id});
    var acceptedApplication = Session.get('acceptedApplication');
    var providerId = this.assignedProvider;
    if(acceptedApplication.appType == 'application') {
      if(jobDetails.ratebasis == 'Per Hour') {
        var providerWorked = Session.get('totalHours');
        var jobEstimatedMins = jobDetails.maxhours * 60;
        var estimatedBudgetPerMin = jobDetails.freelancer_nets / jobEstimatedMins;
        var providerWorkedMins = providerWorked.hours * 60 + providerWorked.minutes;
        if(providerWorkedMins < jobEstimatedMins) {
          var providerEarnings = providerWorkedMins * estimatedBudgetPerMin;
          var diff = jobDetails.freelancer_nets - providerEarnings;
          Meteor.call('updateBudget', jobDetails._id, diff, function(error, result) {
            if(error) {
              $(event.currentTarget).button('reset');
            } else {
              Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
                if(error) {
                  $(event.currentTarget).button('reset');
                }
              })
            }
          })
        } else {
          Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
            if(error) {
              $(event.currentTarget).button('reset');
            }
          })
        }
      } else if(jobDetails.ratebasis == 'Per Device') {
        var providerCompletedDevices = jobDetails.devicescompleted;
        if(providerCompletedDevices < jobDetails.maxdevices) {
          var providerEarnings = providerCompletedDevices * jobDetails.rateperdevice;
          var diff = jobDetails.freelancer_nets - providerEarnings;
          Meteor.call('updateBudget', jobDetails._id, diff, function(error, result) {
            if(error) {
              $(event.currentTarget).button('reset');
            } else {
              Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
                if(error) {
                  $(event.currentTarget).button('reset');
                }
              })
            }
          })
        } else {
          Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
            if(error) {
              $(event.currentTarget).button('reset');
            }
          })
        }
      } else if(jobDetails.ratebasis == 'Blended') {
        var providerWorked = Session.get('totalHours');
        var providerWorkedMins = providerWorked.hours * 60 + providerWorked.minutes;
        var firstHourMinutes = jobDetails.firsthours * 60;
        var nextHourMinutes = jobDetails.nexthours * 60;
        var totalMinutes = firstHourMinutes + nextHourMinutes;
        var providerEarnings;
        var diff;
        if(providerWorkedMins < firstHourMinutes) {
          providerEarnings = jobDetails.payforfirsthours;
          diff = jobDetails.freelancer_nets - providerEarnings;
        }
        if(providerWorkedMins > firstHourMinutes && providerWorkedMins < totalMinutes) {
          var payForFirstHours = jobDetails.payforfirsthours;
          var nextMinutesWorked = providerWorkedMins - firstHourMinutes;
          var nextHourPayMins = jobDetails.payfornexthours / 60;
          providerEarnings = payForFirstHours + nextMinutesWorked * nextHourPayMins;
          diff = jobDetails.freelancer_nets - providerEarnings;
        }
        if(providerWorkedMins == totalMinutes) {
          Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
            if(error) {
              $(event.currentTarget).button('reset');
            }
          })
        }
        Meteor.call('updateBudget', jobDetails._id, diff, function(error, result) {
          if(error) {
            $(event.currentTarget).button('reset');
          } else {
            Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
              if(error) {
                $(event.currentTarget).button('reset');
              }
            })
          }
        })
      } else {
        Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
          if(error) {
            $(event.currentTarget).button('reset');
          }
        })
      }
    }
    if(acceptedApplication.appType == 'counteroffer') {
      if(acceptedApplication.counter_type == 'per_hour') {
        var providerWorked = Session.get('totalHours');
        var jobEstimatedMins = acceptedApplication.max_hours * 60;
        var estimatedBudgetPerMin = acceptedApplication.freelancer_nets / jobEstimatedMins;
        var providerWorkedMins = providerWorked.hours * 60 + providerWorked.minutes;
        console.log(providerWorkedMins, jobEstimatedMins);
        $(event.currentTarget).button('reset');
        if(providerWorkedMins < jobEstimatedMins) {
          var providerEarnings = providerWorkedMins * estimatedBudgetPerMin;
          console.log(providerEarnings);
          var diff = acceptedApplication.freelancer_nets - providerEarnings;
          Meteor.call('updateBudget', jobDetails._id, providerEarnings, diff, function(error, result) {
            if(error) {
              $(event.currentTarget).button('reset');
            } else {
              Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
                if(error) {
                  $(event.currentTarget).button('reset');
                }
              })
            }
          })
        } else {
          Meteor.call('approveAssigment', jobDetails._id, providerId, function(error, result) {
            if(error) {
              $(event.currentTarget).button('reset');
            }
          })
        }
      } else if(acceptedApplication.counter_type == 'per_device') {
        var providerCompletedDevices = jobDetails.devicescompleted;
        if(providerCompletedDevices < acceptedApplication.max_devices) {
          var providerEarnings = providerCompletedDevices * acceptedApplication.device_rate;
          var diff = acceptedApplication.freelancer_nets - providerEarnings;
          Meteor.call('updateBudget', jobDetails._id, diff, function(error, result) {
            if(error) {
              $(event.currentTarget).button('reset');
            } else {
              Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
                if(error) {
                  $(event.currentTarget).button('reset');
                }
              })
            }
          })
        } else {
          Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
            if(error) {
              $(event.currentTarget).button('reset');
            }
          })
        }
      } else if(acceptedApplication.counter_type == 'blended') {
        var providerWorked = Session.get('totalHours');
        var providerWorkedMins = providerWorked.hours * 60 + providerWorked.minutes;
        var firstHourMinutes = acceptedApplication.first_max_hours * 60;
        var nextHourMinutes = acceptedApplication.next_max_hours * 60;
        var totalMinutes = firstHourMinutes + nextHourMinutes;
        var providerEarnings;
        var diff;
        if(providerWorkedMins < firstHourMinutes) {
          providerEarnings = acceptedApplication.first_hours;
          diff = acceptedApplication.freelancer_nets - providerEarnings;
        }
        if(providerWorkedMins > firstHourMinutes && providerWorkedMins < totalMinutes) {
          var payForFirstHours = acceptedApplication.first_hours;
          var nextMinutesWorked = providerWorkedMins - firstHourMinutes;
          var nextHourPayMins = acceptedApplication.payfornexthours / 60;
          providerEarnings = payForFirstHours + nextMinutesWorked * nextHourPayMins;
          diff = acceptedApplication.freelancer_nets - providerEarnings;
        }
        if(providerWorkedMins == totalMinutes) {
          Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
            if(error) {
              $(event.currentTarget).button('reset');
            }
          })
        }
        Meteor.call('updateBudget', jobDetails._id, diff, function(error, result) {
          if(error) {
            $(event.currentTarget).button('reset');
          } else {
            Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
              if(error) {
                $(event.currentTarget).button('reset');
              }
            })
          }
        })
      } else {
        Meteor.call('approveAssignment', jobDetails._id, providerId, function(error, result) {
          if(error) {
            $(event.currentTarget).button('reset');
          }
        })
      }
    }
  },
  'click button.rejectAssignment': function(event, template) {
    $(event.currentTarget).button('loading');
    var jobId = this._id;
    Meteor.call('rejectAssignment', jobId, function(error) {
      if(error) {
        $(event.currentTarget).button('reset');
        toastr.error('Failed to reject job. Please try again.');
      }
    });
  },
  'click button.deactivateJob': function(event, template) {
    $(event.currentTarget).button('loading');
    var jobId = this._id;
    var buyerId;
    if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
      buyerId = Meteor.userId();
    }
    else if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
      buyerId = Meteor.user().invitedBy;
    }
    Meteor.call('deactivateJob', jobId, buyerId, function(error) {
      if(error) {
        $(event.currentTarget).button('error');
        toastr.error('Failed to deactivate job Please try again.');
      }
    })
  },
  'click button.activateJob': function(event, template) {
    var jobId = this._id;
    Meteor.call('activateJob', jobId, function(error) {
      if(error) {
        toastr.error('Failed to activate the job. Please try again.');
      }
    })
  },
  'click a.createPdf': function(event, template) {
    Meteor.call('generatePdf', this._id, function(err, res) {
      if(err) {
        toastr.error('Failed to create PDF. Please try again.');
      } else {
        window.open("data:applications/pdf;base64, " + res);
      }
    })
  },
  'click a.sendProviderMessage': function(event, template) {
    event.preventDefault();
    var userId = Profiles.findOne({_id: this.id}).userId;
    var jobId = Router.current().params._id;
    Router.go('/mailbox/newapm?proId=' + userId + '&jobId=' + jobId);
    event.stopPropagation();
  },
  'click a.sendBuyerMessage': function(event, template) {
    event.preventDefault();
    var userId = this.userId;
    var jobId = Router.current().params._id;
    Router.go('/mailbox/newpbm?buyId=' + userId + '&jobId=' + jobId);
    event.stopPropagation();
  },
  'click button.contactSupport': function(event, template) {
    event.preventDefault();
    var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
    var jobId = Router.current().params._id;
    Router.go('/mailbox/newcsm?admId=' + adminId + '&jobId=' + jobId);
    event.stopPropagation();
  },
  'click button.rejectCounterOffer': function(event, template) {
    $(event.currentTarget).button('loading');
    var jobId = Router.current().params._id;
    var userId = Profiles.findOne({_id: this.userId}).userId;
    var applied_at = this.appliedAt;
    var jobDetails = Jobs.findOne({_id: jobId});
    var diff;
    if(this.buyer_cost > jobDetails.your_cost) {
      diff = this.buyer_cost - jobDetails.your_cost;
    }
    Meteor.call('rejectCounterOffer', jobId, userId, applied_at, diff, function(error) {
      if(error) {
        $(event.currentTarget).button('reset');
      }
    })
  },
  'click button.rejectApplication': function(event, template) {
    var jobId = Router.current().params._id;
    $(event.currentTarget).button('loading');
    var userId = Profiles.findOne({_id: this.userId}).userId;
    var applied_at = this.appliedAt;    
    Meteor.call('rejectApplication', jobId, userId, applied_at, function(error) {
      if(error) {
        $(event.currentTarget).button('reset');
        toastr.error('Failed to reject the application. Please try again');
      }
    })
  },
  'click .addFav': function(event, template) {
    event.preventDefault();
    var userId;
    if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'corporate-manager'])) {
      userId = Profiles.findOne({_id: this.id}).userId;
    }
    if(Roles.userIsInRole(Meteor.userId(), ['provider', 'corporate-provider'])) {
      userId = Buyers.findOne({_id: this.id}).userId;
    }
    Meteor.call('addToFav', userId, Meteor.user().roles[0], function(error) {
      if(error) {
        console.log('Failed to add to favorites');
      }
      else {
        $(event.currentTarget).removeClass('addFav');
        $(event.currentTarget).addClass('remFav');
      }
    });
    event.stopPropagation();
  },
  'click .remFav': function(event, template) {
    event.preventDefault();
    var userId;
    if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
      userId = Profiles.findOne({_id: this.id}).userId;
    }
    if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
      userId = Buyers.findOne({_id: this.id}).userId;
    }
    Meteor.call('removeFromFav', userId, Meteor.user().roles[0], function(error) {
      if(error) {
        console.log('Failed to add to favorites');
      }
      else {
        $(event.currentTarget).removeClass('remFav');
        $(event.currentTarget).addClass('addFav');
        console.log('Added to favorites');
      }
    });
    event.stopPropagation();
  },
  'click .pay30Usd': function(event, template) {
    $(event.currentTarget).button('loading')
    var buyerPayable = 30;
    var buyerPays = buyerPayable + buyerPayable * 5/100;
    var adminGets = buyerPayable * 5/100;
    var providerGets = buyerPayable;
    var assignedProvider = this.assignedProvider;
    var buyerId;
    if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
      buyerId = Meteor.userId();
    else if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
      buyerId = Meteor.user().invitedBy;
    Meteor.call('pay30Usd', buyerPays, adminGets, providerGets, assignedProvider, buyerId, this._id, function(error) {
      if(error) {
        $(event.currentTarget).button('reset');
      }
    });
  },
  'click .deny30Usd': function(event, template) {
    $(event.currentTarget).button('loading');
    Meteor.call('deny30Usd', this._id, function(error) {
      $(event.currentTarget).button('reset');
    });
  },
  'submit #reviewProvider': function(event, template) {
    event.preventDefault();
    $('.submitProReview').button('loading');
    var providerId = this.assignedProvider;
    var buyerId = this.userId;
    var jobId = this._id;
    var timeReviewed = new Date();
    var timeAttention = $('input[name="timeAttention"]:checked').val();
    var instructionAttention = $('input[name="instructionAttention"]:checked').val();
    var deliverableAttention = $('input[name="deliverableAttention"]:checked').val();
    var ratedPoints = $('input[name="rateProvider"]:checked').val();
    var reviewMessage = "";
    $('textarea[name="reviewMessage"]').each(function() {
      reviewMessage += $(this).val();
    })
    Meteor.call('reviewProvider', providerId, buyerId, jobId, timeReviewed, timeAttention, instructionAttention, deliverableAttention, ratedPoints, reviewMessage, function(error) {
      if(error) {
        toastr.error('Failed to submit review. Please try again.');
        $('.submitProReview').button('reset');
      }
    })
  },
  'submit #reviewBuyer': function(event, template) {
    event.preventDefault();
    $('.submitBuyerReview').button('loading')
    var providerId = this.assignedProvider;
    var buyerId = this.userId;
    var jobId = this._id;
    var timeReviewed = new Date();
    var experience = $('input[name="jobDesc"]:checked').val();
    var ratedPoints = $('input[name="rateBuyer"]:checked').val();
    var reviewMessage = "";
    $('textarea[name="reviewMessage"]').each(function() {
      reviewMessage += $(this).val();
    })
    Meteor.call('reviewBuyer', providerId, buyerId, jobId, timeReviewed, experience, ratedPoints, reviewMessage, function(error) {
      if(error) {
        toastr.error('Failed to submit review. Please try again.');
        $('.submitBuyerReview').button('reset');
      }
    })
  },
  'submit #budget_increase_form': function(event, template) {
    event.preventDefault();
    $('button.requestIncrease').button('loading');
    var request_object = {};
    var jobDetails = Jobs.findOne({_id: Router.current().params._id});
    var applications = jobDetails.applications;
    var applicationDetails = {};
    for(var i = 0; i < applications.length; i++) {
      if(applications[i].app_status == 'accepted' && applications[i].userId == Meteor.userId()) {
        applicationDetails = applications[i];
        break;
      }
    }
    var reqType = $('select[name="request_type"]').val();
    var requestId;
    if(jobDetails.budgetIncreases && jobDetails.budgetIncreases.length > 0) {
      var lastId = jobDetails.budgetIncreases[jobDetails.budgetIncreases.length - 1].request_id;
      requestId = lastId + 1;
    } else {
      requestId = 1;
    }
    var total_amount = parseFloat($('input[name="total_amount_req"]').val());
    var totalPayable = (function() {
      var payable = {};
      if(applicationDetails.app_type == 'application') {
        if(jobDetails.paidby == 'Provider') {
          if(reqType == 'blended') {
            var nextHours = parseFloat($('#next_hours_req').val());
            var nextMaxHours = parseFloat($('#next_max_hours_req').val());
            var totalAmount = nextHours * nextMaxHours;
            payable = {
              buyerCost: totalAmount,
              providerNets: totalAmount - totalAmount * 5 / 100
            }
          } else {
            payable = {
              buyerCost: total_amount,
              providerNets: total_amount - total_amount*5/100
            }
          }
        } else {
          if(reqType == 'blended') {
            var nextHours = parseFloat($('#next_hours_req').val());
            var nextMaxHours = parseFloat($('#next_max_hours_req').val());
            var totalAmount = nextHours * nextMaxHours;
            payable = {
              buyerCost: totalAmount + totalAmount * 5 / 100,
              providerNets: totalAmount
            }
          } else {
            payable = {
              buyerCost: total_amount + total_amount * 5 / 100,
              providerNets: total_amount
            }
          }
        }
      } else {
        if(reqType == 'blended') {
          var nextHours = parseFloat($('#next_hours_req').val());
          var nextMaxHours = parseFloat($('#next_max_hours_req').val());
          var totalAmount = nextHours * nextMaxHours;
          payable = {
            buyerCost: totalAmount + totalAmount * 5 / 100,
            providerNets: totalAmount
          }
        } else {
          payable = {
            buyerCost: total_amount + total_amount*5/100,
            providerNets: total_amount
          }
        }
      }
      return payable;
    })();
    if(reqType == 'fixed_pay') {
      request_object = {
        request_id: requestId,
        request_type: 'Fixed Pay',
        fixed_amount: $('#fixed_amount_req').val(),
        buyer_cost: totalPayable.buyerCost,
        provider_nets: totalPayable.providerNets,
        total_amount: total_amount,
        timeStamp: new Date(),
        request_status: 'pending'
      }
    }
    else if(reqType == 'per_hour') {
      request_object = {
        request_id: requestId,
        request_type: 'Per Hour',
        hourly_rate: $('#hourly_rate_req').val(),
        max_hours: $('#max_hours_req').val(),
        total_amount: total_amount,
        buyer_cost: totalPayable.buyerCost,
        provider_nets: totalPayable.providerNets,
        timeStamp: new Date(),
        request_status: 'pending'
      }
    }
    else if(reqType == 'per_device') {
      request_object = {
        request_id: requestId,
        request_type: 'Per Device',
        device_rate: $('#device_rate_req').val(),
        max_devices: $('#max_devices_req').val(),
        total_amount: total_amount,
        buyer_cost: totalPayable.buyerCost,
        provider_nets: totalPayable.providerNets,
        timeStamp: new Date(),
        request_status: 'pending'
      }
    }
    else if(reqType == 'blended') {
      request_object = {
        request_id: requestId,
        request_type: 'Blended',
        first_hours: $('#first_hours_req').val(),
        first_max_hours: $('#first_max_hours_req').val(),
        next_hours: $('#next_hours_req').val(),
        next_max_hours: $('#next_max_hours_req').val(),
        total_amount: total_amount,
        buyer_cost: totalPayable.buyerCost,
        provider_nets: totalPayable.providerNets,
        timeStamp: new Date(),
        request_status: 'pending'
      }
    }
    Meteor.call('requestBudgetIncrease', jobDetails._id, request_object, function(error, result) {
      if(error) {
        $('button.requestIncrease').button('reset');
      } else {
        $('button.requestIncrease').button('reset');
      }
    });
  },
  'click .cancelBudgetIncrease': function(event, template) {
    event.preventDefault();
    var requestId = $(event.currentTarget).data('bi-id');
    var jobId = Router.current().params._id;
    Meteor.call('cancelBudgetIncrease', requestId, jobId);
  },
  'click .acceptBudgetIncrease': function(event, template) {
    var buyerId;
    if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
      buyerId = Meteor.userId();
    else if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
      buyerId = Meteor.user().invitedBy;
    var jobId = Router.current().params._id;
    var requestId = $(event.currentTarget).data('bi-id');
    Meteor.call('acceptBudgetIncrease', jobId, buyerId, requestId);
  },
  'click .rejectBudgetIncrease':function(event, template) {
    var jobId = Router.current().params._id;
    var requestId = $(event.currentTarget).data('bi-id');
    Meteor.call('rejectBudgetIncrease', jobId, requestId);
  },
  'submit #extra_expenses': function(event, template) {
    event.preventDefault();
    $('button.requestExpense').button('loading');
    var jobDetails = Jobs.findOne({_id: Router.current().params._id});
    var expense_amount = parseFloat($('input[name="expenseAmount"]').val());
    var expense_description = "";
    $('textarea[name="expenseDescription"]').each(function() {
      expense_description += $(this).val();
    });
    var expenseId;
    if(jobDetails.expenses && jobDetails.expenses.length > 0) {
      var lastId = jobDetails.expenses[jobDetails.expenses.length - 1].expense_id;
      expenseId = lastId + 1;
    } else {
      expenseId = 1;
    }
    var extra_expense_obj = {
      expense_id: expenseId,
      expense_amount: expense_amount,
      buyer_cost: expense_amount + (expense_amount * 5/100),
      expense_description: expense_description,
      timeStamp: new Date(),
      request_status: 'pending'
    }
    Meteor.call('requestExpense', jobDetails._id, extra_expense_obj, function(error, result) {
      if(error) {
        $('button.requestExpense').button('reset');
      } else {
        $('input[name="expenseAmount"]').val('');
        $('textarea[name="expenseDescription"]').val('');
        $('button.requestExpense').button('reset');
      }
    })
  },
  'click a.removeExpense': function(event, template) {
    event.preventDefault();
    var jobId = Router.current().params._id;
    var expense_id = $(event.currentTarget).data('expense-id');
    Meteor.call('removeExpense', jobId, expense_id);
  },
  'click a.approveExpense': function(event, template) {
    event.preventDefault();
    var buyerId;
    if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
      buyerId = Meteor.userId();
    else if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
      buyerId = Meteor.user().invitedBy;
    var jobId = Router.current().params._id;
    var expense_id = $(event.currentTarget).data('expense-id');
    Meteor.call('approveExpense', jobId, buyerId, expense_id);
  },
  'click a.rejectExpense': function(event, template) {
    event.preventDefault();
    var jobId = Router.current().params._id;
    var expense_id = $(event.currentTarget).data('expense-id');
    Meteor.call('rejectExpense', jobId, expense_id);
  },
  'submit #devices-worked': function(event, template) {
    event.preventDefault();
    $('.setDevices').button('loading');
    var jobId = Router.current().params._id;
    var devicesCompleted = $('#worked-devices').val();
    Meteor.call('setWorkedDevices', jobId, devicesCompleted, function(error, result) {
      if(error) {
        toastr.error('Failed to update number of devices worked. Try again.');
        $('.setDevices').button('reset');
      } else {
        $('#devices-worked')[0].reset();
        $('.setDevices').button('reset');
      }
    })
  }
});

Template.job.helpers({
  completedDevices: function(ratePerDevice, maxDevices, devicesCompleted) {
    console.log(ratePerDevice, maxDevices, devicesCompleted);
    if(devicesCompleted == maxDevices) {
      return 'You have completed the assigned devices. You may now submit the job for approval.';
    }
    if(devicesCompleted < maxDevices) {
      return 'You have completed ' + devicesCompleted + ' devices. So you\'ll be paid with ' + devicesCompleted * ratePerDevice + ' USD.';
    }
  },
  expensesRequested: function() {
    var jobDetails = Jobs.findOne({_id: Router.current().params._id});
    if(jobDetails.expenses && jobDetails.expenses.length > 0)
      return true;
    return false;
  },
  timeWorked: function(hourlyrate, maxhours) {
    var total = Session.get('totalHours');
    var timeWorkedMins = total.hours * 60 + total.minutes;
    var jobEstimatedMins = maxhours * 60;
    var providerEarnings = hourlyrate * maxhours;
    var earningsPerMinute = providerEarnings/jobEstimatedMins;
    var workedEarnings = timeWorkedMins * earningsPerMinute;
    var diff;
    if(timeWorkedMins < jobEstimatedMins) {
      diff = jobEstimatedMins - timeWorkedMins;
    }
    if(timeWorkedMins > jobEstimatedMins) {
      diff = timeWorkedMins - jobEstimatedMins;
    }
    var duration = moment.duration(diff, 'minutes')
    var hours = Math.floor(duration.asHours());
    var mins = Math.floor(duration.asMinutes()) - hours * 60;
    var timeWorked = {
      hoursWorked: total.hours,
      minutesWorked: total.minutes,
      hourlyRate: hourlyrate,
      hours: hours,
      minutes: mins,
      workedEarnings: +(Math.round(workedEarnings + 'e+2') + 'e-2')
    }
    if(timeWorkedMins < jobEstimatedMins) {
      if(Roles.userIsInRole(Meteor.userId(), ['provider']))
        return 'You have worked for ' + timeWorked.hoursWorked + ' hours and ' + timeWorked.minutesWorked + ' minutes. So you\'ll be paid with ' + timeWorked.workedEarnings + ' USD. (' + timeWorked.hoursWorked + ' hours and ' + timeWorked.minutesWorked + ' minutes X ' + timeWorked.hourlyRate + ' USD = ' + timeWorked.workedEarnings + ' USD)'
      else if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher']))
        return 'The provider has worked for ' + timeWorked.hoursWorked + ' hours and ' + timeWorked.minutesWorked + ' minutes. So will be paid with ' + timeWorked.workedEarnings + ' USD. (' + timeWorked.hoursWorked + ' hours and ' + timeWorked.minutesWorked + ' minutes X ' + timeWorked.hourlyRate + ' USD = ' + timeWorked.workedEarnings + ' USD)'
    }
    if(timeWorkedMins > jobEstimatedMins) {
      return 'You have worked for ' + timeWorked.hoursWorked + ' hours and ' + timeWorked.minutesWorked + ' minutes. You may request for an increase in budget for ' + timeWorked.hours + ' hours and ' + timeWorked.minutes + ' minutes.'
    }
    if(timeWorkedMins == jobEstimatedMins) {
      return 'You have worked for the estimated time and you may now submit the job for approval.';
    }
  },
  completedDevices: function(devicerate, maxdevices) {
    var jobDetails = Jobs.findOne({_id: Router.current().params._id});
    var completedDevices = jobDetails.devicescompleted;
    if(completedDevices < maxdevices) {
      if(Roles.userIsInRole(Meteor.userId(), ['provider']))
        return 'You have worked on ' + completedDevices + ' devices. So you\'ll be paid with ' + completedDevices * devicerate + ' USD. (' + completedDevices + ' devices X ' + devicerate + ' USD = ' + completedDevices * devicerate + ' USD)';
      else if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher']))
        return 'The provider has worked on ' + completedDevices + ' devices. So will be paid with ' + completedDevices * devicerate + ' USD. (' + completedDevices + ' devices X ' + devicerate + ' USD = ' + completedDevices * devicerate + ' USD)';
    }
    if(completedDevices == maxdevices) {
      return 'You have completed the work on estimated devices and you may now submit the job for approval.';
    }
  },
  blendedTimeWorked: function(payForFirstHours, firstHours, payForNextHours, nextHours) {
    var total = Session.get('totalHours');
    var totalEstimatedMins = firstHours * 60 + nextHours * 60;
    var providerWorkedMins = total.hours * 60 + total.minutes;
    if(providerWorkedMins < firstHours * 60) {
      if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
        return 'You have worked for ' + total.hours + ' hours and ' + total.minutes + ' minutes. So you\'ll be paid with ' + payForFirstHours + ' USD';
      } else if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
        return 'The provider has worked for ' + total.hours + ' hours and ' + total.minutes + ' minutes. So will be paid with ' + payForFirstHours + ' USD';
      }
    }
    if(providerWorkedMins > firstHours * 60 && providerWorkedMins < totalEstimatedMins) {
      var nextMinutesWorked = providerWorkedMins - firstHours * 60;
      var payNextHourMins = payForNextHours / 60;
      var providerEarns = payForFirstHours + nextMinutesWorked * payNextHourMins;
      if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
        return 'You have worked for ' + total.hours + ' hours and ' + total.minutes + ' minutes. So you\'ll be paid with ' + providerEarns + ' USD';
      } else if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
        return 'The provider has worked for ' + total.hours + ' hours and ' + total.minutes + ' minutes. So will be paid with ' + providerEarns + ' USD';
      }
    }
  },
  // buyerFinalCost: function() {
  //   var jobDetails = Jobs.findOne({_id: Router.current().params._id});
  //   var free_nets = jobDetails.projectBudget;
  //   var buyer_nets = free_nets + (free_nets * 5/100);
  //   return buyer_nets;
  // },
  utlCommission: function() {
    var jobDetails = Jobs.findOne({_id: Router.current().params._id});
    var free_nets = jobDetails.projectBudget;
    var buyer_nets = jobDetails.your_cost;
    return +(Math.round((buyer_nets - free_nets) + 'e+2') + 'e-2')
  },
  utlFeesPaidBy: function() {
    var jobDetails = Jobs.findOne({_id: Router.current().params._id});
    var applications = jobDetails.applications;
    var applicationDetails = {};
    for(var i = 0; i < applications.length; i++) {
      if(applications[i].app_status == 'accepted' && applications[i].userId == Meteor.userId()) {
        applicationDetails = applications[i];
        break;
      }
    }
    if(applicationDetails.app_type == 'counteroffer') {
      return 'Buyer'
    } else {
      if(jobDetails.paidby == 'Provider')
        return 'Provider';
      else
        return 'Buyer';
    }
  },
  acceptedExpenses: function() {
    var jobDetails = Jobs.findOne({_id: Router.current().params._id});
    var acceptedExpenses = [];
    if(jobDetails.expenses && jobDetails.expenses.length > 0) {
      for(var i = 0; i < jobDetails.expenses.length; i++) {
        if(jobDetails.expenses[i].request_status == 'accepted')
          acceptedExpenses.push(jobDetails.expenses[i]);
      }
    }
    console.log(acceptedExpenses);
    return acceptedExpenses;
  },
  itypes: function() {
    var itypes = [];
    var industryTypes = Profiles.findOne({userId: Meteor.userId()}).industryTypes;
    for(var i  = 0; i < industryTypes.length; i++) {
      itypes.push({
        encodedType: encodeURIComponent(industryTypes[i]),
        decodedType: industryTypes[i]
      });
    }
    return itypes;
  },
  buyerPaid30Usd: function() {
    console.log(this);
  },
  postedByDispatcher: function() {
    return Roles.userIsInRole(this.userId, ['dispatcher']);
  },
  postedByBuyer: function() {
    return Roles.userIsInRole(this.userId, ['buyer']);
  },
  favCount: function() {
    var userId;
    if(Roles.userIsInRole(Meteor.userId(), ['provider', 'corporate-provider'])) {
      userId = Buyers.findOne({_id: this.id}).userId;
    }
    if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'corporate-manager'])) {
      userId = Profiles.findOne({_id: this.id}).userId;
    }
    return (Users.findOne({_id: userId}).favCount);
  },
  'postedTime': function() {
    return moment(this.createdAt).format('LLLL');
  },
  jobPostedByBuyer: function() {
    return Roles.userIsInRole(this.userId, ['buyer'])? true: false
  },
  jobPostedByDispatcher: function() {
    return Roles.userIsInRole(this.userId, ['dispatcher'])? true: false
  },
  'buyerData': function() {
    var buyerData = Buyers.findOne({userId: this.userId});
    var imgUrl;
    var imgURL = Meteor.users.findOne({_id: buyerData.userId}).imgURL;
    if(imgURL)
      imgUrl = imgURL
    else
      imgUrl = '/images/avatar.png';
    var buyer = {
      id: buyerData._id,
      name: buyerData.firstName + ' ' + buyerData.lastName,
      title: buyerData.title,
      imgUrl: imgUrl,
      readableID: Meteor.users.findOne({_id: buyerData.userId}).readableID,
      status: buyerData.status,
      userId: buyerData.userId
    }
    return buyer;
  },
  dispatcherData: function() {
    var buyerData = Dispatchers.findOne({userId: this.userId});
    var imgUrl;
    var imgURL = Meteor.users.findOne({_id: buyerData.userId}).imgURL;
    if(imgURL)
      imgUrl = imgURL
    else
      imgUrl = '/images/avatar.png';
    var buyer = {
      id: buyerData._id,
      name: buyerData.firstName + ' ' + buyerData.lastName,
      title: buyerData.title,
      imgUrl: imgUrl,
      readableID: Meteor.users.findOne({_id: buyerData.userId}).readableID,
      status: buyerData.status,
      userId: buyerData.userId
    }
    return buyer;
  },
  'hasLabel': function() {
    return this.jobType || this.featured;
  },
  'applicationsCount': function() {
    if(this.applications)
      return this.applications.length;
    return 0;
  },
  'assignedProfile': function() {
    return Profiles.findOne({userId: this.assignedProvider});
  },
  'counterOfferCount': function() {
    var count = 0;
    Jobs.findOne(this._id).counterOffers.forEach(function(uId) {
      count++;
    });
    return count;
  },
  'declinedJob': function() {
    // var applicants = Jobs.findOne({_id: this._id}).applications;
    // for(var i = 0; i < applicants.length; i++) {
    //   if(applicants[i].userId == Meteor.userId() && applicants[i].app_status == 'declined') {
    //     return true;
    //   }
    // }
    // return false;
    return Profiles.findOne({ $and: [{ userId: Meteor.userId() }, { declinedJobs: { $in: [this._id] } }] }) ? true : false;
  },
  'providerDeclined': function() {
    var uId = Profiles.findOne({_id: this.userId}).userId;
    var applicants = Jobs.findOne({_id: Router.current().params._id}).applications;
    for(var i = 0; i < applicants.length; i++) {
      if(applicants[i].userId == uId && applicants[i].app_status == 'declined') {
        return true;
      }
    }
    return false;
  },
  'appliedProviders': function() {
    var providers = [];
    var providerDetails = {};
    var jobDetails = Jobs.findOne(this._id);
    if(jobDetails.applications) {
      jobDetails.applications.forEach(function(provider) {
        var pDetails = Profiles.findOne({userId: provider.userId});
        var imgURL
        var imgUrl = Users.findOne({_id: provider.userId}).imgURL;
        if(imgUrl)
          imgURL = imgUrl;
        providerDetails = {
          imgUrl: imgURL,
          userId: pDetails._id,
          name: pDetails.firstName + ' ' + pDetails.lastName,
          title: pDetails.title,
          company: pDetails.companyName,
          app_type: provider.app_type,
          appliedAt: provider.applied_at,
          counter_type: provider.counterType,
          fixed_amount:provider.fixed_amount,
          hourly_rate: provider.hourly_rate,
          max_hours: provider.max_hours,
          device_rate: provider.device_rate,
          max_devices: provider.max_devices,
          first_hours: provider.first_hours,
          first_max_hours: provider.first_max_hours,
          next_hours: provider.next_hours,
          next_max_hours: provider.next_max_hours,
          buyer_cost: provider.buyer_cost,
          freelancer_nets: provider.freelancer_nets,
          readableId: pDetails.readableID
        }
        providers.push(providerDetails);
      });
    }
    return _.sortBy(providers, function(provider) {return -provider.appliedAt});
  },
  providerLocation: function() {
    return Profiles.findOne({userId: Meteor.userId()}).location;
  },
  'selectedProvider': function() {
    var uId = Profiles.findOne({_id: this.userId}).userId;
    var applicants = Jobs.findOne({_id: Router.current().params._id}).applications;
    for(var i =0; i < applicants.length; i++) {
      if(applicants[i].userId == uId && applicants[i].app_status == 'accepted') {
        return true;
        break;
      }
    }
    return false;
  },
  'applicationStatus': function() {
    return Jobs.findOne({_id: Router.current().params._id}).applicationStatus;
  },
  'jobPostedBuyer': function() {
    var jobDetails = Jobs.findOne(this._id);
    if(jobDetails && jobDetails.userId == Meteor.userId())
      return true;
    return false;
  },
  'assignedProvider': function() {
    if(this.assignedProvider == Meteor.userId()) {
      return true;
    }
    else {
      return false;
    }
  },
  assignedApplicant: function() {
    var providerId = Profiles.findOne({_id: this.userId}).userId;
    var assignedProvider = Jobs.findOne({_id: Router.current().params._id}).assignedProvider;
    if(providerId == assignedProvider)
      return true;
    return false;
  },
  'providerAssigned': function() {
    return this.assignedProvider;
  },
  taskList: function() {
    return Tasks.find({ 'jobID': this._id }, { sort: { order: 1 } });
  },
  applied: function() {
    var applications = Jobs.findOne({_id: this._id}).applications;
    if(applications) {
      for(var i = 0; i < applications.length; i++) {
        if(applications[i].userId == Meteor.userId())
          return true;
      }
    }
    return false;
  },
  applicationDetails: function() {
    for(var i = 0; i < this.applications.length; i++) {
      if(this.applications[i].userId == Meteor.userId()) {
        return this.applications[i];
      }
    }
  },
  states: function(taskID) {
      var staticStates = ['Open', 'On Hold', 'Working', 'Completed'];
      var stateObjArr = [];
      var selectedState = Tasks.findOne({ _id: taskID }).state;
      for (var i = 0; i < staticStates.length; i++) {
          var obj = {};
          if (selectedState == staticStates[i]) {
              obj.value = staticStates[i];
              obj.selected = 'Selected';
          } else {
              obj.value = staticStates[i];
          }
          stateObjArr.push(obj);
      }
      return stateObjArr;
  },
  uploadFile: function(taskID) {
      var taskObj = Tasks.findOne({ _id: taskID });
      if (taskObj && taskObj.taskName.toLowerCase().indexOf('upload') > -1) {
          return true;
      } else
          return false;
  },
  "fileList": function(taskID) {
      return Tasks.findOne({ _id: taskID }).files;
  },
  confirmedOrRejected: function() {
    var jobDetails = Jobs.findOne({_id: this._id});
    if(jobDetails.assignmentStatus == 'confirmed' || jobDetails.assignmentStatus == 'rejected')
      return true;
    return false;
  },
  show: function(jobID,keepSession) {
    if(!keepSession){
      delete Session.keys.totalHours;
    }
    if (Meteor.user() && Meteor.user().roles && Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
      return true;
    }
    return Jobs.findOne({
      $and: [
        { _id: jobID },
        { assignedProvider: Meteor.userId() }
      ]
    }) ? true : false;
  },
  isBuyer: function() {
    if (Meteor.user() && Meteor.user().roles && Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
      return true;
    }
  },
  fileType: function(taskID) {
      var taskObj = Tasks.findOne({ _id: taskID });
      if (taskObj && taskObj.taskName.toLowerCase().indexOf('picture') > -1)
          return "image/*";
      else
          return "*";
  },
  completed: function(taskID) {
      var taskObj = Tasks.findOne({ _id: taskID });
      return taskObj.time?true:false;
  },
  momentjs:function(time) {
    return moment(time).format('LLLL');
  },
  tasksCompleted:function(){
    var flag = Tasks.findOne({$and:[{ 'jobID': this._id},{'taskName':'Check Out'}]}).time;
    return flag?true:false;
  },
  notOpen: function() {
    if(this.applicationStatus == 'frozen' || this.applicationStatus == 'assigned' || this.applicationStatus == 'paid')
      return true;
    return false;
  },
  submittedOrDone: function(jobId) {
    if(jobId) {
      var jobDetails = Jobs.findOne({_id: jobId});
      if(jobDetails.applicationStatus == 'assigned') {
        if(jobDetails.assignmentStatus == 'submitted' || jobDetails.assignmentStatus == 'approved') {
          return true;
        }
        return false;
      }
      if(jobDetails.applicationStatus == 'paid') {
        return true;
      }
    } else {
      if(this.applicationStatus == 'assigned') {
        if(this.assignmentStatus == 'submitted' || this.assignmentStatus == 'approved') {
          return true;
        }
        return false;
      }
      if(this.applicationStatus == 'paid') {
        return true;
      }
    }
    return false;
  },
  assignedOrDone: function() {
    if(this.applicationStatus == 'paid' || (this.applicationStatus == 'assigned' && (this.assignmentStatus == 'confirmed' || this.assignmentStatus == 'submitted' || this.assignmentStatus == 'rejected')))
      return true;
    return false;
  },
  checkInTime: function(){
    var date = TimeSheet.findOne({'jobID':this._id}).checkIn;
    if(!date) return '';
    return moment(date).format('MM/DD/YYYY h:mm A');
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
      // var hours = Math.floor(duration.asHours()) - days * 24;
      var hours = Math.floor(duration.asHours());
      // var hrs = days*24+hours;
      // var mins = Math.floor(duration.asMinutes()) - hrs * 60;
      var mins = Math.floor(duration.asMinutes()) - hours * 60;
      var total = "Hours : "+hours+", Mins : "+mins;
      obj.total = total;
      totalHours+=diff;
      logList.push(obj);
    });

    var duration = moment.duration(totalHours,'milliseconds');
    var days = Math.floor(duration.asDays());
    // var hours = Math.floor(duration.asHours()) - days * 24;
    var hours = Math.floor(duration.asHours());
    var hrs = days*24+hours;
    // var mins = Math.floor(duration.asMinutes()) - hrs * 60;
    var mins = Math.floor(duration.asMinutes()) - hours * 60;
    // var total = hours + " hours and " + mins + " minutes";
    var total = {
      hours: hours,
      minutes: mins
    }
    if(duration==0) {
      Session.set('totalHours','No activities are done so far');
    } else {
      Session.set('totalHours',total);
    }
    return logList;
  },
  totalHours: function(){
    return Session.get('totalHours');
  },
  "uploadedFiles": function(){
      return S3.collection.find();
  },
  'acceptedProvider': function() {
    var uId = Meteor.userId();
    var jobs=Jobs.findOne({_id: this._id}).applications;
    for(var i=0;i<jobs.length;i++){
      if(jobs[i].userId == uId && jobs[i].app_status == 'accepted') {
        return true;
      }
    }
    return false;
  },
  aHelper: function() {
    console.log(this);
  },
  routedProvider: function() {
    return Profiles.findOne({userId: this.selectedProvider});
  },
  appStatusLabel: function() {
    if(this.status == 'deactivated')
      return 'label-deactivated'
    if(this.applicationStatus == 'assigned')
      return 'label-assigned';
    else if(this.applicationStatus == 'completed')
      return 'label-completed';
    else if(this.applicationStatus == 'frozen')
      return 'label-frozen';
    else if(this.applicationStatus == 'open')
      return 'label-open';
    else if(this.applicationStatus == 'pending_payment')
      return 'label-pending';
    else if(this.applicationStatus == 'paid')
      return 'label-paid';
  },
  showTabs: function(id) {
      if(Jobs.findOne({_id: id}).userId == Meteor.userId())
        return true;
      return Jobs.findOne({$and: [{ _id: id },{ applicationStatus: {$in:['assigned', 'completed', 'pending_payment','paid']}}]}) ? true : false;
  },
  jobNotAssigned: function() {
    if(this.applicationStatus == 'open' && this.status == 'active') {
      return true;
    }
    return false;
  },
  paymentDetails: function() {
    var jobDetails = Jobs.findOne({_id: Router.current().params._id});
    return jobDetails;
  },
  assignedProviderDetails: function() {
    var applicationDetails = {};
    for(var i = 0; i < this.applications.length; i++) {
      if(this.applications[i].userId == this.assignedProvider && this.applications[i].app_status == 'accepted') {
        if(this.applications[i].app_type == 'application') {
          applicationDetails = {
            appType: this.applications[i].app_type,
            appliedAt: this.applications[i].applied_at
          }
        }
        if(this.applications[i].app_type == 'counteroffer') {
          applicationDetails = {
            appType: this.applications[i].app_type,
            appliedAt: this.applications[i].applied_at,
            counter_type: this.applications[i].counterType,
            fixed_amount:this.applications[i].fixed_amount,
            hourly_rate: this.applications[i].hourly_rate,
            max_hours: this.applications[i].max_hours,
            device_rate: this.applications[i].device_rate,
            max_devices: this.applications[i].max_devices,
            first_hours: this.applications[i].first_hours,
            first_max_hours: this.applications[i].first_max_hours,
            next_hours: this.applications[i].next_hours,
            next_max_hours: this.applications[i].next_max_hours,
            buyer_cost: this.applications[i].buyer_cost,
            freelancer_nets: this.applications[i].freelancer_nets,
          }
        }
      }
    }
    var provider = Profiles.findOne({userId: this.assignedProvider});
    var providerImg = Users.findOne({_id: this.assignedProvider}).imgURL;
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
        paymentType: this.ratebasis,
        gross: this.your_cost,
        freelancer_nets: this.freelancer_nets
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
        paymentType: this.ratebasis,
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
    Session.set('acceptedApplication', providerDetails);
    return providerDetails;
  },
  jobAssignedToProvider: function() {
    if(this.applicationStatus == 'assigned' || this.applicationStatus == 'completed' || this.applicationStatus == 'pending_payment' || this.applicationStatus == 'paid')
      return true;
    return false;
  },
  buyerOrAssignedProvider: function() {
    if(this.userId == Meteor.userId() || this.assignedProvider == Meteor.userId()) {
      return true;
    }
    return false;
  },
  jobRelatedNotifications: function() {
    var notifications = Notifications.find({jobId: this._id}, {sort: {timeStamp: -1}});
    var notificationDetails = [];
    notifications.forEach(function(notification) {
      var buyerId = notification.buyerId;
      var buyerDetails;
      if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
        buyerDetails = Dispatchers.findOne({userId: buyerId});
      } else {
        buyerDetails = Buyers.findOne({userId: buyerId});
      }
      if(notification.notificationType == 'jobDeactivated') {
        var notif = {
          jobId: notification.jobId,
          buyerId: buyerDetails._id,
          buyerName: buyerDetails.firstName + ' ' + buyerDetails.lastName,
          notificationType: notification.notificationType,
          timeStamp: moment(notification.timeStamp).format('LLLL')
        }
      }
      if(notification.notificationType == 'newJob') {
        var notif = {
          jobId: notification.jobId,
          buyerId: buyerDetails._id,
          buyerName: buyerDetails.firstName + ' ' + buyerDetails.lastName,
          notificationType: notification.notificationType,
          timeStamp: moment(notification.timeStamp).format('LLLL')
        }
      } else {
        if(notification.providerId) {
          var providerDetails = Profiles.findOne({userId: notification.providerId});
          var notif = {
            jobId: notification.jobId,
            buyerId: buyerDetails._id,
            buyerName: buyerDetails.firstName + ' ' + buyerDetails.lastName,
            providerId: providerDetails._id,
            providerName: providerDetails.firstName + ' ' + providerDetails.lastName,
            notificationType: notification.notificationType,
            timeStamp: moment(notification.timeStamp).format('LLLL')
          }
        }
      }
      notificationDetails.push(notif);
    });
    return notificationDetails;
  },
  deactivatedTime: function() {
    return moment(Notifications.findOne({$and: [{jobId: this._id}, {notificationType: 'jobDeactivated'}]}).timeStamp).format('LLLL');
  },
  thisProvider: function() {
    var providerId = Profiles.findOne({_id: this.providerId}).userId;
    if(providerId == Meteor.userId())
      return true;
    return false;
  },
  openOrFrozen: function() {
    if(this.applicationStatus == 'open' || (this.applicationStatus == 'assigned' && this.assignmentStatus == 'not_confirmed'))
      return true;
    return false;
  },
  invoiceId: function() {
    Meteor.subscribe('jobInvoice', this._id);
    var invoiceDetails = Invoices.findOne({jobId: this._id});
    if(invoiceDetails)
      return invoiceDetails.invoiceId;
    return;
  },
  openFrozenOrAssigned: function() {
    if(this.applicationStatus == 'open' || this.applicationStatus == 'frozen' || this.applicationStatus == 'assigned')
      return true;
    return false;
  },
  reviewedProvider: function() {
    return Reviews.findOne({$and: [{reviewedJobId: this._id}, {buyerId: Meteor.userId()}, {reviewedBy: 'buyer'}]})? true : false;
  },
  reviewedBuyer: function() {
    return Reviews.findOne({$and: [{reviewedJobId: this._id}, {providerId: Meteor.userId()}, {reviewedBy: 'provider'}]})? true: false;
  },
  applicationTime: function() {
    var applications = Jobs.findOne(this._id).applications;
    if(applications) {
      for(var i = 0; i < applications.length; i++) {
        if(applications[i].userId == Meteor.userId()) {
          return moment(applications[i].applied_at).format('LLLL');
        }
      }
    }
  },
  applicationAcceptedTime: function() {
    var acceptedTime = Notifications.findOne({$and: [{jobId: this._id}, {providerId: Meteor.userId()}, {notificationType: 'applicationAccepted'}]}).timeStamp;
    return moment(acceptedTime).format('LLLL');
  },
  assignmentTime: function() {
    var assignedTime;
    if(Roles.userIsInRole(Meteor.userId(), ['provider', 'corporate-provider'])) {
      assignedTime = Notifications.findOne({$and: [{jobId: this._id}, {providerId: Meteor.userId()}, {notificationType: 'confirmAssignment'}]}).timeStamp;
    }
    if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'corporate-manager'])) {
      assignedTime = Notifications.findOne({$and: [{jobId: this._id}, {buyerId: Meteor.userId()}, {notificationType: 'confirmAssignment'}]}).timeStamp;
    }
    return moment(assignedTime).format('LLLL');
  },
  submittedTime: function() {
    var submittedArray = Notifications.find({$and: [{jobId: this._id}, {notificationType: 'submitAssignment'}]}).fetch();
    var submittedTime;
    if(submittedArray.length == 1) {
      submittedTime = submittedArray[0].timeStamp;
    } else {
      for(var i = 0; i < submittedArray.length - 1; i++) {
        for (var j = i + 1; j < submittedArray.length; j++) {
          if(submittedArray[j].timeStamp > submittedArray[i].timeStamp)
            submittedTime = submittedArray[j].timeStamp;
        }
      }
    }
    return moment(submittedTime).format('LLLL');
  },
  rejectedTime: function() {
    var rejectedArray = Notifications.find({$and: [{jobId: this._id}, {notificationType: 'rejectAssignment'}]}).fetch();
    var rejectedTime;
    if(rejectedArray.length == 1) {
      rejectedTime = rejectedArray[0].timeStamp;
    } else {
      for(var i = 0; i < rejectedArray.length - 1; i++) {
        for(var j = i + 1; j < rejectedArray.length; j++) {
          if(rejectedArray[j].timeStamp > rejectedArray[i].timeStamp)
            rejectedTime = rejectedArray[j].timeStamp;
        }
      }
    }
    return moment(rejectedTime).format('LLLL');
  },
  approvedTime: function() {
    var approvedTime = Notifications.findOne({$and: [{jobId: this._id}, {notificationType: 'approveAssignment'}]}).timeStamp;
    return moment(approvedTime).format('LLLL');
  },
  paymentRequestTime: function() {
    var paymentRequestTime = Notifications.findOne({$and: [{jobId: this._id}, {notificationType: 'requestPayment'}]}).timeStamp;
    return moment(paymentRequestTime).format('LLLL');
  },
  approvePaymentTime: function() {
    var approvePaymentTime = Notifications.findOne({$and: [{jobId: this._id}, {notificationType: 'approvePayment'}]}).timeStamp;
    return moment(approvePaymentTime).format('LLLL');
  },
  fav : function() {
    var userId;
    if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'corporate-manager'])) {
      userId = Profiles.findOne({_id: this.id}).userId;
    }
    if(Roles.userIsInRole(Meteor.userId(), ['provider', 'corporate-provider'])) {
      userId = Buyers.findOne({_id: this.id}).userId;
    }
    return Meteor.users.findOne({$and:[{_id:Meteor.userId()},{favoriteUsers: {$in: [userId]}}]})?true:false;
  },
  buyerReviewDetails: function() {
    return Reviews.findOne({$and: [{reviewedJobId: this._id}, {providerId: Meteor.userId()}, {reviewedBy: 'provider'}]});
  },
  providerReviewDetails: function() {
    return Reviews.findOne({$and: [{reviewedJobId: this._id}, {buyerId: Meteor.userId()}, {reviewedBy: 'buyer'}]});
  },
  tasksTSCompleted: function() {
    var jobId = this._id;
    var jobDetails = Jobs.findOne({_id: jobId});
    var acceptedApplication = {};
    for(var i = 0; i < jobDetails.applications.length; i++) {
      if(jobDetails.applications[i].app_status == 'accepted') {
        acceptedApplication = jobDetails.applications[i];
        break;
      }
    }
    var tasksClosed = Tasks.find({$and:[{jobID:jobId},{state:{$ne:'Completed'}}]}).count();
    if(tasksClosed) {
      return false;
    }
    var timeSheetsLogs = TimeSheet.findOne({jobID: jobId});
    if(!timeSheetsLogs.logs) {
      return false
    }
    if(timeSheetsLogs.logs) {
      if(timeSheetsLogs.logs.length <= 0) {
        return false;
      }
    }
    if(acceptedApplication.app_type == 'application') {
      if(jobDetails.ratebasis == 'Per Device') {
        console.log(jobDetails)
        if(!jobDetails.devicescompleted || jobDetails.devicescompleted < 1) {
          return false;
        }
      }
    }
    if(acceptedApplication.app_type == 'counteroffer') {
      if(acceptedApplication.counterType == 'per_device') {
        if(!jobDetails.devicescompleted || jobDetails.devicescompleted < 1) {
          return false;
        }
      }
    }
    return true;
  },
  distance: function() {
    var jobDetails = Jobs.findOne({_id: this._id});
    if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
      var providerDetails = Profiles.findOne({userId: Meteor.userId()});
      return distance(providerDetails.fullLocation.latitude, providerDetails.fullLocation.longitude, jobDetails.fullLocation.latitude, jobDetails.fullLocation.longitude);
    }
    return;
  },
  bonusRequested: function() {
    var bonusDetails = Jobs.findOne({_id: Router.current().params._id}).budgetIncreases;
    if(bonusDetails && bonusDetails.length > 0)
      return true;
    return false;
  }
});

var distance = function(plat, plng, jlat, jlng) {
  var R = 3959;
  var dLon = (plng - jlng) * Math.PI/180;
  var dLat = (plat - jlat) * Math.PI/180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(plat * Math.PI / 180 ) * Math.cos(jlat * Math.PI / 180 ) * Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return Math.round(d) + ' miles';
}

Template.job.rendered = function() {
  this.ratingPoints = new ReactiveVar(null);
  var providerRatingPoints = 0;
  var providerReviews = Reviews.find({$and: [{providerId: this.data.assignedProvider}, {reviewedBy: 'buyer'}]}).fetch();
  if(providerReviews) {
  	for(var i = 0; i < providerReviews.length; i++) {
  		providerRatingPoints += providerReviews[i].pointsRated;
  	}
  }
	var providerReviewPoints = providerRatingPoints/providerReviews.length;
	this.$('.providerRatings').rateit({'readonly': true, value: providerReviewPoints});
  var buyerRatingPoints = 0;
  var buyerReviews = Reviews.find({$and: [{buyerId: this.data.userId}, {reviewedBy: 'provider'}]}).fetch();
  if(buyerReviews) {
      for(var i = 0; i < buyerReviews.length; i++) {
          buyerRatingPoints += buyerReviews[i].pointsRated;
      }
  }
  var buyerReviewPoints = buyerRatingPoints/buyerReviews.length;
  this.$('.buyerRatings').rateit({'readonly': true, value: buyerReviewPoints});
  this.$('.rateit').rateit();
  this.ratingPoints = new ReactiveVar(null);
  $('#spinner').hide();
  var id = $('.check-in-toggle').data('id');
  var displayTime = TimeSheet.findOne({'jobID':id});
  if(displayTime) {
    displayTime = displayTime.checkIn;
  } else {
    $('.check-in-toggle').prop("checked", true);
    $('.show-checkin-time').hide();
    return;
  }
  if(displayTime=='') {
    $('.check-in-toggle').prop("checked", true);
    $('.show-checkin-time').hide();
  }
  else {
    $('.check-in-toggle').prop("checked", false);
    $('.show-checkin-time').show();
  }
};

Template.job.onRendered(function() {
  this.$('.rateit').rateit();
})