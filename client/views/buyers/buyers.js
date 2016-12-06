Template.buyers.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Buyers,
        publication: 'buyers'
    });
});

Template.buyers.helpers({
    buyersList: function() {
        return Buyers.find({}, {sort: {createdAt: -1}}).fetch();
    }
});