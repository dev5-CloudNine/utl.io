Template.job.events({
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
    var userId = Profiles.findOne({_id: this.userId}).userId;
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
  'click .acceptCounterOffer': function(event, template) {
    var jobId = Router.current().params._id;
    var userId = Profiles.findOne({_id: this.userId}).userId;
    var applied_at = this.appliedAt;
    var freenets = this.freelancer_nets;
    Meteor.call('acceptCounterOffer', jobId, userId, applied_at, freenets, function(error) {
      if(error) {
        toastr.error('Failed to accept counter offer.');
      }
      else {
        toastr.success('An invitation has been sent to the provider to confirm assignment.');
      }
    })
  },
  'click .counterInactive': function(event, template) {
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
        toastr.error(error.message, 'Error');
      }
      else {
        $(event.currentTarget).removeClass('counterInactive');
        $(event.currentTarget).addClass('counterActive');
      }
    });
  },
  'click .counterActive': function(event, template) {
    event.preventDefault();
    var jobId = this._id;
    Meteor.call('removeFromAppliedJobs', jobId, Meteor.userId(), function(error) {
      if(error) {
        toastr.error(error.message, 'Error');
      }
      else {
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
     } else {
       toastr.success('Task has been updated');
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
            Meteor.call('addFile', res.url, id,function (error, result) {
              if(!error)
                toastr.success("File uploaded successssfully");
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
                if(!error)
                  toastr.success("Deleted");
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
    var buyerId = this.userId;
    var jobId = this._id;
    Meteor.call('confirmAssignment', jobId, buyerId, function(error) {
      if(error) {
        toastr.error('Failed to confirm assignment.');
      }
      else {
        toastr.success('The assignment has been confirmed.');
      }
    })
  },
  'click button.declineAssignment': function(event, template) {
    var jobId = this._id;
    var userId = Meteor.userId();
    Meteor.call('declineAssignment', jobId, userId, function(error) {
      if(error) {
        toastr.error('Failed to decline the assignment.');
      } else {
        toastr.success('Successfully declined the assignment.');
      }
    });
  },
  'click button.submitAssignment': function(event, template) {
    event.preventDefault();
    var jobId = this._id;
    //check for task status
    var tasksClosed = Tasks.find({$and:[{jobID:jobId},{state:{$ne:'Completed'}}]}).count();
    if(tasksClosed) {
      toastr.error('Please close all the tasks before submitting the assignment');
      return;
    }
    Meteor.call('submitAssignment', jobId, function(error) {
      if(error) {
        toastr.error('Failed to submit assignment. Please try again.');
      } else {
        toastr.success('Successfully submitted the assignment.');
      }
    });
  },
  'click button.approveAssignment': function(event, template) {
    event.preventDefault();
    var jobId = this._id;
    var providerId = this.assignedProvider;
    console.log(providerId);
    Meteor.call('approveAssignment', jobId, providerId, function(error) {
      if(error) {
        toastr.error('Failed to approve assignment. Please try again.');
      } else {
        toastr.success('Approved assignment Successfully');
      }
    });
  },
  'click button.rejectAssignment': function(event, template) {
    var jobId = this._id;
    Meteor.call('rejectAssignment', jobId, function(error) {
      if(error) {
        toastr.error('Failed to reject assignment. Please try again.');
      } else {
        toastr.success('Rejected assignment successfully');
      }
    });
  },
  'click button.requestPayment': function(event, template) {
    var jobId = this._id;
    Meteor.call('requestPayment', jobId, function(error) {
      if(error) {
        toastr.error('Failed to request paymet. Pleast try again.');
      } else {
        toastr.success('Payment requested successfully.');
      }
    })
  },
  'click button.approvePayment': function(event, template) {
    var jobId = this._id;
    Meteor.call('approvePayment', jobId, function(error) {
      if(error) {
        toastr.error('Failed to approve payment. Please try again.');
      } else {
        toastr.success('Payment approved successfully.');
      }
    })
  }
});

Template.job.helpers({
  'postedTime': function() {
    return moment(this.createdAt).fromNow();
  },
  'buyerData': function() {
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
  'declined': function() {
    var applicants = Jobs.findOne({_id: this._id}).applications;
    for(var i = 0; i < applicants.length; i++) {
      if(applicants[i].userId == Meteor.userId() && applicants[i].app_status == 'declined') {
        return true;
      }
    }
    return false;
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
    jobDetails.applications.forEach(function(provider) {
      var pDetails = Profiles.findOne({userId: provider.userId});
      providerDetails = {
        userId: pDetails._id,
        name: pDetails.name,
        title: pDetails.title,
        company: pDetails.companyName,
        app_type: provider.app_type,
        appliedAt: moment(provider.applied_at).fromNow(),
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
        freelancer_nets: provider.freelancer_nets,
      }
      providers.push(providerDetails);
    });
    return _.sortBy(providers, function(provider) {return -provider.appliedAt});
  },
  'selectedProvider': function() {
    var uId = Profiles.findOne({_id: this.userId}).userId;
    var applicants = Jobs.findOne({_id: Router.current().params._id}).applications;
    for(var i =0; i < applicants.length; i++) {
      if(applicants[i].userId == uId && applicants[i].app_status == 'accepted') {
        return true;
      }
    }
    return false;
  },
  'applicationStatus': function() {
    return Jobs.findOne({_id: Router.current().params._id}).applicationStatus;
  },
  'jobPostedBuyer': function() {
    var jobDetails = Jobs.findOne(this._id);
    if(jobDetails.userId == Meteor.userId())
      return true;
    else
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
  'providerAssigned': function() {
    return this.assignedProvider;
  },
  taskList: function() {
        return Tasks.find({ 'jobID': this._id }, { sort: { order: 1 } });
    },
    applied: function() {
        return Profiles.findOne({ $and: [{ userId: Meteor.userId() }, { appliedJobs: { $in: [this._id] } }] }) ? true : false;
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

    show: function(jobID,keepSession) {
        if(!keepSession){
          delete Session.keys.totalHours;
        }
        
        if (Meteor.user() &&
            Meteor.user().roles &&
            (Meteor.user().roles.indexOf("buyer")) != -1) {
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
        if (Meteor.user() &&
            Meteor.user().roles &&
            (Meteor.user().roles.indexOf("buyer")) != -1) {
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
      if(this.applicationStatus == 'frozen' || this.applicationStatus == 'assigned' || this.applicationStatus == 'done')
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
        var hours = Math.floor(duration.asHours()) - days * 24;
        var hrs = days*24+hours;
        var mins = Math.floor(duration.asMinutes()) - hrs * 60;
        var total = "Days : " + days+", Hours : "+hours+", Mins : "+mins;
        obj.total = total;
        totalHours+=diff;
        logList.push(obj);
      });

      var duration = moment.duration(totalHours,'milliseconds');
      var days = Math.floor(duration.asDays());
      var hours = Math.floor(duration.asHours()) - days * 24;
      var hrs = days*24+hours;
      var mins = Math.floor(duration.asMinutes()) - hrs * 60;
      var total = "Days : " + days+", Hours : "+hours+", Mins : "+mins;
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
    routedProvider: function() {
      return Profiles.findOne({userId: this.selectedProvider});
    },
    appStatusLabel: function() {
      if(this.applicationStatus == 'assigned') 
        return 'label-assigned';
      else if(this.applicationStatus == 'frozen')
        return 'label-frozen';
      else if(this.applicationStatus == 'open')
        return 'label-open';
      else if(this.applicationStatus == 'done')
        return 'label-done';
    },
    showTabs: function(id) {
        return Jobs.findOne({$and: [{ _id: id },{ applicationStatus: {$in:['assigned','submitted','approved','rejected']}}]}) ? true : false;      
    }
});

Template.job.rendered = function() {
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
