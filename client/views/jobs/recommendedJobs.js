Template.recommendedJobs.helpers({
	recommendedJobs: function () {
		var jobCategories = Profiles.findOne({userId: Meteor.userId()}).industryTypes;
		return Jobs.find({jobSubCategory: {$in: jobCategories}}, {sort: {createdAt: -1}}).fetch();
	}
});