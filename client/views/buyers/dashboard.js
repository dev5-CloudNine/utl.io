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
	},
	appliedJobs: function() {
		var appliedJobIds = [];
		var appliedJobsArray = [];
		Profiles.findOne({userId: Meteor.userId()}).appliedJobs.forEach(function(jobId) {
			appliedJobIds.push(jobId);
		});
		appliedJobIds.forEach(function(jobId) {
			appliedJobsArray.push(Jobs.findOne({
				_id: jobId
			}));
		});
		return appliedJobsArray;
	},
	favUsers: function() {
		var favUserIds = [];
		var favUserArray = [];
		var userDetails = Meteor.user();
		userDetails.favoriteUsers.forEach(function(favusers) {
			favUserIds.push(favusers);
		});
		favUserIds.forEach(function(id) {
			favUserArray.push(Profiles.findOne({
				_id: id
			}));
		});
		console.log(favUserArray);
		return favUserArray;
	},
	favBuyers: function() {
		var favBuyerIds = [];
		var favBuyerArray = [];
		var userDetails = Meteor.user();
		userDetails.favoriteBuyers.forEach(function(favBuyer) {
			favBuyerIds.push(favBuyer);
		});
		favBuyerIds.forEach(function(id) {
			favBuyerArray.push(Buyers.findOne({
				_id: id
			}));
		});
		console.log(favBuyerArray);
		return favBuyerArray;
	}
});