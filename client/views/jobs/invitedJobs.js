Template.invitedJobs.helpers({
	invitedJobs: function () {
		var invJobIds = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
		var invitedJobs = [];
		if(invJobIds) {
			for(var i = invJobIds.length - 1; i>=0; i-- ) {
				invitedJobs.push(Jobs.findOne({_id: invJobIds[i]}));
			}
		}
		return invitedJobs;
	},
	providerAllCount: function() {
	    var count = 0;
	    var providerDetails = Profiles.findOne({userId: Meteor.userId()})
	    var appliedJobs = providerDetails.appliedJobs;
	    var routedJobs = providerDetails.routedJobs;
	    var assignedJobs = providerDetails.assignedJobs;
	    var completedJobs = providerDetails.completedJobs;
	    var paymentPendingJobs = providerDetails.paymentPendingJobs;
	    var paidJobs = providerDetails.paidJobs;
	    var archivedJobs = providerDetails.archivedJobs;
	    if(appliedJobs)
	    	count += appliedJobs.length;
	    if (routedJobs)
	    	count += routedJobs.length;
	    if (assignedJobs)
	    	count += assignedJobs.length;
	    if (completedJobs)
	    	count += completedJobs.length;
	    if(paymentPendingJobs)
	    	count += paymentPendingJobs.length;
	    if(paidJobs)
	    	count += paidJobs.length;
	  	if(archivedJobs)
	  		count += archivedJobs.length;
	    return count;
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
});