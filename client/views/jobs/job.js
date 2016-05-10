Template.job.events({
    'click #job-deactivate': function(event, template) {
        event.preventDefault();
        Modal.show('jobDeactivate', template.data);
    },
    'change input[name="app_type"]': function(event, template) {
        if (event.target.value == 'application') {
            $('div#app_selected').show();
            $('div#counter_selected').hide();
        } else if (event.target.value == 'counteroffer') {
            $('div#counter_selected').show();
            $('div#app_selected').hide();
        }
    },
    'click .applyInactive': function(event, template) {
        event.preventDefault();
        var jobId = this._id;
        var uId = Profiles.findOne({ userId: Meteor.userId() })._id
        var applicationDetails = {
            "userId": Meteor.userId(),
            "applied_at": new Date(),
            "app_type": 'application'
        }
        Meteor.call('applyForThisJob', jobId, applicationDetails, function(error) {
            if (error) {
                toastr.error(error.message, 'Error');
            } else {
                $(event.currentTarget).removeClass('applyInactive');
                $(event.currentTarget).addClass('applyActive');
            }
        })
    },
    'click .applyActive': function(event, template) {
        event.preventDefault();
        var jobId = this._id;
        Meteor.call('removeFromAppliedJobs', jobId, Meteor.userId(), function(error) {
            if (error) {
                toastr.error(error.message, 'Error');
            } else {
                $(event.currentTarget).removeClass('applyActive');
                $(event.currentTarget).addClass('applyInactive');
            }
        })
    },
    'change #counter_type': function(event, template) {
        event.preventDefault();
        var counterType = $('#counter_type').val();
        if (counterType == 'fixed_pay') {
            $('#fixed-pay-counter').show();
        } else {
            $('#fixed-pay-counter').hide();
        }
        if (counterType == 'per_hour') {
            $('#hourly-counter').show();
        } else {
            $('#hourly-counter').hide();
        }
        if (counterType == 'per_device') {
            $('#per-device-counter').show();
        } else {
            $('#per-device-counter').hide();
        }
        if (counterType == 'blended') {
            $('#blended-counter').show();
        } else {
            $('#blended-counter').hide();
        }
    },
    //fixed rate 
    'change #fixed_amount, keyup #fixed_amount': function(event, template) {
        event.preventDefault();
        var fixedamount = $('#fixed_amount').val();
        $('input[name="total_amount"]').val(fixedamount);
        $('input[name="buyer_cost"]').val(fixedamount);
        var freenet = fixedamount - (fixedamount * 5 / 100);
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
        var freenet = totalamount - (totalamount * 5 / 100);
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
        var freenet = totalamount - (totalamount * 5 / 100);
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
        var freenet = totalamount - (totalamount * 5 / 100);
        $('input[name="freelancer_nets"]').val(freenet);
    },
    'change input[value="provider"]': function(event, template) {
        event.preventDefault();
        var totalamount = parseFloat($('input[name="total_amount"]').val());
        $('input[name="buyer_cost"]').val(totalamount);
        var freenet = totalamount - totalamount * 5 / 100;
        $('input[name="freelancer_nets"]').val(freenet);
    },
    'change input[value="buyer"]': function(event, template) {
        event.preventDefault();
        var totalamount = parseFloat($('input[name="total_amount"]').val());
        var clientCost = totalamount + totalamount * 5 / 100;
        $('input[name="buyer_cost"]').val(clientCost);
        $('input[name="freelancer_nets"]').val(totalamount);
    },
    'click .acceptApplication': function(event, template) {
        event.preventDefault();
        var jobId = Router.current().params._id;
        var userId = Profiles.findOne({ _id: this.userId }).userId;
        var applicationTime = this.appliedAt;
        Meteor.call('acceptApplication', jobId, userId, applicationTime, function(error, result) {
            if (error) {
                toastr.error("Failed to accept the application");
            } else {
                toastr.success("An invitation has been sent to the provider to confirm assigmnemt.");
            }
        });
    },
    'click .acceptCounterOffer': function(event, template) {
        var jobId = Router.current().params._id;
        var userId = Profiles.findOne({ _id: this.userId }).userId;
        var applied_at = this.appliedAt;
        var freenets = this.freelancer_nets;
        Meteor.call('acceptCounterOffer', jobId, userId, applied_at, freenets, function(error) {
            if (error) {
                toastr.error('Failed to accept counter offer.');
            } else {
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
        if (counterType == "fixed_pay") {
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
        } else if (counterType == "per_hour") {
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
        } else if (counterType == "per_device") {
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
        } else if (counterType == "blended") {
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
        Meteor.call('applyForThisJob', jobId, counterOffer, function(error) {
            if (error) {
                toastr.error(error.message, 'Error');
            } else {
                $(event.currentTarget).find('i').html('Apply\'d')
                $(event.currentTarget).removeClass('counterInactive');
                $(event.currentTarget).addClass('counterActive');
            }
        });
    },
    'click .counterActive': function(event, template) {
        event.preventDefault();
        var jobId = this._id;
        Meteor.call('removeFromAppliedJobs', jobId, Meteor.userId(), function(error) {
            if (error) {
                toastr.error(error.message, 'Error');
            } else {
                $(event.currentTarget).find('i').html('Apply');
                $(event.currentTarget).removeClass('counterActive');
                $(event.currentTarget).addClass('counterInactive');
            }
        })
    },
    'click button[type=submit]': function(event, template) {
        event.preventDefault();
        var id = $(event.currentTarget).parent().parent().parent().parent().find('.task-form').data('id');
        var action = checkSequence(id);
        if(action) {
          toastr.warning(action);
          return;
        } 

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
        $('#spinner').show();
        var files = $(event.currentTarget)[0].files

        if (!files) return;
        var id = this._id;
        console.log(files);
        S3.upload({
            files: files,
            path: S3_FILEUPLOADS
        }, function(err, res) {
            $('#spinner').hide();
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
      console.log(url);
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
    "click button.timer-btn": function(event){
      event.preventDefault();
      var id = $(event.currentTarget).data('id');        
      var action = checkSequence(id);
      if(action) {
        toastr.warning(action);
        return;
      } 
      Meteor.call('recordTime', id, function (error, result) {});
    }

});

function checkSequence(id) {
  var task = Tasks.findOne({ '_id': id });
  if(task.taskName=="Check In") {
    return false;
  } else if(task.taskName=="Check Out") {
    var flag = Tasks.findOne({$and:[{ 'jobID': task.jobID},{'taskName':'Check In'}]}).time;
    if(!flag) return "Start by Cheking In. Checkout once all the tasks are completed";
    flag = Tasks.findOne({$and:[{ 'jobID': task.jobID },{state:{$ne:'Completed'}},{taskName:{$nin:['Check In','Check Out']}}]});
    if(flag) return "Complete all the tasks before Checking out";
  } else {
    var flag = Tasks.findOne({$and:[{ 'jobID': task.jobID},{'taskName':'Check In'}]}).time;
    if(!flag) return "Please Check In before completing other tasks";
    var flag = Tasks.findOne({$and:[{ 'jobID': task.jobID },{'taskName':'Check Out'}]}).time;
    if(flag) return "Check out has been made for this project. Any opetation on other tasks are considered invalid";
  }
  return false;
}

Template.job.rendered = function() {
      $('#spinner').hide();
};

Template.job.helpers({
    'buyerData': function() {
        return Buyers.findOne({ userId: this.userId });
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
    assignedProfile: function() {
        console.log(this);
        return Profiles.findOne({ userId: this.assignedProvider });
    },
    'counterOfferCount': function() {
        var count = 0;
        Jobs.findOne(this._id).counterOffers.forEach(function(uId) {
            count++;
        });
        return count;
    },
    'appliedProviders': function() {
        var providers = [];
        var providerDetails = {};
        var jobDetails = Jobs.findOne(this._id);
        jobDetails.applications.forEach(function(provider) {
            var pDetails = Profiles.findOne({ userId: provider.userId });
            providerDetails = {
                userId: pDetails._id,
                name: pDetails.name,
                title: pDetails.title,
                company: pDetails.companyName,
                app_type: provider.app_type,
                appliedAt: provider.applied_at,
                counter_type: provider.counterType,
                fixed_amount: provider.fixed_amount,
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
        return providers;
    },
    // 'selectedProvider': function() {
    //   Jobs.findOne(this._id).applications.forEach(function(application) {
    //     if(application.app_status == 'accepted') {
    //       return true;
    //     }
    //     else return false;
    //   })
    // },
    'applicationStatus': function() {
        return Jobs.findOne({ _id: Router.current().params._id }).applicationStatus;
    },
    'jobPostedBuyer': function() {
        var jobDetails = Jobs.findOne(this._id);
        if (jobDetails.userId == Meteor.userId())
            return true;
        else
            return false;
    },
    'assignedProvider': function() {
        if (this.assignedProvider == Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    },
    // notAccepted : function() {
    //   return Jobs.findOne({$and:[{_id:this._id},{applicationStatus:{$nin:["assigned"]}}]})?true:false;
    // },
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

    show: function(jobID) {
        if (Meteor.user() &&
            Meteor.user().roles &&
            (Meteor.user().roles.indexOf("buyer")) != -1) {
            return true;
        }
        return Jobs.findOne({
            $and: [
                { _id: jobID },
                { applicationStatus: "assigned" },
                { applications: { $elemMatch: { app_status: 'accepted' } } },
                { applications: { $elemMatch: { userId: Meteor.userId() } } }
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
    checkinout: function(taskID) {
        var taskObj = Tasks.findOne({ _id: taskID });
        if (taskObj && taskObj.taskName.toLowerCase().indexOf('check') > -1)
            return true;
        else
            return false;
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
    }
});
