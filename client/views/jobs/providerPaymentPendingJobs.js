var pendingApproval = function() {
    var providerDetails = Profiles.findOne({userId: Meteor.userId()});
    var pendingApproval = [];
    if(providerDetails.pendingApproval) {
        for(var i = providerDetails.pendingApproval.length - 1; i >= 0; i--) {
            pendingApproval.push(Jobs.findOne({_id: providerDetails.pendingApproval[i]}));
        }
    }
    return pendingApproval;
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
            width: '50%',
            responsivePriority: 1
        },
        {
            title: 'Distance (Mi.)',
            data: function(jobDetails) {
                if(jobDetails.servicelocation == 'Remote Job') {
                    return 0;
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
                return '<span class="budgetFont">' + (+(Math.round(jobDetails.projectBudget + 'e+2') + 'e-2')) + '</span>'
            },
            width: '15%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
                return '<small>Job submitted for approval. Await response.</small>';
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

Template.providerPendingApprovalJobs.helpers({
    pendingApproval: function() {
        return pendingApproval;
    },
    pendingApprovalOptions: pendingApprovalOptions
})