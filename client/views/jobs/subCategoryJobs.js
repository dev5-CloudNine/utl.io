Template.subCategoryJobs.helpers({
	subCategoryJobs: function () {
		return Jobs.find({$and: [{jobSubCategory: {$in: [subCategory]}}, {applicationStatus: 'open'}]}, {sort: {createdAt: -1}});
	}
});
