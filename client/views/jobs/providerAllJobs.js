Template.providerAllJobs.helpers({
	providerAllJobs: function() {
		var allJobIds = [];
		var allJobs = [];
		var providerDetails = Profiles.findOne({userId: Meteor.userId()})
	    var appliedJobs = providerDetails.appliedJobs;
	    var routedJobs = providerDetails.routedJobs;
	    var assignedJobs = providerDetails.assignedJobs;
	    var completedJobs = providerDetails.completedJobs;
	    var paymentPendingJobs = providerDetails.paymentPendingJobs;
	    var paidJobs = providerDetails.paidJobs;
	    var archivedJobs = providerDetails.archivedJobs;
	    if(appliedJobs) {
	    	for(var i = appliedJobs.length - 1; i >= 0; i--) {
	    		allJobIds.push(appliedJobs[i]);
	    	}
	    }
	    if (routedJobs) {
	    	for(var i = routedJobs.length - 1; i >= 0; i--) {
	    		allJobIds.push(routedJobs[i]);
	    	}
	    }
	    if (assignedJobs) {
	    	for(var i = assignedJobs.length - 1; i >= 0; i--) {
	    		allJobIds.push(assignedJobs[i]);
	    	}
	    }
	    if (completedJobs) {
	    	for(var i = completedJobs.length - 1; i >= 0; i--) {
	    		allJobIds.push(completedJobs[i]);
	    	}
	    }
	    if(paymentPendingJobs) {
	    	for(var i = paymentPendingJobs.length - 1; i >= 0; i--) {
	    		allJobIds.push(paymentPendingJobs[i]);
	    	}
	    }
	    if(paidJobs) {
	    	for(var i = paidJobs.length - 1; i >= 0; i--) {
	    		allJobIds.push(paidJobs[i]);
	    	}
	    }
	    if(archivedJobs) {
	    	for(var i = archivedJobs.length - 1; i >= 0; i--) {
	    		allJobIds.push(archivedJobs[i]);
	    	}
	    }
	    allJobIds.forEach(function(jobId) {
	    	allJobs.push(Jobs.findOne({_id: jobId}));
	    });
	    return allJobs;
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
	}
})