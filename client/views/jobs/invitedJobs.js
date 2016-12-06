Template.invitedJobs.onCreated(function() {
    var instance = this;
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(10);
    instance.jobs = function() {
        var invJobIds = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
		var invitedJobs = [];
		if(invJobIds) {
			for(var i = invJobIds.length - 1; i>=invJobIds.length - instance.limit.get(); i-- ) {
				if(i<0)
					break;
				invitedJobs.push(Jobs.findOne({_id: invJobIds[i]}));
			}
		}
		return invitedJobs;
    }
});

Template.invitedJobs.helpers({
	invitedJobs: function () {
		return Template.instance().jobs();
	},
    hasMoreJobs: function() {
    	var invJobIds = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
    	if(invJobIds)
    		invJobsLength = invJobIds.length;
    	else
    		invJobsLength = 0;
        return Template.instance().limit.get() < invJobsLength;
    }
});

Template.invitedJobs.events({
    'click .load-more': function(event, instance) {
        event.preventDefault();
        var limit = instance.limit.get();
        limit += 10;
        instance.limit.set(limit);
    }
})