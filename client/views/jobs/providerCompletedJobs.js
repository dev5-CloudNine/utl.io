Template.providerCompletedJobs.helpers({
	providerCompletedJobs: function() {
		return Jobs.find({$and: [{assignedProvider: Meteor.userId()}, {applicationStatus: 'done'}, {assignmentStatus: 'paid'}]}).fetch();
	}
})