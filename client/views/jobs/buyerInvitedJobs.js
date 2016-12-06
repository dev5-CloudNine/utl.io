Template.buyerInvitedJobs.onCreated(function() {
    var instance = this;
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(10);
    instance.autorun(function() {
        var limit = instance.limit.get();
        var subscription = instance.subscribe('my_jobs', limit);
        if(subscription.ready()) {
            instance.loaded.set(limit);
        }
    });
    instance.jobs = function() {
        return Jobs.find({$and: [{userId: Meteor.userId()}, {invited: true}, {applicationStatus: 'open'}]}, {sort: {createdAt: -1}, limit: instance.loaded.get()});
    }
});

Template.buyerInvitedJobs.helpers({
	buyerInvitedJobs: function() {
		return Template.instance().jobs();
	},
    hasMoreJobs: function() {
        return Template.instance().jobs().count() >= Template.instance().limit.get();
    }
})

Template.buyerInvitedJobs.events({
    'click .load-more': function(event, instance) {
        event.preventDefault();
        var limit = instance.limit.get();
        limit += 10;
        instance.limit.set(limit);
    }
})