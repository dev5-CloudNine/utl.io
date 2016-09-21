var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['title', 'location', 'jobtype', 'jobSubCategory', 'servicelocation', 'readableID'];

BuyerOpenJobsSearch = new SearchSource('buyerOpenJobs', fields, options);

Template.buyerOpenJobs.events({
	'keyup #search-box': _.throttle(function(e) {
		var text = $('#search-box').val().trim();
		BuyerOpenJobsSearch.search(text);
	}, 200)
})

Template.buyerOpenJobs.rendered = function() {
	BuyerOpenJobsSearch.search('');
}

Template.buyerOpenJobs.helpers({
	buyerOpenJobs: function () {
		return BuyerOpenJobsSearch.getData({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'}]}, {$sort: {createdAt: -1}});
	},
	buyerOpenCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'}]}).count();
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
	buyerPaymentPendingCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {'applicationStatus': 'pending_payment'}]}).count();
	},
	buyerPaidCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}]}).count();
	}
});
