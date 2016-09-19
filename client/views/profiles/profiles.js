Template.profiles.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Profiles,
        publication: 'profiles'
    });
});

var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['title', 'name', 'location'];

ProfileSearch = new SearchSource('providerList', fields, options);

Template.profiles.helpers({
    profilesList: function() {
        return ProfileSearch.getData({}, {sort: {createdAt: -1}});
    }
});

Template.profiles.rendered = function() {
    ProfileSearch.search('');
}

Template.profiles.events({
    'keyup #search-box': _.throttle(function(e) {
        var text = $(e.target).val().trim();
        ProfileSearch.search(text);
    }, 200)
})