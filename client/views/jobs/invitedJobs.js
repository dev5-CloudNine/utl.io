Template.invitedJobs.helpers({
	invitedJobs: function () {
		var invJobIds = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
		var invitedJobs = [];
		if(invJobIds) {
			invJobIds.forEach(function(jobId) {
				invitedJobs.push(Jobs.findOne({_id: jobId}));
			});
		}
		return invitedJobs;
	}
});