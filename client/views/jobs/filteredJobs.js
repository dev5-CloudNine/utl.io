Template.filteredJobs.helpers({
    filteredJobs: function () {
    	var category = Router.current().params.category;
        return Jobs.find({$and: [{jobtype: {$in: [category]}}, {applicationStatus: 'open'}]}, {sort: {createdAt: -1}}).fetch();
    }
});
