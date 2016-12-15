// Template.buyerPendingApprovalJobs.onCreated(function() {
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
//         return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}, {assignmentStatus: 'submitted'}, {status: 'active'}]}, {sort: {createdAt: -1}, limit: instance.loaded.get()});
//     }
// });

// Template.buyerPendingApprovalJobs.helpers({
// 	buyerPendingApprovalJobs: function() {
// 		return Template.instance().jobs();
// 	},
// 	hasMoreJobs: function() {
//         return Template.instance().jobs().count() >= Template.instance().limit.get();
//     }
// })

// Template.buyerPendingApprovalJobs.events({
//     'click .load-more': function(event, instance) {
//         event.preventDefault();
//         var limit = instance.limit.get();
//         limit += 10;
//         instance.limit.set(limit);
//     }
// })

var pendingApproval = function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}, {assignmentStatus: 'submitted'}, {status: 'active'}]}).fetch();
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
                return '<span class="budgetFont">' + jobDetails.projectBudget + '</span>'
            },
            width: '20%',
            responsivePriority: 2
        },
        {
            title: 'Actions',
            width: '20%',
            data: function(jobDetails) {
                var returnText;
                if(jobDetails.assignmentStatus == 'submitted') {
                    var returnText = '<small>Job submittted. Approve or reject. Upon approval, the provider\'s account will be credited with ' + jobDetails.projectBudget + ' USD. Ensure that all the tasks and timesheets are upto your mark.</small>'
                }
                return returnText + '<br><button data-job-id="' + jobDetails._id + '" data-provider-id="' + jobDetails.assignedProvider + '" class="margin-top-5 btn btn-primary btn-sm approveAssignment">Approve.</button>&nbsp;<button data-job-id="' + jobDetails._id + '" class="margin-top-5 btn btn-primary btn-sm rejectAssignment">Reject</button>';
            }
        }
    ],
    responsive: true
}

Template.buyerPendingApprovalJobs.helpers({
    pendingApproval: function() {
        return pendingApproval;
    },
    pendingApprovalOptions: pendingApprovalOptions
})

Template.buyerPendingApprovalJobs.events({
    'click .approveAssignment': function(event, template) {
        event.preventDefault();
        var jobId = $(event.currentTarget).data('job-id');
        var providerId = $(event.currentTarget).data('provider-id');
        Meteor.call('approveAssignment', jobId, providerId, function(error) {
            if(error) {
                toastr.error('Failed to approve assignment. Please try again.');
            }
        });
    },
    'click .rejectAssignment': function(event, template) {
        var jobId = $(event.currentTarget).data('job-id');
        Meteor.call('rejectAssignment', jobId, function(error) {
            if(error) {
                toastr.error('Failed to reject assignment. Please try again.');
            }
        });
    }
})