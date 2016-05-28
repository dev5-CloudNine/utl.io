Template.favoriteProfiles.helpers({
	favUsers: function() {
		var favUserIds = [];
		var favUserArray = [];
		var userDetails = Meteor.user();
		userDetails.favoriteUsers.forEach(function(favusers) {
			favUserIds.push(favusers);
		});
		favUserIds.forEach(function(id) {
			favUserArray.push(Profiles.findOne({
				userId: id
			}));
		});
		return favUserArray;
	},
	'profileIndex': function() {
        return ProfilesIndex;
    }
})