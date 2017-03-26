var assignedJobs = function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}, {$or: [{assignmentStatus: 'not_confirmed'}, {assignmentStatus: 'confirmed'}, {assignmentStatus: 'rejected'}]}, {status: 'active'}]}).fetch();
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
            width: '60%',
            responsivePriority: 1
        },
        {
            title: 'Budget (USD)',
            data: function(jobDetails) {
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
            },
            width: '20%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
                if(jobDetails.assignmentStatus == 'not_confirmed') {
                    return '<small><i>' + moment(jobDetails.updatedAt).format("dddd, MMMM Do YYYY, h:mm a") + '</i></small><br><small>Job assigned. Awaiting confirmation.</small>';
                }
                if(jobDetails.assignmentStatus == 'confirmed') {
                    return '<small><i>' + moment(jobDetails.updatedAt).format("dddd, MMMM Do YYYY, h:mm a") + '</i></small><br><small>Job assigned. Provider confirmed.</small>';
                }
                if(jobDetails.assignmentStatus == 'rejected') {
                    return '<small><i>' + moment(jobDetails.updatedAt).format("dddd, MMMM Do YYYY, h:mm a") + '</i></small><br><small>You have rejected the assignment. Please discuss with the provider and sort it out.</small>';
                }
            }
        }
    ],
    responsive: true
}

Template.buyerAssignedJobs.helpers({
    assignedJobs: function() {
        return assignedJobs;
    },
    assignedJobsOptions: assignedJobsOptions
})