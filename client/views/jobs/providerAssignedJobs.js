Template.providerAssignedJobs.helpers({
	providerAssignedJobs: function() {
		return Jobs.find({$and: [{"assignedProvider": Meteor.userId()}, {"applicationStatus": "assigned"}]}).fetch()
	}
})