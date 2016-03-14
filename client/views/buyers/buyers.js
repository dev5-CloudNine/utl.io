Template.buyerProfiles.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Buyers,
        publication: 'buyers'
    });
});

Template.buyerProfiles.helpers({
    "buyers": function() {
        return Buyers.find({}, {
            sort: {
                randomSorter: 1
            }
        });
    }
})
