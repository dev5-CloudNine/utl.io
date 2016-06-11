Template.subcategoryProfiles.helpers({
	subcategoryProfiles: function() {
		return Profiles.find({industryTypes: {$in: [Router.current().params.subcategory]}});
	}
})