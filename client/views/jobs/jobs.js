// Template.jobs.onCreated(function() {
//     this.infiniteScroll({
//         perPage: 30,
//         subManager: subs,
//         collection: Jobs,
//         publication: 'jobs'
//     });
// });

// Template.jobs.helpers({
//     "jobs": function() {
//         return Jobs.find({}, {
//             sort: {
//                 createdAt: -1
//             }
//         });
//     },
//     jobIndex: function() {
//         return JobsIndex;
//     }
// })

var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['title', 'location', 'jobtype', 'jobSubCategory', 'servicelocation'];

PackageSearch = new SearchSource('openJobs', fields, options);

Template.searchResult.helpers({
    openJobs: function() {
        return PackageSearch.getData({
            sort: {createdAt: -1}
        });
    }
});

Template.searchResult.rendered = function() {
    PackageSearch.search('');
};

Template.searchBox.events({
    'keyup #search-box': _.throttle(function(e) {
        var text = $(e.target).val().trim();
        PackageSearch.search(text);
    }, 200)
})