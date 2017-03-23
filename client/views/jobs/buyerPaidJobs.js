var paidJobs = function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}, {status: 'active'}]}).fetch();
}

var paidJobsOptions = {
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
                    rateBasisText = '<span class="label-hourly-pay">PER HOUR&nbsp;&raquo;&nbsp;' + jobDetails.hourlyrate + 'USD for ' + jobDetails.maxhours + ' hours.</span>';
                }
                if(jobDetails.ratebasis == 'Per Device') {
                    rateBasisText = '<span class="label-device-pay">PER DEVICE&nbsp;&raquo;&nbsp;' + jobDetails.rateperdevice + 'USD for ' + jobDetails.maxdevices + ' devices.</span>';
                }
                if(jobDetails.ratebasis == 'Blended') {
                    rateBasisText = '<span class="label-blended-pay">BLENDED PAY&nbsp;&raquo;&nbsp;' + jobDetails.payforfirsthours + ' USD for the first ' + jobDetails.firsthours + ' hours, and then ' + jobDetails.payfornexthours + ' USD for the next ' + jobDetails.nexthours + ' hours</span>.'
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
                return '<span class="budgetFont">' + (+(Math.round(jobDetails.projectBudget + 'e+2') + 'e-2')) + '</span>'
            },
            width: '20%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
                var returnText = '<small><i>' + moment(jobDetails.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a") + '</i></small><br><small>Job approved. Provider\'s account credited.</small>';
                var reviewed = false;
                if(Reviews.findOne({$and: [{reviewedJobId: jobDetails._id}, {buyerId: Meteor.userId()}, {reviewedBy: 'buyer'}]}))
                    reviewed = true;
                if(reviewed)
                    return returnText + '<br><small>Review written. Job successfully closed.</small>';
                else
                    return returnText + '<br><a href="/jobs/' + jobDetails._id + '" class="btn btn-sm btn-primary">Review</a>'
            }
        }
    ],
    responsive: true
}

Template.buyerPaidJobs.helpers({
    paidJobs: function() {
        return paidJobs;
    },
    paidJobsOptions: paidJobsOptions
})