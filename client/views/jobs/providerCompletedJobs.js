Template.providerCompletedJobs.helpers({
	providerCompletedJobs: function() {
		var completedJobIds = Profiles.findOne({userId: Meteor.userId()}).completedJobs;
		var completedJobs = [];
		if(completedJobIds) {
			for(var i = 0; i < completedJobIds.length; i++) {
				completedJobs.push(Jobs.findOne({_id: completedJobIds[i]}));
			}
			return completedJobs;
		}
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
  }
})