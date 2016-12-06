Template.appliedJobs.onCreated(function() {
    var instance = this;
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(10);
    instance.jobs = function() {
        var appliedJobIds = Profiles.findOne({userId: Meteor.userId()}).appliedJobs;
		var appliedJobs = [];
		if(appliedJobIds) {
			for(var i = appliedJobIds.length - 1; i>=appliedJobIds.length - instance.limit.get(); i-- ) {
				if(i<0)
					break;
				appliedJobs.push(Jobs.findOne({_id: appliedJobIds[i]}));
			}
		}
		return appliedJobs;
    }
});

Template.appliedJobs.helpers({
	appliedJobs: function() {
		return Template.instance().jobs();
	},
    hasMoreJobs: function() {
    	var appliedJobIds = Profiles.findOne({userId: Meteor.userId()}).appliedJobs;
    	if(appliedJobIds)
    		appliedJobsLength = appliedJobIds.length;
    	else
    		appliedJobsLength = 0;
        return Template.instance().limit.get() < appliedJobsLength;
    }
})

Template.appliedJobs.events({
    'click .load-more': function(event, instance) {
        event.preventDefault();
        var limit = instance.limit.get();
        limit += 10;
        instance.limit.set(limit);
    }
})
