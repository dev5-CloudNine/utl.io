Template.myJobs.helpers({
	buyerPaymentPendingCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {'applicationStatus': 'pending_payment'}]}).count();
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
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'completed'}]}).count();
	},
	deactivatedCount: function() {
	    return Jobs.find({$and: [{userId: Meteor.userId()}, {status: 'deactivated'}]}).count();
	},
	buyerOpenCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'}]}).count();
	},
	buyerPaidCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}]}).count();
	}
})