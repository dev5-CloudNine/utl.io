Template.favoriteProfiles.helpers({
	favUsers: function() {
		var favUserArray = [];
		var userDetails = Meteor.user();
		if(userDetails.favoriteUsers) {
			for(var i = userDetails.favoriteUsers.length - 1; i >= 0; i--) {
				favUserArray.push(Profiles.findOne({userId: userDetails.favoriteUsers[i]}));
			}
		}
		return favUserArray;
	},
	'profileIndex': function() {
        return ProfilesIndex;
    }
})