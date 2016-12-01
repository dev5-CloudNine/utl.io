Template.accountants.onCreated(function() {
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Accountants,
        publication: 'accountants'
    });
});

Template.accountants.helpers({
    accountantList: function() {
        if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
            return Accountants.find({invitedBy: Meteor.userId()});
        } else if(Roles.userIsInRole(Meteor.userId(), ['dispatcher', 'accountant']))
            return Accountants.find({invitedBy: Meteor.user().invitedBy})
    }
});