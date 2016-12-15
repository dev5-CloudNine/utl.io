// Template.buyerPaidJobs.onCreated(function() {
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
//         return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}, {buyerArchived: false}, {status: 'active'}]}, {sort: {createdAt: -1}, limit: instance.loaded.get()});
//     }
// });

// Template.buyerPaidJobs.helpers({
// 	buyerPaidJobs: function() {
// 		return Template.instance().jobs();
// 	},
//     hasMoreJobs: function() {
//         return Template.instance().jobs().count() >= Template.instance().limit.get();
//     }
// });

// Template.buyerPaidJobs.events({
//     'click .load-more': function(event, instance) {
//         event.preventDefault();
//         var limit = instance.limit.get();
//         limit += 10;
//         instance.limit.set(limit);
//     }
// })

var paidJobs = function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}, {status: 'active'}]}).fetch();
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
                var returnText = '<small>Job approved. Provider\'s account credited.</small>';
                var reviewed = false;
                if(Reviews.findOne({$and: [{reviewedJobId: jobDetails._id}, {buyerId: Meteor.userId()}, {reviewedBy: 'buyer'}]}))
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

Template.buyerPaidJobs.helpers({
    paidJobs: function() {
        return paidJobs;
    },
    paidJobsOptions: paidJobsOptions
})