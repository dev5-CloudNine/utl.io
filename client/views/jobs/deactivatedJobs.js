var deactivatedJobs = function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {status: 'deactivated'}]}).fetch();
}

var deactivatedJobsOptions = {
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
                return '<span class="budgetFont">' + (+(Math.round(jobDetails.freelancer_nets + 'e+2') + 'e-2')) + '</span>'
            },
            width: '15%',
            responsivePriority: 2
        },
        {
            title: 'Asgn\'d to',
            data: function(jobDetails) {
                if(jobDetails.applicationStatus == 'assigned') {
                    if(jobDetails.assignmentStatus == 'confirmed' || jobDetails.assignmentStatus == 'submitted' || jobDetails.assignmentStatus == 'rejected') {
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
                if(jobDetails.paid30Usd) {
                    return '<small><i>' + moment(jobDetails.updatedAt).format("dddd, MMMM Do YYYY, h:mm a") + '</i></small><br><small>You have deactivated the job. You have paid 30 USD to the assigned provider as a goodwill token.</small>'
                }
                if(jobDetails.denied30Usd) {
                    return '<small><i>' + moment(jobDetails.updatedAt).format("dddd, MMMM Do YYYY, h:mm a") + '</i></small><br><small>You have deactivated the job. You denied to pay 30 USD.</small>'
                }
                return '<small><i>' + moment(jobDetails.updatedAt).format("dddd, MMMM Do YYYY, h:mm a") + '</i></small><br><small>Job deactivated.</small>';
            }
        }
    ],
    responsive: true
}

Template.deactivatedJobs.helpers({
    deactivatedJobs: function() {
        return deactivatedJobs;
    },
    deactivatedJobsOptions: deactivatedJobsOptions
})