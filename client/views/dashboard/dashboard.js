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
	ongoingBuyerJobs: function() {
		var jobIds = [];
		var jobs = [];
		Buyers.findOne({userId: Meteor.userId()}).ongoingJobs.forEach(function(ongoingJob) {
			jobIds.push(ongoingJob);
		});
		jobIds.forEach(function(jobId) {
			jobs.push(Jobs.findOne({_id: jobId}));
		});
		return jobs;
	},
	buyerProfile: function() {
		return Buyers.find({
			userId: Meteor.userId()
		});
	},
	buyerDetails: function() {
		return Buyers.findOne({userId: Meteor.userId()});
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
		Profiles.findOne({userId: Meteor.userId()}).counteredJobs.forEach(function(jobId) {
			appliedJobIds.push(jobId);
		})
		appliedJobIds.forEach(function(jobId) {
			appliedJobsArray.push(Jobs.findOne({
				_id: jobId
			}));
		});
		return appliedJobsArray;
	},
	ongoingJobs: function() {
		var providerJobs = [];
		var confirmedJobs = [];
		Profiles.findOne({userId: Meteor.userId()}).ongoingJobs.forEach(function(ongoingJob) {
			providerJobs.push(ongoingJob);
		});
		providerJobs.forEach(function(providerJob) {
			var obj = Jobs.findOne({_id: providerJob}, {sort: {createdAt: -1}});
			obj.display = false;
			confirmedJobs.push(obj);
		});
		return confirmedJobs;
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
		return favBuyerArray;
	},
	buyerJobsCount: function() {
		return Jobs.find({userId: Meteor.userId()}).fetch().length;
	},
	providerJobsCount: function() {
		var jobCount = Profiles.findOne({userId: Meteor.userId()}).appliedJobs.length + Profiles.findOne({userId: Meteor.userId()}).ongoingJobs.length;
		return jobCount;
	}
});