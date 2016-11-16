Template.dispatchers.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Dispatchers,
        publication: 'dispatchers'
    });
});

var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['title', 'name', 'location'];

DispatcherSearch = new SearchSource('dispatchersList', fields, options);

Template.dispatchers.helpers({
    dispatcherList: function() {
        return DispatcherSearch.getData({}, {sort: {createdAt: -1}});
    }
});

Template.dispatchers.rendered = function() {
    DispatcherSearch.search('');
}

Template.dispatchers.events({
    'keyup #search-box': _.throttle(function(e) {
        var text = $(e.target).val().trim();
        DispatcherSearch.search(text);
    }, 200)
})