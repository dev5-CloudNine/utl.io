Template.filteredJobs.helpers({
    filteredJobs: function () {
        return Jobs.find({jobtype: {$in: [Router.current().params.category]}});
    }
});