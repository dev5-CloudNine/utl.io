var allJobCategories = function() {
	return Categories.find().fetch();
}

var adminOptionsObject = {
	pageLength: 50,
	columns: [
		{
			title: 'Category',
			data: function(categoryDetails) {
				return '<a href data-id="' + categoryDetails._id + '" data-cat="' + categoryDetails.value + '" id="editCat">' + categoryDetails.value + '</a>';
			}
		},
		{
			title: 'Sub Categories',
			data: function(categoryDetails) {
				var subCategories = SubCategories.find({parentId: categoryDetails.value}).fetch();
				var subCatArray = [];
				subCategories.forEach(function(subCat) {
					subCatArray.push('<a href data-id="' + subCat._id + '" data-parent="' + subCat.parentId + '" data-subcat="' + subCat.value + '" id="editSubCat">' + subCat.value + '</a>');
				})
				return subCatArray.join(' | ');
			}
		}
	]
}

Template.jobCategories.helpers({
	jobCategories: function() {
		return allJobCategories;
	},
	adminOptionsObject: adminOptionsObject,
	parentCategory: function() {
		return Categories.find().fetch();
	}
});

Template.jobCategories.events({
	'click a#editSubCat': function(event, template) {
		var categoryId = $(event.currentTarget).data('id');
		var parentId = $(event.currentTarget).data('parent');
		var subCat = $(event.currentTarget).data('subcat');
		$('select[name="editparentcategory"]').val(parentId);
		$('input[name="editSubCatDetail"]').val(subCat);		
		$('input[name="subCatId"]').val(categoryId);		
		$('#editSubCategoryModal').modal('show');
	},
	'click a#editCat': function(event, template) {
		var categoryDetail = $(event.currentTarget).data('cat');
		var categoryId = $(event.currentTarget).data('id');
		$('input#previousName').val(categoryDetail);
		$('input[name="catEdit"]').val(categoryDetail);
		$('input[name="categoryId"]').val(categoryId);
		$('#editCategoryModal').modal('show');
	},
	'submit #editSubCategory': function(event, template) {
		event.preventDefault();
		var parentCat = $('select[name="editparentcategory"]').val();
		var subCatDet = $('input[name="editSubCatDetail"]').val();
		var subCatId = $('input[name="subCatId"]').val();
		Meteor.call('updateJobSubCategory', parentCat, subCatDet, subCatId, function(err, res) {
			if(err) {
				console.log(err)
			} else {
				$('#editSubCategoryModal').modal('hide');
			}
		})
	},
	'submit #editCategory': function(event, template) {
		event.preventDefault();
		var prevName = $('input#previousName').val();
		var categoryId = $('input[name="categoryId"]').val();
		var categoryName = $('input[name="catEdit"]').val();
		Meteor.call('updateJobCategory', prevName, categoryId, categoryName, function(err, res) {
			if(err) {
				console.log(err);
			} else {
				$('#editCategoryModal').modal('hide');
			}
		})
	}
})

Template.addCategory.events({
	'submit #addJobCategory': function(event, template) {
		event.preventDefault();
		var categorydetail = $('input[name="categoryDetail"]').val();
		Meteor.call("addJobCategory", categorydetail, function(err, res) {
			if(err) {
				console.log(err)
			} else {
				$('input[name="categoryDetail"]').val('');
			}
		});
	}
})

Template.addSubCategory.helpers({
	parentCategory: function() {
		return Categories.find().fetch();
	}
});

Template.addSubCategory.events({
	'submit #addSubCategory': function(event, template) {
		event.preventDefault();
		var categoryDetail = $('select[name="parentcategory"]').val();
		var subCategoryDetail = $('input[name="subCatDetail"]').val();
		Meteor.call('addJobSubCategory',categoryDetail, subCategoryDetail, function(err, res) {
			if(err) {
				console.log(err);
			} else {
				$('input[name="subCatDetail"]').val('')
			}
		})
	}
})