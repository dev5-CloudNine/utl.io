// Template.providerAllJobs.onCreated(function() {
//     var instance = this;
//     instance.loaded = new ReactiveVar(0);
//     instance.limit = new ReactiveVar(10);
//     instance.jobs = function() {
//         var allJobIds = Profiles.findOne({userId: Meteor.userId()}).allJobs;
// 		var allJobs = [];
// 		if(allJobIds) {
// 			for(var i = allJobIds.length - 1; i>=allJobIds.length - instance.limit.get(); i-- ) {
// 				if(i<0)
// 					break;
// 				allJobs.push(Jobs.findOne({_id: allJobIds[i]}));
// 			}
// 		}
// 		return allJobs;
//     }
// });

// Template.providerAllJobs.helpers({
// 	providerAllJobs: function() {
// 		return Template.instance().jobs();
// 	},
//     hasMoreJobs: function() {
//     	var allJobIds = Profiles.findOne({userId: Meteor.userId()}).allJobs;
//     	if(allJobIds)
//     		allJobsLength = allJobIds.length;
//     	else
//     		allJobsLength = 0;
//         return Template.instance().limit.get() < allJobsLength;
//     }
// })

// Template.providerAllJobs.events({
//     'click .load-more': function(event, instance) {
//         event.preventDefault();
//         var limit = instance.limit.get();
//         limit += 10;
//         instance.limit.set(limit);
//     }
// })

var allJobs = function() {
    var providerDetails = Profiles.findOne({userId: Meteor.userId()});
    var allJobs = [];
    if(providerDetails.allJobs) {
        for(var i = providerDetails.allJobs.length - 1; i >= 0; i--) {
            allJobs.push(Jobs.findOne({_id: providerDetails.allJobs[i]}));
        }
    }
    return allJobs;
}

var allJobsOptions = {
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
                var acceptedProvider = false;
                if(jobDetails.applications) {
                    for(var i = 0; i < jobDetails.applications.length; i++) {
                        if(jobDetails.applications[i].userId == Meteor.userId() && jobDetails.applications[i].app_status == 'accepted') {
                            acceptedProvider = true;
                            break;
                        }
                    }
                }
                if(jobDetails.applicationStatus == 'open')
                    return '<span class="jobAppliedTick"><i class="fa fa-check-circle fa-2x"></i></span><br><small>U\'ve applied</small>';
                if(jobDetails.applicationStatus == 'assigned') {
                    if(acceptedProvider) {
                        var returnText;
                        if(jobDetails.assignmentStatus == 'not_confirmed') {
                            if(jobDetails.routed) {
                                returnText = '<small>Routed job. Needs confirmation.</small>';
                            } else {
                                returnText = '<small>Application accepted. Job assigned. Needs confirmation.</small><br>';
                            }
                            return returnText + '<button data-job-id="' + jobDetails._id + '" data-buyer-id="' + jobDetails.userId + '" class="margin-top-5 btn btn-primary btn-sm confirmAssignment">Confirm</button>'
                        }
                        if(jobDetails.assignmentStatus == 'confirmed' || jobDetails.assignmentStatus == 'rejected') {
                            Meteor.subscribe('timeSheet', jobDetails._id);
                            var returnText = '<small>U confirmed. Job assigned. Finish all the tasks and fill up your timesheets to submit the job for buyer approval.</small>';
                            if(jobDetails.assignmentStatus == 'rejected') {
                                returnText = '<small>Rejected job done. Please discuss with the buyer for futher details and submit the job for buyer approval.</small>'
                            }
                            var tasksClosed = Tasks.find({$and:[{jobID:jobDetails._id},{state:{$ne:'Completed'}}]}).count();
                            if(tasksClosed != 0) {
                                return returnText;
                            }
                            var timeSheetsLogs = TimeSheet.findOne({jobID: jobDetails._id});
                            if(!timeSheetsLogs || !timeSheetsLogs.logs) {
                                return returnText;
                            }
                            if(timeSheetsLogs && timeSheetsLogs.logs) {
                                if(timeSheetsLogs.logs.length <= 0) {
                                    return returnText;
                                }
                            }
                            return returnText + '<br><button data-job-id="' + jobDetails._id + '" data-buyer-id="' + jobDetails.userId + '" class="margin-top-5 btn btn-primary btn-sm submitAssignment">Submit for Approval.</button>';
                        }
                        if(jobDetails.assignmentStatus == 'submitted') {
                            return '<small>Job submitted for approval. Await response.</small>'
                        }
                    }
                }
                if(jobDetails.applicationStatus == 'paid') {
                    if(jobDetails.assignedProvider != Meteor.userId()) {
                        return '<small>The job is now complete.</small>'
                    }
                    var returnText = '<small>Job approved. Account credited.</small>';
                    var reviewed = false;
                    if(Reviews.findOne({$and: [{reviewedJobId: jobDetails._id}, {providerId: Meteor.userId()}, {reviewedBy: 'provider'}]}))
                        reviewed = true;
                    if(reviewed)
                        return returnText + '<br><small>Review written. Job successfully closed.</small>';
                    else
                        return returnText + '<br><a href="/jobs/' + jobDetails._id + '" class="btn btn-sm btn-primary">Review</a>'
                }
            }
        }
    ],
    responsive: true
}

Template.providerAllJobs.helpers({
    allJobs: function() {
        return allJobs;
    },
    allJobsOptions: allJobsOptions
})