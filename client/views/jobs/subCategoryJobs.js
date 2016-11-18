Template.subCategoryJobs.helpers({
	subCategoryJobs: function () {
		var subCategory = Router.current().params.subcategory;
		return Jobs.find({$and: [{jobSubCategory: {$in: [subCategory]}}, {applicationStatus: 'open'}]}, {sort: {createdAt: -1}}).fetch();
	}
});
