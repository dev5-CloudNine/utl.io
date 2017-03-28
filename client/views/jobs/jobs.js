var openJobs = function() {
    return Jobs.find({$and: [{invited: false}, {routed: false}, {status: 'active'}, {$or: [{applicationStatus: 'open'}, {$and: [{applicationStatus: 'assigned'}, {assignmentStatus: 'not_confirmed'}]}]}]}).fetch();
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

var openJobsObject = {
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
                var jobDistance;
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
                } else {
                    if(jobDetails.fullLocation.sublocality) {
                        jobLocation = jobDetails.fullLocation.sublocality + ', ' + jobDetails.fullLocation.locality + ', ' + jobDetails.fullLocation.state + ', ' + jobDetails.fullLocation.zip;
                    } else {
                        jobLocation = jobDetails.fullLocation.locality + ', ' + jobDetails.fullLocation.state + ', ' + jobDetails.fullLocation.zip;
                    }
                }
                var recommended = false;
                var providerDetails = Profiles.findOne({userId: Meteor.userId()});
                if(providerDetails.industryTypes) {
                    for(var i = 0; i < providerDetails.industryTypes.length; i++) {
                        if(jobDetails.jobSubCategory == providerDetails.industryTypes[i]) {
                            recommended = true;
                            break;
                        }
                    }
                }
                var jobUrl = '<small>' + jobLocation + '</small><br>' + rateBasisText + '<br><small>Posted By: ' + buyerName + ' - ' + moment(jobDetails.createdAt).fromNow() + '</small>';
                if(recommended) {
                    return '<a class="budgetFont" href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a>&nbsp;<span class="recommendedIcon" data-balloon="Recommended" data-balloon-pos="up"><i class="fa fa-thumbs-up"></i></span><br>' + jobUrl;
                }
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
                var budget = +(Math.round(jobDetails.freelancer_nets + 'e+2') + 'e-2');
                return '<span class="budgetFont">' + budget + '</span>';
            },
            width: '15%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            responsivePriority: 3,
            data: function(jobDetails) {
                var applied = false;
                var acceptedUser;
                var applicationTime;
                if(jobDetails.applications) {
                    for(var i = 0; i < jobDetails.applications.length; i++) {
                        if(jobDetails.applications[i].userId == Meteor.userId()) {
                            applied = true;
                            applicationTime = jobDetails.applications[i].applied_at;
                        }
                        if(jobDetails.applications[i].app_status == 'accepted') {
                            acceptedUser = jobDetails.applications[i].userId;
                        }
                    }
                }
                if(applied) {
                    if(acceptedUser == Meteor.userId()) {
                        var returnText = '<small><i>' + moment(jobDetails.updatedAt).format("dddd, MMMM Do YYYY, h:mm a") + '</i></small><br><small>Application accepted. Job assigned. Needs confirmation.</small><br>';
                        return returnText + '<button data-job-id="' + jobDetails._id + '" data-buyer-id="' + jobDetails.userId + '" class="margin-top-5 btn btn-primary btn-sm confirmAssignment">Confirm</button>'
                    }
                    return '<small><i>' + moment(applicationTime).format('LLLL') + '</i></small><br><span class="jobAppliedTick" data-balloon="U\'ve Applied" data-balloon-pos="up">U\'ve applied.</span>';
                }
                return '<a href="/jobs/' + jobDetails._id + '" class="btn btn-sm btn-primary">Apply</a>';
            }
        }
    ],
    responsive: true
}

Template.jobs.helpers({
    openJobs: function() {
        return openJobs;
    },
    openJobsOptions: openJobsObject
})

Template.jobs.events({
    'click .confirmAssignment': function(event, template) {
        event.preventDefault();
        var buyerId = $(event.currentTarget).data('buyer-id');
        var jobId = $(event.currentTarget).data('job-id');
        $(event.currentTarget).button({loadingText:'<i class="fa fa-circle-o-notch fa-spin"></i> OK Wait...'})
        $(event.currentTarget).button('loading');
        var jobDetails = Jobs.findOne({_id: jobId});
        var providerEarnings;
        if(jobDetails.applications) {
            var acceptedApplication;
            for(var i = 0; i < jobDetails.applications.length; i++) {
                if(jobDetails.applications[i].app_status == 'accepted') {
                    acceptedApplication = jobDetails.applications[i];
                    break;
                }
            }
            if(acceptedApplication.app_type == 'application') {
                providerEarnings = jobDetails.freelancer_nets;
                if(jobDetails.ratebasis == 'Per Device') {
                    Meteor.call('setEstimatedDevices', jobDetails.maxdevices, jobId);
                }
            } 
            if(acceptedApplication.app_type == 'counteroffer') {
                providerEarnings = acceptedApplication.freelancer_nets;
                if(acceptedApplication.counterType == 'per_device') {
                    Meteor.call('setEstimatedDevices', acceptedApplication.max_devices, jobId);
                }
            }
        }
        Meteor.call('confirmAssignment', jobId, buyerId, providerEarnings, function(error) {
            if(error) {
                $(event.currentTarget).button('reset');
            }
        })
    }
})