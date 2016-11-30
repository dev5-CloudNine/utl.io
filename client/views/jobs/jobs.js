Template.jobs.onCreated(function() {
    this.infiniteScroll({
        perPage: 30,
        subManager: subs,
        collection: Jobs,
        publication: 'jobs'
    });
});

Template.jobs.helpers({
    openJobs: function() {
        return Jobs.find({$and: [{invited: false}, {$or: [{applicationStatus: 'open'}, {applicationStatus: 'frozen'}]}]}, {
            sort: {createdAt: -1}
        });
    }
});