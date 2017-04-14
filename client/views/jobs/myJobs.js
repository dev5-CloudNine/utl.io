var allJobs = function() {
    return Jobs.find({userId: Meteor.userId()}).fetch();
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
            },
            responsivePriority: 4
        },
        {
            title: 'Title',
            data: function(jobDetails) {
                var jobLocation;
                var jobSchedule;
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
                if(jobDetails.serviceschedule == 'exactdate') {
                    jobSchedule = 'Scheduled On: ' + moment(jobDetails.exactdate).tz('America/New_York').format('LLLL');
                } else if(jobDetails.serviceschedule == 'betweendates') {
                    jobSchedule = 'Scheduled From: ' + moment(jobDetails.startdate).format('dddd, MMMM D, YYYY') + ' To: ' + moment(jobDetails.enddate).format('dddd, MMMM D, YYYY') + '<br> Time: ' + jobDetails.starttime + ' to ' + jobDetails.endtime;
                }
                var jobUrl = '<small>' + jobLocation + '</small><br>' + rateBasisText + '<br>' + jobSchedule + '<br><small>Posted By: ' + buyerName + ' - ' + moment(jobDetails.createdAt).fromNow() + '</small>';
                return '<a class="budgetFont" href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a><br>' + jobUrl;
            },
            width: '50%',
            responsivePriority: 1
        },
        {
            title: 'Budget (USD)',
            data: function(jobDetails) {
                if(jobDetails.applicationStatus == 'assigned') {
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
                    if(jobDetails.assignmentStatus == 'confirmed' || jobDetails.assignmentStatus == 'rejected') {
                        return '<span class="budgetFont">' + (+(Math.round(jobDetails.projectBudget + 'e+2') + 'e-2')) + '</span>'
                    }
                }
                if(jobDetails.applicationStatus == 'paid') {
                    return '<span class="budgetFont">' + (+(Math.round(jobDetails.projectBudget + 'e+2') + 'e-2')) + '</span>';
                }
                return '<span class="budgetFont">' + (+(Math.round(jobDetails.freelancer_nets + 'e+2') + 'e-2')) + '</span>';
            },
            width: '15%',
            responsivePriority: 2
        },
        {
            title: 'Asgn\'d to',
            data: function(jobDetails) {
                if(jobDetails.applicationStatus == 'assigned' || jobDetails.applicationStatus == 'paid') {
                    if(jobDetails.assignmentStatus == 'not_confirmed') {
                        var acceptedApplication;
                        if(jobDetails.applications && jobDetails.applications.length > 0) {
                            for(var i = 0; i < jobDetails.applications.length; i++) {
                                if(jobDetails.applications[i].app_status == 'accepted') {
                                    acceptedApplication = jobDetails.applications[i].userId;
                                    break;
                                }
                            }
                        }
                        var providerDetails = Profiles.findOne({userId: acceptedApplication});
                        return '<small><i># ' + providerDetails.readableID + '</i></small><br><a class="budgetFont" href="/profiles/' + providerDetails._id + '">' + providerDetails.firstName + ' ' + providerDetails.lastName + '</a><small><p>' + providerDetails.title + '</p></small>'
                    }
                    if(jobDetails.assignmentStatus == 'confirmed' || jobDetails.assignmentStatus == 'rejected' || jobDetails.assignmentStatus == 'submitted' || jobDetails.assignmentStatus == 'approved' || jobDetails.assignmentStatus == 'pending_payment' || jobDetails.assignmentStatus == 'paid') {
                        var providerDetails = Profiles.findOne({userId: jobDetails.assignedProvider});
                        return '<small><i># ' + providerDetails.readableID + '</i></small><br><a class="budgetFont" href="/profiles/' + providerDetails._id + '">' + providerDetails.firstName + ' ' + providerDetails.lastName + '</a><small><p>' + providerDetails.title + '</p></small>'
                    }
                }
            },
            width: '15%'
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
                var returnText;
                if(jobDetails.status == 'active') {
                    if(jobDetails.applicationStatus == 'open') {
                        var appCount = 0;
                        if(jobDetails.applications)
                            appCount = jobDetails.applications.length;
                        return '<a href="/jobs/' + jobDetails._id + '" class="btn btn-sm btn-primary">View Applications <span class="badge">' + appCount + '</span></a>';
                    }
                    if(jobDetails.applicationStatus == 'assigned') {
                        if(jobDetails.assignmentStatus == 'not_confirmed') {
                            return '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>Job assigned. Awaiting confirmation.</small>';
                        }
                        if(jobDetails.assignmentStatus == 'confirmed') {
                            return '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>Job assigned. Provider confirmed.</small>';
                        }
                        if(jobDetails.assignmentStatus == 'submitted') {
                            var returnText = '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>Job submittted. Approve or reject. Upon approval, the provider\'s account will be credited with ' + jobDetails.projectBudget + ' USD. Ensure that all the tasks and timesheets are upto your mark.</small>'
                            return returnText + '<br><a href="/jobs/' + jobDetails._id + '" class="btn btn-sm btn-primary">View Details</a>';
                        }
                        if(jobDetails.assignmentStatus == 'rejected') {
                            return '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>You have rejected the assignment. Please discuss with the provider and sort it out.</small>';
                        }
                    }
                    if(jobDetails.applicationStatus == 'paid') {
                        return '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>Job approved. Provider\'s account credited.</small>'
                    }
                } else {
                    return '<small><i>' + moment(jobDetails.updatedAt).format('LLLL') + '</i><br>Job deactivated.</small>';
                }
            }
        }
    ],
    responsive: true
}

Template.myJobs.helpers({
    allJobs: function() {
        return allJobs;
    },
    allJobsOptions: allJobsOptions
})

Template.myJobs.events({
    'click .approveAssignment': function(event, template) {
        event.preventDefault();
        var jobId = $(event.currentTarget).data('job-id');
        var providerId = $(event.currentTarget).data('provider-id');
        Meteor.call('approveAssignment', jobId, providerId, function(error) {
            if(error) {
                toastr.error('Failed to approve assignment. Please try again.');
            }
        });
    },
    'click .rejectAssignment': function(event, template) {
        var jobId = $(event.currentTarget).data('job-id');
        Meteor.call('rejectAssignment', jobId, function(error) {
            if(error) {
                toastr.error('Failed to reject assignment. Please try again.');
            }
        });
    }
})