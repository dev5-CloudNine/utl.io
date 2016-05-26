Template.profilesRecent.helpers({
	profiles: function () {
		return Profiles.find({}, {sort: {createdAt: -1}})
	}
});