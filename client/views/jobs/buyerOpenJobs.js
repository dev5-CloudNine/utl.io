// Template.buyerOpenJobs.onCreated(function() {
//     var instance = this;
//     instance.loaded = new ReactiveVar(0);
//     instance.limit = new ReactiveVar(100);
//     instance.autorun(function() {
//         var limit = instance.limit.get();
//         var subscription = instance.subscribe('my_jobs', limit);
//         if(subscription.ready()) {
//             instance.loaded.set(limit);
//         }
//     });
//     instance.jobs = function() {
//         return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'}]}, {sort: {createdAt: -1}, limit: instance.loaded.get()});
//     }
// });

// Template.buyerOpenJobs.helpers({
// 	buyerOpenJobs: function () {
// 		return Template.instance().jobs();
// 	},
//     hasMoreJobs: function() {
//         return Template.instance().jobs().count() >= Template.instance().limit.get();
//     }
// });

// Template.buyerOpenJobs.events({
//     'click .load-more': function(event, instance) {
//         event.preventDefault();
//         var limit = instance.limit.get();
//         limit += 10;
//         instance.limit.set(limit);
//     }
// })

var openJobs = function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'}]}).fetch();
}

var openJobsOptions = {
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
                return '<a href="/jobs/' + jobDetails._id + '" class="btn btn-sm btn-primary">View Applications</a>';
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