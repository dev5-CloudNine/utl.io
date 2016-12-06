Template.recommendedJobs.onCreated(function() {
    var instance = this;
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(10);
    instance.autorun(function() {
        var limit = instance.limit.get();
        var subscription = instance.subscribe('jobs', limit);
        if(subscription.ready()) {
            instance.loaded.set(limit);
        }
    });
    instance.jobs = function() {
    	var jobCategories = Profiles.findOne({userId: Meteor.userId()}).industryTypes;
        return Jobs.find({$and: [{applicationStatus: 'open'}, {jobSubCategory: {$in: jobCategories}}]}, {sort: {createdAt: -1}, limit: instance.loaded.get()});
    }
});

Template.recommendedJobs.helpers({
	recommendedJobs: function () {		
		return Template.instance().jobs();
	},
    hasMoreJobs: function() {
        return Template.instance().jobs().count() >= Template.instance().limit.get();
    }
});

Template.recommendedJobs.events({
    'click .load-more': function(event, instance) {
        event.preventDefault();
        var limit = instance.limit.get();
        limit += 10;
        instance.limit.set(limit);
    }
})