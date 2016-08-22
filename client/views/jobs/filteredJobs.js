Template.filteredJobs.helpers({
    filteredJobs: function () {
        return Jobs.find({$and: [{type: {$in: [category]}}, {applicationStatus: 'open'}]}, {sort: {createdAt: -1}});
    }
});
