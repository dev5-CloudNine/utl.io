Template.reviewProvider.helpers({
	reviewedProvider: function() {
		return Reviews.findOne({$and: [{reviewedJobId: this.jobId}, {buyerId: Meteor.userId()}, {reviewedBy: 'buyer'}]})? true : false;
	},
	providerReviewDetails: function() {
		return Reviews.findOne({$and: [{reviewedJobId: this.jobId}, {buyerId: Meteor.userId()}, {reviewedBy: 'buyer'}]});
	}
});

Template.reviewProvider.events({
	'rated #rateProvider': function(event, template) {
		event.preventDefault();
		Session.set('providerRatingPoints', $(event.target).rateit('value'));
	},
	'submit #reviewProvider': function(event, template) {
		event.preventDefault();
		var jobDetails = Jobs.findOne({_id: this.jobId});
		var providerId = jobDetails.assignedProvider;
		var buyerId = jobDetails.userId;
		var jobId = jobDetails._id;
		var timeReviewed = new Date();
		var ratedPoints = Session.get('providerRatingPoints');
		var reviewMessage = "";
		$('textarea[name="reviewMessage"]').each(function() {
			reviewMessage += $(this).val();
		})
		Meteor.call('reviewProvider', providerId, buyerId, jobId, timeReviewed, ratedPoints, reviewMessage, function(error) {
			if(error) {
				toastr.error('Failed to submit review. Please try again.');
			} else {
				$('#providerReviewPoints').rateit();
				delete Session.keys.providerRatingPoints;
			}
		})
	}
})

Template.reviewProvider.onRendered(function() {
	$('#rateProvider').rateit();
});

Template.reviewBuyer.onRendered(function() {
	$('#rateBuyer').rateit();
});

Template.reviewBuyer.helpers({
	reviewedBuyer: function() {
    	return Reviews.findOne({$and: [{reviewedJobId: this.jobId}, {providerId: Meteor.userId()}, {reviewedBy: 'provider'}]})? true: false;
	},
	buyerReviewDetails: function() {
		return Reviews.findOne({$and: [{reviewedJobId: this.jobId}, {providerId: Meteor.userId()}, {reviewedBy: 'provider'}]});
	}
})

Template.reviewBuyer.events({
	'rated #rateBuyer': function(event, template) {
		event.preventDefault();
		Session.set('buyerRatingPoints', $(event.target).rateit('value'));
	},
	'submit #reviewBuyer': function(event, template) {
		event.preventDefault();
		var jobDetails = Jobs.findOne({_id: this.jobId})
		var providerId = jobDetails.assignedProvider;
		var buyerId = jobDetails.userId;
		var jobId = jobDetails._id;
		var timeReviewed = new Date();
		var ratedPoints = Session.get('buyerRatingPoints');
		var reviewMessage = "";
		$('textarea[name="reviewMessage"]').each(function() {
			reviewMessage += $(this).val();
		})
		Meteor.call('reviewBuyer', providerId, buyerId, jobId, timeReviewed, ratedPoints, reviewMessage, function(error) {
			if(error) {
				toastr.error('Failed to submit review. Please try again.');
			} else {
				$('#buyerReviewPoints').rateit();
				delete Session.keys.buyerRatingPoints;
			}
		});
	}
})