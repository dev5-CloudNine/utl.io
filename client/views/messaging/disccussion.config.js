Comments.config({
	generateUsername: function(user) {
		var userName;
		if(Roles.userIsInRole(user._id, ['provider'])) {
			var profile = Profiles.findOne({userId: user._id});
			var userName = profile.firstName + ' ' + profile.lastName;
		}
		if(Roles.userIsInRole(user._id, ['buyer'])) {
			var profile = Buyers.findOne({userId: user._id});
			var userName = profile.firstName + ' ' + profile.lastName;
		}
		if(Roles.userIsInRole(user._id, ['dispatcher'])) {
			var profile = Dispatchers.findOne({userId: user._id});
			var userName = profile.firstName + ' ' + profile.lastName;
		}
		return userName;
	},
	generateAvatar: function(user) {
		if(user.imgURL)
			return user.imgURL;
	}
})
Comments.ui.config({
	limit: 5,
	template: 'bootstrap'

});

Comments.ui.setContent({
	'title': 'Discuss',
	'placeholder-textarea': 'Post a message',
	'add-button': 'Submit'
});