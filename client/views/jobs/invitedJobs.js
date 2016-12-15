// Template.invitedJobs.onCreated(function() {
//     var instance = this;
//     instance.loaded = new ReactiveVar(0);
//     instance.limit = new ReactiveVar(10);
//     instance.jobs = function() {
//         var invJobIds = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
// 		var invitedJobs = [];
// 		if(invJobIds) {
// 			for(var i = invJobIds.length - 1; i>=invJobIds.length - instance.limit.get(); i-- ) {
// 				if(i<0)
// 					break;
// 				invitedJobs.push(Jobs.findOne({_id: invJobIds[i]}));
// 			}
// 		}
// 		return invitedJobs;
//     }
// });

// Template.invitedJobs.helpers({
// 	invitedJobs: function () {
// 		return Template.instance().jobs();
// 	},
//     hasMoreJobs: function() {
//     	var invJobIds = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
//     	if(invJobIds)
//     		invJobsLength = invJobIds.length;
//     	else
//     		invJobsLength = 0;
//         return Template.instance().limit.get() < invJobsLength;
//     }
// });

// Template.invitedJobs.events({
//     'click .load-more': function(event, instance) {
//         event.preventDefault();
//         var limit = instance.limit.get();
//         limit += 10;
//         instance.limit.set(limit);
//     }
// })

var invitedJobs = function() {
    var providerDetails = Profiles.findOne({userId: Meteor.userId()});
    var invitedJobs = [];
    if(providerDetails.invitedJobs) {
        for(var i = providerDetails.invitedJobs.length - 1; i >= 0; i--) {
            invitedJobs.push(Jobs.findOne({_id: providerDetails.invitedJobs[i]}));
        }
    }
    return invitedJobs;
}

var invitedJobsOptions = {
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
                var jobUrl = '<small>' + jobLocation + '</small><br><small>Posted By: ' + buyerName + ' - ' + moment(jobDetails.createdAt).fromNow() + '</small>';
                if(recommended) {
                    return '<a class="budgetFont" href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a>&nbsp;<span class="recommendedIcon"><i class="fa fa-thumbs-up"></i></span><br>' + jobUrl;
                }
                return '<a class="budgetFont" href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a><br>' + jobUrl;
            },
            width: '60%',
            responsivePriority: 1
        },
        {
            title: 'Budget (USD)',
            data: function(jobDetails) {
                return '<span class="budgetFont">' + jobDetails.freelancer_nets + '</span>'
            },
            width: '20%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
                return '<a class="btn btn-primary btn-sm" href="/jobs/' + jobDetails._id + '">Apply</a>'; 
            }
        }
    ],
    responsive: true
}

Template.invitedJobs.helpers({
    invitedJobs: function() {
        return invitedJobs;
    },
    invitedJobsOptions: invitedJobsOptions
})