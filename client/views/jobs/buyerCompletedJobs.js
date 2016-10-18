var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['title', 'location', 'jobtype', 'jobSubCategory', 'servicelocation', 'readableID'];

BuyerCompletedJobsSearch = new SearchSource('buyerCompletedJobs', fields, options);

Template.buyerCompletedJobs.events({
	'keyup #search-box': _.throttle(function(e) {
		var text = $('#search-box').val().trim();
		BuyerCompletedJobsSearch.search(text);
	}, 200)
})

Template.buyerCompletedJobs.rendered = function() {
	BuyerCompletedJobsSearch.search('');
}

Template.buyerCompletedJobs.helpers({
	buyerCompletedJobs: function() {
		return BuyerCompletedJobsSearch.getData({$and: [{userId: Meteor.userId()}, {applicationStatus: 'completed'}]});
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
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}, {buyerArchived: false}]}).count();
	}
})