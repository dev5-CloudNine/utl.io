Template.profiles.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Profiles,
        publication: 'profiles'
    });
});
Template.profiles.helpers({
    profilesList: function() {
        return Profiles.find({}, {sort: {createdAt: -1}}).fetch();
    }
});