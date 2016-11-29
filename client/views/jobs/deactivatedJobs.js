Template.deactivatedJobs.helpers({
	deactivatedJobs: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {status: 'deactivated'}]});
	},
	postedJobCount: function() {
		return Jobs.find({userId: Meteor.userId()}).count();
	},
	buyerInvitedCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {invited: true}, {status: 'active'}]}).count();
	},
	buyerAssignedCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}, {status: 'active'}]}).count();
	},
	deactivatedCount: function() {
	    return Jobs.find({$and: [{userId: Meteor.userId()}, {status: 'deactivated'}]}).count();
	},
	buyerOpenCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'},{status: 'active'}]}).count();
	},
	buyerPaidCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}, {buyerArchived: false}]}).count();
	},
	buyerRoutedCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {routed: true}, {applicationStatus: 'frozen'}, {status: 'active'}]}).count();
	}
})