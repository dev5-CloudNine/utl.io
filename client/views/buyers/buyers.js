Template.buyers.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Buyers,
        publication: 'buyers'
    });
});

Template.buyers.helpers({
    "buyers": function() {
        return Buyers.find({}, {
            sort: {
                createdAt: -1
            }
        });
    }
});