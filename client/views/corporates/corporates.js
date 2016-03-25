Template.corporates.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Buyers,
        publication: 'corporates'
    });
});

Template.corporates.helpers({
    "corporates": function() {
        return Corporates.find({}, {
            sort: {
                randomSorter: 1
            }
        });
    }
})
