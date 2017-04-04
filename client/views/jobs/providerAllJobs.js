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
                    rateBasisText = '<span class="label-fixed-pay">FIXED PAY</span>';
                }
                if(jobDetails.ratebasis == 'Per Hour') {
                    rateBasisText = '<span class="label-hourly-pay">PER HOUR&nbsp;&raquo;&nbsp;</span>' + jobDetails.hourlyrate + 'USD for ' + jobDetails.maxhours + ' hours.';
                }
                if(jobDetails.ratebasis == 'Per Device') {
                    rateBasisText = '<span class="label-device-pay">PER DEVICE&nbsp;&raquo;&nbsp;</span>' + jobDetails.rateperdevice + 'USD for ' + jobDetails.maxdevices + ' devices.';
                }
                if(jobDetails.ratebasis == 'Blended') {
                    rateBasisText = '<span class="label-blended-pay">BLENDED PAY&nbsp;&raquo;&nbsp;</span>' + jobDetails.payforfirsthours + ' USD for the first ' + jobDetails.firsthours + ' hours, and then ' + jobDetails.payfornexthours + ' USD for the next ' + jobDetails.nexthours + ' hours.'
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
                var jobUrl = '<small>' + jobLocation + '</small><br>' + rateBasisText + '<br><small>Posted By: ' + buyerName + ' - ' + moment(jobDetails.createdAt).fromNow() + '</small>';
                return '<a class="budgetFont" href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a><br>' + jobUrl;
            },
            width: '50%'
        },
        {
            title: 'Distance (Mi.)',
            data: function(jobDetails) {
                if(jobDetails.servicelocation == 'Remote Job') {
                    return 0;
                } else {
                    var providerDetails = Profiles.findOne({userId: Meteor.userId()});
                    return distance(providerDetails.fullLocation.latitude, providerDetails.fullLocation.longitude, jobDetails.fullLocation.latitude, jobDetails.fullLocation.longitude);
                }
            },
            width: '15%'
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
            width: '15%'
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
                if(jobDetails.applicationStatus == 'open') {
                    var applicationTime;
                    if(jobDetails.applications) {
                        for(var i = 0; i < jobDetails.applications.length; i++) {
                            if(jobDetails.applications[i].userId == Meteor.userId()) {
                                applicationTime = jobDetails.applications[i].applied_at;
                                break;
                            }
                        }
                    }
                    return '<small><i>' + moment(applicationTime).format('LLLL') + '</i></small><br><span class="jobAppliedTick" data-balloon="U\'ve Applied" data-balloon-pos="up">U\'ve applied.</span>';
                }
                if(jobDetails.applicationStatus == 'assigned') {
                    if(acceptedProvider) {
                        var returnText;
                        if(jobDetails.assignmentStatus == 'not_confirmed') {
                            if(jobDetails.routed) {
                                returnText = '<small><i>' + moment(jobDetails.createdAt).format('LLLL') + '</i><br>Routed job. Needs confirmation.</small>';
                            } else {
                                returnText = '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>Application accepted. Job assigned. Needs confirmation.</small><br>';
                            }
                            return returnText + '<button data-job-id="' + jobDetails._id + '" data-buyer-id="' + jobDetails.userId + '" class="margin-top-5 btn btn-primary btn-sm confirmAssignment">Confirm</button>'
                        }
                        if(jobDetails.assignmentStatus == 'confirmed' || jobDetails.assignmentStatus == 'rejected') {
                            Meteor.subscribe('timeSheet', jobDetails._id);
                            var returnText = '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>You confirmed. Job assigned. Finish all the tasks and fill up your timesheets to submit the job for buyer approval.</small>';
                            if(jobDetails.assignmentStatus == 'rejected') {
                                returnText = '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>Rejected job done. Please discuss with the buyer for futher details and submit the job for buyer approval.</small>'
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
                            return '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>Job submitted for approval. Await response.</small>'
                        }
                    } else {
                        if(jobDetails.assignmentStatus == 'not_confirmed') {
                            if(jobDetails.applications) {
                                for(var i = 0; i < jobDetails.applications.length; i++) {
                                    if(jobDetails.applications[i].userId == Meteor.userId()) {
                                        applicationTime = jobDetails.applications[i].applied_at;
                                        break;
                                    }
                                }
                            }
                            return '<small><i>' + moment(applicationTime).format('LLLL') + '</i></small><br><span class="jobAppliedTick" data-balloon="U\'ve Applied" data-balloon-pos="up">U\'ve applied.</span>';
                        } else {
                            return '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>The job has been assigned to another provider.</small>';
                        }
                    }
                }
                if(jobDetails.applicationStatus == 'paid') {
                    if(jobDetails.assignedProvider != Meteor.userId()) {
                        return '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>The job has been assigned to another provider.</small>'
                    }
                    var returnText = '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>Job approved. Account credited.</small>';
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

var distance = function(plat, plng, jlat, jlng) {
    var R = 3959;
    var dLon = (plng - jlng) * Math.PI/180;
    var dLat = (plat - jlat) * Math.PI/180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(plat * Math.PI / 180 ) * Math.cos(jlat * Math.PI / 180 ) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return Math.round(d);
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
        $(event.currentTarget).button({loadingText:'<i class="fa fa-circle-o-notch fa-spin"></i> OK Wait...'})
        $(event.currentTarget).button('loading');
        var jobDetails = Jobs.findOne({_id: jobId});
        var providerEarnings;
        if(jobDetails.applications) {
            var acceptedApplication;
            for(var i = 0; i < jobDetails.applications.length; i++) {
                if(jobDetails.applications[i].app_status == 'accepted') {
                    acceptedApplication = jobDetails.applications[i];
                    break;
                }
            }
            if(acceptedApplication.app_type == 'application') {
                providerEarnings = jobDetails.freelancer_nets;
                if(jobDetails.ratebasis == 'Per Device') {
                    Meteor.call('setEstimatedDevices', jobDetails.maxdevices, jobId);
                }
            } 
            if(acceptedApplication.app_type == 'counteroffer') {
                providerEarnings = acceptedApplication.freelancer_nets;
                if(acceptedApplication.counterType == 'per_device') {
                    Meteor.call('setEstimatedDevices', acceptedApplication.max_devices, jobId);
                }
            }
        }
        Meteor.call('confirmAssignment', jobId, buyerId, providerEarnings, function(error) {
            if(error) {
                $(event.currentTarget).button('reset');
            }
        })
    },
    'click .submitAssignment': function(event, template) {
        event.preventDefault();
        $(event.currentTarget).button({loadingText: '<i class="fa fa-circle-o-notch fa-spin"></i> OK Wait...'});
        $(event.currentTarget).button('loading');
        var jobId = $(event.currentTarget).data('job-id');
        Meteor.call('submitAssignment', jobId, function(error) {
            if(error) {
                toastr.error('Failed to submit assignment. Please try again.');
                $(event.currentTarget).button('reset');
            }
        });
    }
})