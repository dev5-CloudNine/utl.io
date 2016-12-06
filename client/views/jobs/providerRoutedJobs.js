Template.providerRoutedJobs.onCreated(function() {
    var instance = this;
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(10);
    instance.jobs = function() {
        var routedJobIds = Profiles.findOne({userId: Meteor.userId()}).routedJobs;
		var routedJobs = [];
		if(routedJobIds) {
			for(var i = routedJobIds.length - 1; i>=routedJobIds.length - instance.limit.get(); i-- ) {
				if(i<0)
					break;
				routedJobs.push(Jobs.findOne({_id: routedJobIds[i]}));
			}
		}
		return routedJobs;
    }
});

Template.providerRoutedJobs.helpers({
	providerRoutedJobs: function() {
		return Template.instance().jobs();
	},
    hasMoreJobs: function() {
    	var routedJobIds = Profiles.findOne({userId: Meteor.userId()}).routedJobs;
    	if(routedJobIds)
    		routedJobsLength = routedJobIds.length;
    	else
    		routedJobsLength = 0;
        return Template.instance().limit.get() < routedJobsLength;
    }
})

Template.providerRoutedJobs.events({
    'click .load-more': function(event, instance) {
        event.preventDefault();
        var limit = instance.limit.get();
        limit += 10;
        instance.limit.set(limit);
    }
})