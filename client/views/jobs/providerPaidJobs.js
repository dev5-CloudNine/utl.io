// Template.providerPaidJobs.onCreated(function() {
//     var instance = this;
//     instance.loaded = new ReactiveVar(0);
//     instance.limit = new ReactiveVar(10);
//     instance.jobs = function() {
//         var paidJobIds = Profiles.findOne({userId: Meteor.userId()}).paidJobs;
// 		var paidJobs = [];
// 		if(paidJobIds) {
// 			for(var i = paidJobIds.length - 1; i>=paidJobIds.length - instance.limit.get(); i-- ) {
// 				if(i<0)
// 					break;
// 				paidJobs.push(Jobs.findOne({_id: paidJobIds[i]}));
// 			}
// 		}
// 		return paidJobs;
//     }
// });

// Template.providerPaidJobs.helpers({
// 	providerPaidJobs: function() {
// 		return Template.instance().jobs();
// 	},
//     hasMoreJobs: function() {
//     	var paidJobIds = Profiles.findOne({userId: Meteor.userId()}).paidJobs;
//     	if(paidJobIds)
//     		allJobsLength = paidJobIds.length;
//     	else
//     		allJobsLength = 0;
//         return Template.instance().limit.get() < allJobsLength;
//     }
// })

// Template.providerPaidJobs.events({
//     'click .load-more': function(event, instance) {
//         event.preventDefault();
//         var limit = instance.limit.get();
//         limit += 10;
//         instance.limit.set(limit);
//     }
// })
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
                var jobUrl = '<small>' + jobLocation + '</small><br><small>Posted By: ' + buyerName + ' - ' + moment(jobDetails.createdAt).fromNow() + '</small>';
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