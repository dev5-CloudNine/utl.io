Template.myJobs.helpers({
	buyerJobs: function() {
		return Jobs.find({userId: Meteor.userId()}, {sort: {createdAt: -1}});
		// return BuyerJobsSearch.getData({userId: Meteor.userId()}, {sort: {createdAt: -1}});
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
	buyerPaidCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}, {status: 'active'}, {buyerArchived: false}]}).count();
	},
	buyerRoutedCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {routed: true}, {applicationStatus: 'frozen'}, {status: 'active'}]}).count();
	}
});