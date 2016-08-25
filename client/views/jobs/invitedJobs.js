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
	}
});