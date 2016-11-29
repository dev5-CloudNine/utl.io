Template.buyerOpenJobs.helpers({
	buyerOpenJobs: function () {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'}]}, {$sort: {createdAt: -1}});
	},
	buyerOpenCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'}]}).count();
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
	buyerPaidCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}, {status: 'active'}, {buyerArchived: false}]}).count();
	},
	buyerRoutedCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {routed: true}, {applicationStatus: 'frozen'}, {status: 'active'}]}).count();
	}
});
