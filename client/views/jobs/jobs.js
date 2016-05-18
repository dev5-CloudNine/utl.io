Template.jobs.onCreated(function() {
    this.infiniteScroll({
        perPage: 30,
        subManager: subs,
        collection: Jobs,
        publication: 'jobs'
    });
});

Template.jobs.helpers({
    "jobs": function() {
        return Jobs.find({}, {
            sort: {
                createdAt: -1
            }
        });
    },
    jobIndex: function() {
        return JobsIndex;
    }
})
