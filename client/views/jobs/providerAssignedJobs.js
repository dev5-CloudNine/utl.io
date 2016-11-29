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
	providerAllCount: function() {
		var allJobs =  Profiles.findOne({userId: Meteor.userId()}).allJobs;
		if(allJobs) {
			return allJobs.length;
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
		var count = 0;
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
	proPaidJobsCount: function() {
		var paidJobs = Profiles.findOne({userId: Meteor.userId()}).paidJobs;
		if(paidJobs) {
			return paidJobs.length;
		}
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