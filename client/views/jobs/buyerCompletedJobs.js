Template.buyerCompletedJobs.helpers({
	buyerCompletedJobs: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'done'}]}).fetch();
	},
	postedJobCount: function() {
		return Jobs.find({userId: Meteor.userId()}).count();
	},
	buyerRoutedCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {routed: true}]}).count();
	},
	buyerAssignedCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}]}).count();
	},
	buyerCompletedCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'done'}, {assignmentStatus: 'paid'}]}).count();
	},
	buyerPaymentPendingCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {'applicationStatus': 'pending_payment'}]}).count();
	},
	deactivatedCount: function() {
	    return Jobs.find({$and: [{userId: Meteor.userId()}, {status: 'deactivated'}]}).count();
	}
})