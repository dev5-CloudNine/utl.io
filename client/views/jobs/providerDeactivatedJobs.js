var deactivatedJobs = function() {
    var providerDetails = Profiles.findOne({userId: Meteor.userId()});
    var deactivatedJobs = [];
    if(providerDetails.deactivatedJobs) {
        for(var i = providerDetails.deactivatedJobs.length - 1; i >= 0; i--) {
            deactivatedJobs.push(Jobs.findOne({_id: providerDetails.deactivatedJobs[i]}));
        }
    }
    return deactivatedJobs;
}

var deactivatedJobsOptions = {
    lengthMenu: [40, 80, 160, 320],
    pageLength: 40,
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
                return '<span class="budgetFont">' + jobDetails.freelancer_nets + '</span>'
            },
            width: '15%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
                return '<small>Buyer deactivated.</small>';
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

Template.providerDeactivatedJobs.helpers({
    deactivatedJobs: function() {
        return deactivatedJobs;
    },
    deactivatedJobsOptions: deactivatedJobsOptions
})