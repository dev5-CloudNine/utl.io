Template.buyerRoutedJobs.onCreated(function() {
    var instance = this;
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(100);
    instance.autorun(function() {
        var limit = instance.limit.get();
        var subscription = instance.subscribe('my_jobs', limit);
        if(subscription.ready()) {
            instance.loaded.set(limit);
        }
    });
    instance.jobs = function() {
        return Jobs.find({$and: [{userId: Meteor.userId()}, {routed: true}, {applicationStatus: 'frozen'}, {status: 'active'}]}, {sort: {createdAt: -1}, limit: instance.loaded.get()});
    }
});

Template.buyerRoutedJobs.helpers({
	buyerRoutedJobs: function() {
		return Template.instance().jobs();
	},
    hasMoreJobs: function() {
        return Template.instance().jobs().count() >= Template.instance().limit.get();
    }
})

Template.buyerRoutedJobs.events({
    'click .load-more': function(event, instance) {
        event.preventDefault();
        var limit = instance.limit.get();
        limit += 10;
        instance.limit.set(limit);
    }
})