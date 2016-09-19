Template.buyers.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Buyers,
        publication: 'buyers'
    });
});

var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['title', 'name', 'location'];

BuyerSearch = new SearchSource('buyersList', fields, options);

Template.buyers.helpers({
    buyersList: function() {
        return BuyerSearch.getData({}, {sort: {createdAt: -1}});
    }
});

Template.buyers.rendered = function() {
    BuyerSearch.search('');
}

Template.buyers.events({
    'keyup #search-box': _.throttle(function(e) {
        var text = $(e.target).val().trim();
        BuyerSearch.search(text);
    }, 200)
})