var openJobs = function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'}, {status: 'active'}]}).fetch();
}

var openJobsOptions = {
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
                if(jobDetails.serviceschedule == 'exactdate') {
                    jobSchedule = 'Scheduled On: ' + moment(jobDetails.exactdate).format('dddd, MMMM D, YYYY') + '<br>Time: ' + jobDetails.exacttime;
                } else if(jobDetails.serviceschedule == 'betweendates') {
                    jobSchedule = 'Scheduled From: ' + moment(jobDetails.startdate).format('dddd, MMMM D, YYYY') + ' To: ' + moment(jobDetails.enddate).format('dddd, MMMM D, YYYY') + '<br> Time: ' + jobDetails.starttime + ' to ' + jobDetails.endtime;
                }
                var jobUrl = '<small>' + jobLocation + '</small><br>' + rateBasisText + '<br>' + jobSchedule + '<br><small>Posted By: ' + buyerName + ' - ' + moment(jobDetails.createdAt).fromNow() + '</small>';
                return '<a class="budgetFont" href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a><br>' + jobUrl;
            },
            width: '60%',
            responsivePriority: 1
        },
        {
            title: 'Budget (USD)',
            data: function(jobDetails) {
                return '<span class="budgetFont">' + (+(Math.round(jobDetails.freelancer_nets + 'e+2') + 'e-2')) + '</span>';
            },
            width: '20%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
                var appCount = 0;
                if(jobDetails.applications)
                    appCount = jobDetails.applications.length;
                return '<a href="/jobs/' + jobDetails._id + '" class="btn btn-sm btn-primary">View Applications <span class="badge">' + appCount + '</span></a>';
            }
        }
    ],
    responsive: true
}

Template.buyerOpenJobs.helpers({
    openJobs: function() {
        return openJobs;
    },
    openJobsOptions: openJobsOptions
})