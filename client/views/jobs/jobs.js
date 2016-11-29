Template.jobs.onCreated(function() {
    this.infiniteScroll({
        perPage: 30,
        subManager: subs,
        collection: Jobs,
        publication: 'jobs'
    });
});

var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['title', 'location', 'jobtype', 'jobSubCategory', 'servicelocation', 'readableID'];

// JobSearch = new SearchSource('openJobs', fields, options);

Template.jobs.helpers({
    openJobs: function() {
        return Jobs.find({$and: [{invited: false}, {routed: false}]}, {
            sort: {createdAt: -1}
        })
        // return JobSearch.getData({$and: [{invited: false}, {routed: false}]}, {
        //     sort: {createdAt: -1}
        // });
    }
});

// Template.jobs.rendered = function() {
//     JobSearch.search('');
// };

// Template.jobs.events({
//     'keyup #search-box': _.throttle(function(e) {
//         var text = $(e.target).val().trim();
//         JobSearch.search(text);
//     }, 200)
// })