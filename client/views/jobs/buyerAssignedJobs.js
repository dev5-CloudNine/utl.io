Template.buyerAssignedJobs.helpers({
	buyerAssignedJobs: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}]}).fetch();
	}
})