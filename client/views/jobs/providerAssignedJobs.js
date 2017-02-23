var assignedJobs = function() {
    var providerDetails = Profiles.findOne({userId: Meteor.userId()});
    var assignedJobs = [];
    if(providerDetails.assignedJobs) {
        for(var i = providerDetails.assignedJobs.length - 1; i >= 0; i--) {
            assignedJobs.push(Jobs.findOne({_id: providerDetails.assignedJobs[i]}));
        }
    }
    return assignedJobs;
}

var assignedJobsOptions = {
    lengthMenu: [40, 80, 160, 320],
    pageLength: 40,
    order: [[0, 'desc']],
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
                var rateBasisText;
                if(jobDetails.ratebasis == 'Fixed Pay') {
                    rateBasisText = 'Fixed Pay';
                }
                if(jobDetails.ratebasis == 'Per Hour') {
                    rateBasisText = 'Per Hour<br>' + jobDetails.hourlyrate + 'USD for ' + jobDetails.maxhours + ' hours.';
                }
                if(jobDetails.ratebasis == 'Per Device') {
                    rateBasisText = 'Per Device<br>' + jobDetails.rateperdevice + 'USD for ' + jobDetails.maxdevices + ' hours.';
                }
                if(jobDetails.ratebasis == 'Blended') {
                    rateBasisText = 'Blended<br>' + jobDetails.payforfirsthours + ' USD for the first' + jobDetails.firsthours + ' hours, and then ' + jobDetails.payfornexthours + ' USD for the next ' + jobDetails.nexthours + ' hours.'
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
                if(jobDetails.routed) {
                    return '<a class="budgetFont" href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a>&nbsp;<span class="jobAppliedTick"><i class="glyphicon glyphicon-send"></i></span><br>' + jobUrl;
                }
                return '<a class="budgetFont" href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a><br>' + jobUrl;
            },
            width: '50%',
            responsivePriority: 1
        },
        {
            title: 'Distance (Mi.)',
            data: function(jobDetails) {
                if(jobDetails.servicelocation == 'Remote Job') {
                    return 'NA';
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
                if(jobDetails.routed) {
                    return '<span class="budgetFont">' + jobDetails.freelancer_nets + '</span>'
                }
                if(jobDetails.assignmentStatus == 'not_confirmed') {
                    var applications = jobDetails.applications;
                    var budget;
                    for(var i = 0; i < applications.length; i++) {
                        if(applications[i].app_status == 'accepted') {
                            if(applications[i].app_type == 'application') {
                                budget = jobDetails.freelancer_nets;
                                break;
                            } else if(applications[i].app_type == 'counteroffer') {
                                budget = applications[i].freelancer_nets;
                                break;
                            }
                        }
                    }
                    return '<span class="budgetFont">' + (+(Math.round(budget + 'e+2') + 'e-2')) + '</span>';
                }
                if(jobDetails.assignmentStatus == 'confirmed' || jobDetails.assignmentStatus == 'rejected')
                    return '<span class="budgetFont">' + (+(Math.round(jobDetails.projectBudget + 'e+2') + 'e-2')) + '</span>'
            },
            width: '15%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
                var returnText;
                if(jobDetails.assignmentStatus == 'not_confirmed') {
                    if(jobDetails.routed) {
                        returnText = '<small>Assigned job. Needs confirmation.</small>';
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
            }
        }
    ],
    responsive: true
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

Template.providerAssignedJobs.helpers({
    assignedJobs: function() {
        return assignedJobs;
    },
    assignedJobsOptions: assignedJobsOptions
});

Template.providerAssignedJobs.events({
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