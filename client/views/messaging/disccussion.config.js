Comments.config({
	generateUsername: function(user) {
		var userName;
		if(Roles.userIsInRole(user._id, ['provider', 'corporate-provider'])) {
			var profile = Profiles.findOne({userId: user._id});
			var userName = profile.firstName + ' ' + profile.lastName;
		}
		if(Roles.userIsInRole(user._id, ['buyer', 'corporate-manager'])) {
			var profile = Buyers.findOne({userId: user._id});
			var userName = profile.firstName + ' ' + profile.lastName;
		}
		return userName;
	}
})
Comments.ui.config({
   limit: 5,
   template: 'bootstrap'
});

Comments.ui.setContent({
	'title': 'Queries',
	'placeholder-textarea': 'Post a message',
	'add-button': 'Submit'
});