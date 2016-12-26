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
                return '<span class="budgetFont">' + jobDetails.freelancer_nets + '</span>';
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