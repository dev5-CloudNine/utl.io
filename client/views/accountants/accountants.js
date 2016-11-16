Template.accountants.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Accountants,
        publication: 'accountants'
    });
});

var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['title', 'name', 'location'];

AccountantSearch = new SearchSource('accountantsList', fields, options);

Template.accountants.helpers({
    accountantList: function() {
        return AccountantSearch.getData({}, {sort: {createdAt: -1}});
    }
});

Template.accountants.rendered = function() {
    AccountantSearch.search('');
}

Template.accountants.events({
    'keyup #search-box': _.throttle(function(e) {
        var text = $(e.target).val().trim();
        AccountantSearch.search(text);
    }, 200)
})