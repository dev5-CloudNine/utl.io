Template.providerPaidJobs.helpers({
	providerPaidJobs: function() {
		var paidJobIds = Profiles.findOne({userId: Meteor.userId()}).paidJobs;
		var paidJobs = [];
		if(paidJobIds) {
			for(var i = paidJobIds.length - 1; i >= 0; i--) {
				paidJobs.push(Jobs.findOne({_id: paidJobIds[i]}));
			}
			return paidJobs;
		}
	},
	providerAllCount: function() {
	    var allJobs = Profiles.findOne({userId: Meteor.userId()}).allJobs;
	    if(allJobs)
	    	return allJobs.length;
	    return 0;
  	},
	proPaidJobsCount: function() {
		var paidJobs = Profiles.findOne({userId: Meteor.userId()}).paidJobs;
		if(paidJobs) {
			return paidJobs.length;
		}
		return 0;
	},
	appliedJobsCount: function() {
		var appliedJobs = Profiles.findOne({userId: Meteor.userId()}).appliedJobs;
		if(appliedJobs)
			return appliedJobs.length;
		return 0;
	},
	routedJobsCount: function() {
		var routedJobs = Profiles.findOne({userId: Meteor.userId()}).routedJobs;
		if(routedJobs)
			return routedJobs.length;
		return 0;
	},
	assignedJobsCount: function() {
		var assignedJobs = Profiles.findOne({userId: Meteor.userId()}).assignedJobs;
		if(assignedJobs)
			return assignedJobs.length;
		return 0;
	},
	invitedJobsCount: function() {
		var invJobIds = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
		if(invJobIds) {
			return invJobIds.length;
		}
		return 0;
	},
	proDeactivatedCount: function() {
		var deactivatedJobs = Profiles.findOne({userId: Meteor.userId()}).deactivatedJobs;
		if(deactivatedJobs) {
			return deactivatedJobs.length;
		}
		return 0;
	}
})