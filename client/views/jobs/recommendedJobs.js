Template.recommendedJobs.helpers({
	recommendedJobs: function () {
		var jobCategories = Profiles.findOne({userId: Meteor.userId()}).industryTypes;
		Meteor.subscribe('recommendedJobs', jobCategories);
		return Jobs.find({$and: [{applicationStatus: 'open'}, {jobSubCategory: {$in: jobCategories}}]}, {sort: {createdAt: -1}}).fetch();
	}
});