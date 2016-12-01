Template.dispatchers.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Dispatchers,
        publication: 'dispatchers'
    });
});

Template.dispatchers.helpers({
    dispatcherList: function() {
        if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
            return Dispatchers.find({invitedBy: Meteor.userId()});
        } else if(Roles.userIsInRole(Meteor.userId(), ['dispatcher', 'accountant']))
            return Dispatchers.find({invitedBy: Meteor.user().invitedBy})
    }
});