Template.subCategoryJobs.helpers({
	subCategoryJobs: function () {
		return Jobs.find({jobSubCategory: {$in: [Router.current().params.subcategory]}});
	}
});