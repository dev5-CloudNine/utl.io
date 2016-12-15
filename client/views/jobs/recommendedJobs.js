// Template.recommendedJobs.onCreated(function() {
//     var instance = this;
//     instance.loaded = new ReactiveVar(0);
//     instance.limit = new ReactiveVar(100);
//     instance.autorun(function() {
//         var limit = instance.limit.get();
//         var subscription = instance.subscribe('jobs', limit);
//         if(subscription.ready()) {
//             instance.loaded.set(limit);
//         }
//     });
//     instance.jobs = function() {
//     	var jobCategories = Profiles.findOne({userId: Meteor.userId()}).industryTypes;
//         return Jobs.find({$and: [{applicationStatus: 'open'}, {jobSubCategory: {$in: jobCategories}}]}, {sort: {createdAt: -1}});
//     }
// });

// Template.recommendedJobs.helpers({
// 	recommendedJobs: function () {		
// 		return Template.instance().jobs();
// 	},
//     hasMoreJobs: function() {
//         return Template.instance().jobs().count() >= Template.instance().limit.get();
//     }
// });

// Template.recommendedJobs.events({
//     'click .load-more': function(event, instance) {
//         event.preventDefault();
//         var limit = instance.limit.get();
//         limit += 10;
//         instance.limit.set(limit);
//     }
// })

var recommendedJobs = function() {
    var jobCategories = Profiles.findOne({userId: Meteor.userId()}).industryTypes;
    return Jobs.find({$and: [{jobSubCategory: {$in: jobCategories}}, {$or: [{applicationStatus: 'open'}, {$and: [{applicationStatus: 'assigned'}, {assignmentStatus: 'not_confirmed'}]}]}]}, {sort: {createdAt: -1}}).fetch();
}

var recommendedJobsObject = {
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
            responsivePriority: 3,
            data: function(jobDetails) {
                var applied = false;
                if(jobDetails.applications) {
                    for(var i = 0; i < jobDetails.applications.length; i++) {
                        if(jobDetails.applications[i].userId == Meteor.userId()) {
                            applied = true;
                            break;
                        }
                    }
                }
                if(applied)
                    return '<span class="jobAppliedTick"><i class="fa fa-check-circle fa-2x"></i></span>';
                return '<a href="/jobs/' + jobDetails._id + '" class="btn btn-sm btn-primary">Apply</a>';
            }
        }
    ],
    responsive: true
}

Template.recommendedJobs.helpers({
    recommendedJobs: function() {
        return recommendedJobs;
    },
    recommendedJobsOptions: recommendedJobsObject
})