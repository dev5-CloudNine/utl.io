Template.providerPaidJobs.onCreated(function() {
    var instance = this;
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(10);
    instance.jobs = function() {
        var paidJobIds = Profiles.findOne({userId: Meteor.userId()}).paidJobs;
		var paidJobs = [];
		if(paidJobIds) {
			for(var i = paidJobIds.length - 1; i>=paidJobIds.length - instance.limit.get(); i-- ) {
				if(i<0)
					break;
				paidJobs.push(Jobs.findOne({_id: paidJobIds[i]}));
			}
		}
		return paidJobs;
    }
});

Template.providerPaidJobs.helpers({
	providerPaidJobs: function() {
		return Template.instance().jobs();
	},
    hasMoreJobs: function() {
    	var paidJobIds = Profiles.findOne({userId: Meteor.userId()}).paidJobs;
    	if(paidJobIds)
    		allJobsLength = paidJobIds.length;
    	else
    		allJobsLength = 0;
        return Template.instance().limit.get() < allJobsLength;
    }
})

Template.providerPaidJobs.events({
    'click .load-more': function(event, instance) {
        event.preventDefault();
        var limit = instance.limit.get();
        limit += 10;
        instance.limit.set(limit);
    }
})