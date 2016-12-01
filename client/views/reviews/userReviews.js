Template.userReviews.helpers({
	userReviews: function() {
		if(Roles.userIsInRole(this.userId, ['buyer', 'dispatcher'])) {
			var reviews = Reviews.find({$and: [{buyerId: this.userId}, {reviewedBy: 'provider'}]});
			var userReviews = [];
			reviews.forEach(function(review) {
				var providerDetails = Profiles.findOne({userId: review.providerId});
				var review = {
					reviewedJobId: review.reviewedJobId,
					reviewerName: providerDetails.firstName + ' ' + providerDetails.lastName,
					pointsRated: review.pointsRated,
					reviewMessage: review.reviewMessage,
					reviewedAt: moment(review.reviewedAt).format('LLLL')
				}
				userReviews.push(review);
			});
			return userReviews;
		}
		if(Roles.userIsInRole(this.userId, ['provider'])) {
			var reviews = Reviews.find({$and: [{providerId: this.userId}, {reviewedBy: 'buyer'}]});
			var userReviews = [];
			reviews.forEach(function(review) {
				var buyerDetails;
				if(Roles.userIsInRole(review.buyerId, ['buyer']))
					buyerDetails = Buyers.findOne({userId: review.buyerId});
				else if(Roles.userIsInRole(review.buyerId, ['dispatcher']))
					buyerDetails = Dispatchers.findOne({userId: review.buyerId});
				var review = {
					reviewedJobId: review.reviewedJobId,
					reviewerName: buyerDetails.firstName + ' ' + buyerDetails.lastName,
					pointsRated: review.pointsRated,
					reviewMessage: review.reviewMessage,
					reviewedAt: moment(review.reviewedAt).format('LLLL')
				}
				userReviews.push(review);
			});
			return userReviews;
		}
	},
	jobDetails: function(jobId) {
		return Jobs.findOne({_id: jobId});
	}
})

Template.userReviews.rendered = function() {
	this.$('.rateit').rateit()
}