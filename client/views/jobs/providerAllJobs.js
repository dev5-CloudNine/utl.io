Template.providerAllJobs.onCreated(function() {
    var instance = this;
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(10);
    instance.jobs = function() {
        var allJobIds = Profiles.findOne({userId: Meteor.userId()}).allJobs;
		var allJobs = [];
		if(allJobIds) {
			for(var i = allJobIds.length - 1; i>=allJobIds.length - instance.limit.get(); i-- ) {
				if(i<0)
					break;
				allJobs.push(Jobs.findOne({_id: allJobIds[i]}));
			}
		}
		return allJobs;
    }
});

Template.providerAllJobs.helpers({
	providerAllJobs: function() {
		return Template.instance().jobs();
	},
    hasMoreJobs: function() {
    	var allJobIds = Profiles.findOne({userId: Meteor.userId()}).allJobs;
    	if(allJobIds)
    		allJobsLength = allJobIds.length;
    	else
    		allJobsLength = 0;
        return Template.instance().limit.get() < allJobsLength;
    }
})

Template.providerAllJobs.events({
    'click .load-more': function(event, instance) {
        event.preventDefault();
        var limit = instance.limit.get();
        limit += 10;
        instance.limit.set(limit);
    }
})
