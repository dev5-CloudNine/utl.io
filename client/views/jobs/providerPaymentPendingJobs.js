// Template.providerPendingApprovalJobs.onCreated(function() {
//     var instance = this;
//     instance.loaded = new ReactiveVar(0);
//     instance.limit = new ReactiveVar(10);
// });

// Template.providerPendingApprovalJobs.helpers({
// 	providerPendingApprovalJobs: function() {
// 		var pendingJobIds = Profiles.findOne({userId: Meteor.userId()}).pendingApproval;
//         var pendingApproval = [];
//         if(pendingJobIds) {
//             for(var i = pendingJobIds.length - 1; i>=pendingJobIds.length - Template.instance().limit.get(); i-- ) {
//                 if(i<0)
//                     break;
//                 pendingApproval.push(Jobs.findOne({_id: pendingJobIds[i]}));
//             }
//         }
//         return pendingApproval;
// 	},
//     hasMoreJobs: function() {
//     	var pendingJobIds = Profiles.findOne({userId: Meteor.userId()}).pendingApproval;
//     	if(pendingJobIds)
//     		pendingJobsLength = pendingJobIds.length;
//     	else
//     		pendingJobsLength = 0;
//         return Template.instance().limit.get() < pendingJobsLength;
//     }
// })

// Template.providerPendingApprovalJobs.events({
//     'click .load-more': function(event, instance) {
//         event.preventDefault();
//         var limit = instance.limit.get();
//         limit += 10;
//         instance.limit.set(limit);
//     }
// })

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
                return '<small>Job submitted for approval. Await response.</small>';
            }
        }
    ],
    responsive: true
}

Template.providerPendingApprovalJobs.helpers({
    pendingApproval: function() {
        return pendingApproval;
    },
    pendingApprovalOptions: pendingApprovalOptions
})