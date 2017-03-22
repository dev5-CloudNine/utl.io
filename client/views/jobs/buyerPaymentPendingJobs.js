var pendingApproval = function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}, {assignmentStatus: 'submitted'}, {status: 'active'}]}).fetch();
}

var pendingApprovalOptions = {
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
            width: '60%',
            responsivePriority: 1
        },
        {
            title: 'Budget (USD)',
            data: function(jobDetails) {
                return '<span class="budgetFont">' + (+(Math.round(jobDetails.projectBudget + 'e+2') + 'e-2')) + '</span>'
            },
            width: '20%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
                var returnText;
                if(jobDetails.assignmentStatus == 'submitted') {
                    var returnText = '<small><i>' + moment(jobDetails.updatedAt).format("dddd, MMMM Do YYYY, h:mm a") + '</i></small><br><small>Job submittted. Approve or reject. Upon approval, the provider\'s account will be credited with ' + jobDetails.projectBudget + ' USD. Ensure that all the tasks and timesheets are upto your mark.</small>'
                }
                return returnText + '<br><a href="/jobs/' + jobDetails._id + '" class="btn btn-primary btn-sm">View Details</a>';
            }
        }
    ],
    responsive: true
}

Template.buyerPendingApprovalJobs.helpers({
    pendingApproval: function() {
        return pendingApproval;
    },
    pendingApprovalOptions: pendingApprovalOptions
})

Template.buyerPendingApprovalJobs.events({
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