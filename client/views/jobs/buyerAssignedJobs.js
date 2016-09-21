var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['title', 'location', 'jobtype', 'jobSubCategory', 'servicelocation', 'readableID'];

BuyerAssignedJobsSearch = new SearchSource('buyerAssignedJobs', fields, options);

Template.buyerAssignedJobs.events({
	'keyup #search-box': _.throttle(function(e) {
		var text = $('#search-box').val().trim();
		BuyerAssignedJobsSearch.search(text);
	}, 200)
})

Template.buyerAssignedJobs.rendered = function() {
	BuyerAssignedJobsSearch.search('');
}

Template.buyerAssignedJobs.helpers({
	buyerAssignedJobs: function() {
		return BuyerAssignedJobsSearch.getData({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}]});
	},
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