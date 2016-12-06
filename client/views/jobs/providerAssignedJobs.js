Template.providerAssignedJobs.onCreated(function() {
    var instance = this;
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(10);
    instance.jobs = function() {
        var assignedJobIds = Profiles.findOne({userId: Meteor.userId()}).assignedJobs;
		var assignedJobs = [];
		if(assignedJobIds) {
			for(var i = assignedJobIds.length - 1; i>=assignedJobIds.length - instance.limit.get(); i-- ) {
				if(i<0)
					break;
				assignedJobs.push(Jobs.findOne({_id: assignedJobIds[i]}));
			}
		}
		return assignedJobs;
    }
});

Template.providerAssignedJobs.helpers({
	providerAssignedJobs: function() {
		var assignedJobIds = Profiles.findOne({userId: Meteor.userId()}).assignedJobs;
		var assignedJobs = [];
		if(assignedJobIds) {
			for(var i = assignedJobIds.length - 1; i >= 0; i--) {
				assignedJobs.push(Jobs.findOne({_id: assignedJobIds[i]}));
			}
			return assignedJobs;
		}
	},
    hasMoreJobs: function() {
    	var assignedJobIds = Profiles.findOne({userId: Meteor.userId()}).assignedJobs;
    	if(assignedJobIds)
    		assignedJobsLength = assignedJobIds.length;
    	else
    		assignedJobsLength = 0;
        return Template.instance().limit.get() < assignedJobsLength;
    }
})

Template.providerAssignedJobs.events({
    'click .load-more': function(event, instance) {
        event.preventDefault();
        var limit = instance.limit.get();
        limit += 10;
        instance.limit.set(limit);
    }
})
