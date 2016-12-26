var paidJobs = function() {
    var providerDetails = Profiles.findOne({userId: Meteor.userId()});
    var paidJobs = [];
    if(providerDetails.paidJobs) {
        for(var i = providerDetails.paidJobs.length - 1; i >= 0; i--) {
            paidJobs.push(Jobs.findOne({_id: providerDetails.paidJobs[i]}));
        }
    }
    return paidJobs;
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
                return '<a class="budgetFont" href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a><br>' + jobUrl;
            },
            width: '60%',
            responsivePriority: 1
        },
        {
            title: 'Budget (USD)',
            data: function(jobDetails) {
                return '<span class="budgetFont">' + jobDetails.projectBudget + '</span>'
            },
            width: '20%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
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
    ],
    responsive: true
}

Template.providerPaidJobs.helpers({
    paidJobs: function() {
        return paidJobs;
    },
    paidJobsOptions: paidJobsOptions
})