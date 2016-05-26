Template.invitedJobs.helpers({
	invitedJobs: function () {
		var invJobIds = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
		var invitedJobs = [];
		invJobIds.forEach(function(jobId) {
			console.log(jobId);
			invitedJobs.push(Jobs.findOne({_id: jobId}));
		});
		return invitedJobs;
	}
});