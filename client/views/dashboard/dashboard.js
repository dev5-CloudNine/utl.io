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
		Buyers.findOne({userId: Meteor.userId()}).ongoingJobs.forEach(function(ongoingJob) {
			jobIds.push(ongoingJob);
		});

		return Jobs.find({_id: {$in:jobIds}},{sort: {createdAt: -1}});
	},
	buyerProfile: function() {
		return Buyers.find({
			userId: Meteor.userId()
		});
	},
	providerProfile: function() {
		return Profiles.findOne({userId: Meteor.userId()});
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
		return Jobs.find({_id: {$in:favJobsIds}},{sort: {createdAt: -1}});
	},
	appliedJobs: function() {
		var appliedJobIds = [];
		var appliedJobsArray = [];
		Profiles.findOne({userId: Meteor.userId()}).appliedJobs.forEach(function(jobId) {
			appliedJobIds.push(jobId);
		});
		return Jobs.find({_id: {$in:appliedJobIds}},{sort: {createdAt: -1}});
	},
	ongoingJobs: function() {
		var providerJobs = [];
		var confirmedJobs = [];
		Profiles.findOne({userId: Meteor.userId()}).ongoingJobs.forEach(function(ongoingJob) {
			providerJobs.push(ongoingJob);
		});
		Jobs.find({_id: {$in:providerJobs}},{sort: {createdAt: -1}}).map(function(job){
			job.display = false;
			confirmedJobs.push(job);
		});
		return confirmedJobs;
	},
	providerRoutedJobs: function() {
		var routedJobIds = [];
		Profiles.findOne({userId: Meteor.userId()}).routedJobs.forEach(function(jobId) {
			routedJobIds.push(jobId);
		})
		return Jobs.find({_id: {$in:routedJobIds}},{sort: {createdAt: -1}});
	},
	buyerRoutedJobs: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {routed: true}]}, {sort: {createdAt: -1}});
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
	},
	providerCompletedJobs: function() {
		return Jobs.find({$and: [{assignedProvider: Meteor.userId()}, {applicationStatus: 'done'}, {assignmentStatus: 'approved'}]}).fetch();
	},
	buyerCompletedJobs: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'done'}]}).fetch();
	}
});