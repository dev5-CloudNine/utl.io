Template.buyers.onCreated(function() {
    console.log(this);
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
    },
    buyerIndex: function() {
        return BuyersIndex;
    }
});