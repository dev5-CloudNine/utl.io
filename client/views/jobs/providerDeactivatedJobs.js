// Template.providerDeactivatedJobs.onCreated(function() {
//     var instance = this;
//     instance.loaded = new ReactiveVar(0);
//     instance.limit = new ReactiveVar(10);
//     instance.jobs = function() {
//         var deactivatedJobIds = Profiles.findOne({userId: Meteor.userId()}).deactivatedJobs;
// 		var deactivatedJobs = [];
// 		if(deactivatedJobIds) {
// 			for(var i = deactivatedJobIds.length - 1; i>=deactivatedJobIds.length - instance.limit.get(); i-- ) {
// 				if(i<0)
// 					break;
// 				deactivatedJobs.push(Jobs.findOne({_id: deactivatedJobIds[i]}));
// 			}
// 		}
// 		return deactivatedJobs;
//     }
// });

// Template.providerDeactivatedJobs.helpers({
// 	providerDeactivatedJobs: function() {
// 		return Template.instance().jobs();
// 	},
//     hasMoreJobs: function() {
//     	var deactivatedJobIds = Profiles.findOne({userId: Meteor.userId()}).deactivatedJobs;
//     	if(deactivatedJobIds)
//     		allJobsLength = deactivatedJobIds.length;
//     	else
//     		allJobsLength = 0;
//         return Template.instance().limit.get() < allJobsLength;
//     }
// })

// Template.providerDeactivatedJobs.events({
//     'click .load-more': function(event, instance) {
//         event.preventDefault();
//         var limit = instance.limit.get();
//         limit += 10;
//         instance.limit.set(limit);
//     }
// })

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
                return '<small>Buyer deactivated.</small>';
            }
        }
    ],
    responsive: true
}

Template.providerDeactivatedJobs.helpers({
    deactivatedJobs: function() {
        return deactivatedJobs;
    },
    deactivatedJobsOptions: deactivatedJobsOptions
})