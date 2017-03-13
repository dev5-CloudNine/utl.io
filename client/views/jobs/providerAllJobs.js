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
    order: [[0, 'desc']],
    columns: [
        {
            title: 'ID',
            data: function(jobDetails) {
                return '<small><i>' + jobDetails.readableID + '</i></small>'
            }
        },
        {
            title: 'Title',
            data: function(jobDetails) {
                var jobLocation;
                var buyerName;
                var rateBasisText;
                if(jobDetails.ratebasis == 'Fixed Pay') {
                    rateBasisText = '<p class="label label-fixed-pay">FIXED PAY</p>';
                }
                if(jobDetails.ratebasis == 'Per Hour') {
                    rateBasisText = '<p class="label label-hourly-pay">PER HOUR</p>' + jobDetails.hourlyrate + 'USD for ' + jobDetails.maxhours + ' hours.';
                }
                if(jobDetails.ratebasis == 'Per Device') {
                    rateBasisText = '<p class="label label-device-pay">PER DEVICE</p>' + jobDetails.rateperdevice + 'USD for ' + jobDetails.maxdevices + ' devices.';
                }
                if(jobDetails.ratebasis == 'Blended') {
                    rateBasisText = '<p class="label label-blended-pay">BLENDED PAY</p>' + jobDetails.payforfirsthours + ' USD for the first' + jobDetails.firsthours + ' hours, and then ' + jobDetails.payfornexthours + ' USD for the next ' + jobDetails.nexthours + ' hours.'
                }
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
                var jobUrl = '<small>' + jobLocation + '</small><br><small>' + rateBasisText + '</small><br><small>Posted By: ' + buyerName + ' - ' + moment(jobDetails.createdAt).fromNow() + '</small>';
                return '<a class="budgetFont" href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a><br>' + jobUrl;
            },
            width: '60%'
        },
        {
            title: 'Budget (USD)',
            data: function(jobDetails) {
                if(jobDetails.applicationStatus == 'open') {
                    return '<span class="budgetFont">' + jobDetails.freelancer_nets + '</span>';
                }
                if(jobDetails.applicationStatus == 'assigned') {
                    if(jobDetails.assignmentStatus == 'not_confirmed' || jobDetails.assignmentStatus == 'confirmed' || jobDetails.assignmentStatus == 'submitted' || jobDetails.assignmentStatus == 'rejected' || jobDetails.assignmentStatus == 'approved') {
                        var applications = jobDetails.applications;
                        var budget;
                        for(var i = 0; i < applications.length; i++) {
                            if(applications[i].app_status && applications[i].app_status == 'accepted') {
                                if(applications[i].app_type == 'application') {
                                    budget = jobDetails.freelancer_nets;
                                    break;
                                } else if(applications[i].app_type == 'counteroffer') {
                                    budget = applications[i].freelancer_nets;
                                    break;
                                }
                            } else {
                                budget = jobDetails.freelancer_nets;
                            }
                        }
                    }
                    return '<span class="budgetFont">' + budget + '</span>';
                }
                if(jobDetails.applicationStatus == 'paid') {
                    return '<span class="budgetFont">' + jobDetails.projectBudget + '</span>';
                }
            },
            width: '20%'
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
                    return '<span class="jobAppliedTick" data-balloon="U\'ve Applied" data-balloon-pos="up"><i class="fa fa-check-square fa-2x"></i></span>';
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
                            var returnText = '<small>You confirmed. Job assigned. Finish all the tasks and fill up your timesheets to submit the job for buyer approval.</small>';
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
    ]
}

Template.providerAllJobs.helpers({
    allJobs: function() {
        return allJobs;
    },
    allJobsOptions: allJobsOptions
})

Template.providerAllJobs.events({
    'click .confirmAssignment': function(event, template) {
        event.preventDefault();
        var buyerId = $(event.currentTarget).data('buyer-id');
        var jobId = $(event.currentTarget).data('job-id');
        Meteor.call('confirmAssignment', jobId, buyerId, function(error) {
            if(error) {
                toastr.error('Failed to confirm assignment.');
            }
        })
    },
    'click .submitAssignment': function(event, template) {
        event.preventDefault();
        var jobId = $(event.currentTarget).data('job-id');
        Meteor.call('submitAssignment', jobId, function(error) {
            if(error) {
                toastr.error('Failed to submit assignment. Please try again.');
            }
        });
    }
})