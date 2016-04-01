Template.dashboard.helpers({
	jobs: function() {
		return Jobs.find({
			userId: Meteor.userId()
		}, {
			sort: {
				createdAt: -1
			}
		});
	},
	buyerProfile: function() {
		return Buyers.find({
			userId: Meteor.userId()
		});
		console.log(buyerProfile);
	},
	favJobs: function() {
		var favJobsIds = [];
		var favJobsArray = [];
		var userDetails = Meteor.user();
		userDetails.favoriteJobs.forEach(function (favjobs) {
			favJobsIds.push(favjobs);
		});
		favJobsIds.forEach(function(id) {
			favJobsArray.push(Jobs.findOne({
				_id: id
			}));
		});
		return favJobsArray;
	}
});