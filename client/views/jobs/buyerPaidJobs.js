Template.buyerPaidJobs.helpers({
	buyerPaidJobs: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}, {buyerArchived: false}, {status: 'active'}]});
		// return BuyerPaidJobsSearch.getData({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}, {buyerArchived: false}]}, {sort: {createdAt: -1}});
	},
	buyerPaidCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}, {buyerArchived: false}]}).count();
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
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'}, {status: 'active'}]}).count();
	},
	buyerRoutedCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {routed: true}, {applicationStatus: 'frozen'}, {status: 'active'}]}).count();
	}
})