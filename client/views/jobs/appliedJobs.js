// Template.appliedJobs.onCreated(function() {
//     var instance = this;
//     instance.loaded = new ReactiveVar(0);
//     instance.limit = new ReactiveVar(10);
// });

// Template.appliedJobs.helpers({
// 	appliedJobs: function() {
// 		var appliedJobIds = Profiles.findOne({userId: Meteor.userId()}).appliedJobs;
//         var appliedJobs = [];
//         if(appliedJobIds) {
//             for(var i = appliedJobIds.length - 1; i>=appliedJobIds.length - Template.instance().limit.get(); i-- ) {
//                 if(i<0)
//                     break;
//                 appliedJobs.push(Jobs.findOne({_id: appliedJobIds[i]}));
//             }
//         }
//         return appliedJobs;
// 	},
//     hasMoreJobs: function() {
//     	var appliedJobIds = Profiles.findOne({userId: Meteor.userId()}).appliedJobs;
//     	if(appliedJobIds)
//     		appliedJobsLength = appliedJobIds.length;
//     	else
//     		appliedJobsLength = 0;
//         return Template.instance().limit.get() < appliedJobsLength;
//     }
// })

// Template.appliedJobs.events({
//     'click .load-more': function(event, instance) {
//         event.preventDefault();
//         var limit = instance.limit.get();
//         limit += 10;
//         instance.limit.set(limit);
//     }
// })

// Template.invitedJobs.onCreated(function() {
//     var instance = this;
//     instance.loaded = new ReactiveVar(0);
//     instance.limit = new ReactiveVar(10);
//     instance.jobs = function() {
//         var invJobIds = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
//      var invitedJobs = [];
//      if(invJobIds) {
//          for(var i = invJobIds.length - 1; i>=invJobIds.length - instance.limit.get(); i-- ) {
//              if(i<0)
//                  break;
//              invitedJobs.push(Jobs.findOne({_id: invJobIds[i]}));
//          }
//      }
//      return invitedJobs;
//     }
// });

// Template.invitedJobs.helpers({
//  invitedJobs: function () {
//      return Template.instance().jobs();
//  },
//     hasMoreJobs: function() {
//      var invJobIds = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
//      if(invJobIds)
//          invJobsLength = invJobIds.length;
//      else
//          invJobsLength = 0;
//         return Template.instance().limit.get() < invJobsLength;
//     }
// });

// Template.invitedJobs.events({
//     'click .load-more': function(event, instance) {
//         event.preventDefault();
//         var limit = instance.limit.get();
//         limit += 10;
//         instance.limit.set(limit);
//     }
// })

var appliedJobs = function() {
    var providerDetails = Profiles.findOne({userId: Meteor.userId()});
    var appliedJobs = [];
    if(providerDetails.appliedJobs) {
        for(var i = providerDetails.appliedJobs.length - 1; i >= 0; i--) {
            appliedJobs.push(Jobs.findOne({_id: providerDetails.appliedJobs[i]}));
        }
    }
    return appliedJobs;
}

var appliedJobsOptions = {
    lengthMenu: [40, 80, 160, 320],
    pageLength: 40,
    columns: [
        {
            title: 'ID',
            data: function(jobDetails) {
                return '<small><i>' + jobDetails.readableID + '</i></small>'
            },
            responsivePriority: 4
        },
        {
            title: 'Title',
            data: function(jobDetails) {
                var jobLocation;
                var buyerName;
                if(Roles.userIsInRole(jobDetails.userId, ['dispatcher'])) {
                    buyerDetails = Dispatchers.findOne({userId: jobDetails.userId});
                    buyerName = buyerDetails.firstName + ' ' + buyerDetails.lastName
                } else {
                    buyerDetails = Buyers.findOne({userId: jobDetails.userId});
                    buyerName = buyerDetails.firstName + ' ' + buyerDetails.lastName
                }
                if(jobDetails.servicelocation == 'Remote Job') {
                    jobLocation = 'Remote Job';
                }
                else if(jobDetails.servicelocation == 'Field Job') {
                    if(jobDetails.fullLocation.sublocality) {
                        jobLocation = jobDetails.fullLocation.sublocality + ', ' + jobDetails.fullLocation.locality + ', ' + jobDetails.fullLocation.state + ', ' + jobDetails.fullLocation.zip;
                    } else {
                        jobLocation = jobDetails.fullLocation.locality + ', ' + jobDetails.fullLocation.state + ', ' + jobDetails.fullLocation.zip;
                    }
                }
                var jobUrl = '<small>' + jobLocation + '</small><br><small>Posted By: ' + buyerName + ' - ' + moment(jobDetails.createdAt).fromNow() + '</small>';
                return '<a class="budgetFont" href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a><br>' + jobUrl;
            },
            width: '60%',
            responsivePriority: 1
        },
        {
            title: 'Budget (USD)',
            data: function(jobDetails) {
                return '<span class="budgetFont">' + jobDetails.freelancer_nets + '</span>'
            },
            width: '20%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
                return '<span class="jobAppliedTick"><i class="fa fa-check-circle fa-2x"></i></span><br><small>U\'ve applied</small>';
            }
        }
    ],
    responsive: true
}

Template.appliedJobs.helpers({
    appliedJobs: function() {
        return appliedJobs;
    },
    appliedJobsOptions: appliedJobsOptions
})