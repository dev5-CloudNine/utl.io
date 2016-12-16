// Template.subCategoryJobs.helpers({
// 	subCategoryJobs: function () {
// 		var subCategory = Router.current().params.subcategory;
// 		return Jobs.find({$and: [{jobSubCategory: {$in: [subCategory]}}, {applicationStatus: 'open'}]}, {sort: {createdAt: -1}}).fetch();
// 	}
// });

var subCategoryJobs = function() {
	var subCategory = Router.current().params.subcategory;
    return Jobs.find({$and: [{invited: false}, {$or: [{applicationStatus: 'open'}, {$and: [{applicationStatus: 'assigned'}, {assignmentStatus: 'not_confirmed'}]}]}, {jobSubCategory: {$in: [subCategory]}}]}).fetch();
}

var subCategoryJobsOptions = {
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
                    return '<span class="jobAppliedTick"><i class="fa fa-check-circle fa-2x"></i></span><br><small>U\'ve applied</small>';
                return '<a href="/jobs/' + jobDetails._id + '" class="btn btn-sm btn-primary">Apply</a>';
            }
        }
    ],
    responsive: true
}

Template.subCategoryJobs.helpers({
    subCategoryJobs: function() {
        return subCategoryJobs;
    },
    subCategoryJobsOptions: subCategoryJobsOptions
})