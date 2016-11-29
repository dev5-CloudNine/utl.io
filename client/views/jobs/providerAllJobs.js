Template.providerAllJobs.helpers({
	providerAllJobs: function() {
		var allJobIds = Profiles.findOne({userId: Meteor.userId()}).allJobs;
		var allJobs = [];
		if(allJobIds) {
		    for(var i = allJobIds.length - 1; i >=0; i--) {
		    	allJobs.push(Jobs.findOne({_id: allJobIds[i]}));
		    }
		}
	    return allJobs;
	},
	providerAllCount: function() {
		var allJobIds = Profiles.findOne({userId: Meteor.userId()}).allJobs;
		if(allJobIds)
			return allJobIds.length;
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
		var count = 0;
		if(appliedJobs) {
			for(var i = 0; i < appliedJobs.length; i++)
				count++;
			return count;
		}
		return count;
	},
	routedJobsCount: function() {
		var routedJobs = Profiles.findOne({userId: Meteor.userId()}).routedJobs;
		var count = 0;
		if(routedJobs) {
			for(var i = 0; i < routedJobs.length; i++)
				count++;
			return count;
		}
		return count;
	},
	assignedJobsCount: function() {
	    var count = 0;
	    var assignedJobs = Profiles.findOne({userId: Meteor.userId()}).assignedJobs;
	    if(assignedJobs) {
	      for(var i = 0; i < assignedJobs.length; i++)
	        count++;
	      return count;
	    }
	    return count;
	},
	completedJobsCount: function() {
		var count = 0;
		var completedJobs = Profiles.findOne({userId: Meteor.userId()}).completedJobs;
		if(completedJobs) {
			for(var i = 0; i < completedJobs.length; i++)
				count++;
			return count;
		}
		return count;
	},
	proPaymentJobsCount: function() {
		var count = 0;
		var paymentPendingJobs = Profiles.findOne({userId: Meteor.userId()}).paymentPendingJobs;
		if(paymentPendingJobs) {
			for(var i = 0; i < paymentPendingJobs.length; i++)
				count++;
			return count;
		}
		return count;
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