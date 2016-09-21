var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['title', 'location', 'jobtype', 'jobSubCategory', 'servicelocation', 'readableID'];

BuyerRoutedJobsSearch = new SearchSource('buyerRoutedJobs', fields, options);

Template.buyerRoutedJobs.events({
	'keyup #search-box': _.throttle(function(e) {
		var text = $('#search-box').val().trim();
		BuyerRoutedJobsSearch.search(text);
	}, 200)
})

Template.buyerRoutedJobs.rendered = function() {
	BuyerRoutedJobsSearch.search('');
}

Template.buyerRoutedJobs.helpers({
	buyerRoutedJobs: function() {
		return BuyerRoutedJobsSearch.getData({$and: [{userId: Meteor.userId()}, {routed: true}]}, {sort: {createdAt: -1}});
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
	buyerPaymentPendingCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {'applicationStatus': 'pending_payment'}]}).count();
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