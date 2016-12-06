Template.providerDeactivatedJobs.onCreated(function() {
    var instance = this;
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(10);
    instance.jobs = function() {
        var deactivatedJobIds = Profiles.findOne({userId: Meteor.userId()}).deactivatedJobs;
		var deactivatedJobs = [];
		if(deactivatedJobIds) {
			for(var i = deactivatedJobIds.length - 1; i>=deactivatedJobIds.length - instance.limit.get(); i-- ) {
				if(i<0)
					break;
				deactivatedJobs.push(Jobs.findOne({_id: deactivatedJobIds[i]}));
			}
		}
		return deactivatedJobs;
    }
});

Template.providerDeactivatedJobs.helpers({
	providerDeactivatedJobs: function() {
		return Template.instance().jobs();
	},
    hasMoreJobs: function() {
    	var deactivatedJobIds = Profiles.findOne({userId: Meteor.userId()}).deactivatedJobs;
    	if(deactivatedJobIds)
    		allJobsLength = deactivatedJobIds.length;
    	else
    		allJobsLength = 0;
        return Template.instance().limit.get() < allJobsLength;
    }
})

Template.providerDeactivatedJobs.events({
    'click .load-more': function(event, instance) {
        event.preventDefault();
        var limit = instance.limit.get();
        limit += 10;
        instance.limit.set(limit);
    }
})