Template.jobForFavs.events({
	'click button.assign': function(event, template) {
		Jobs.before.insert(function(userId, doc) {
			if(Router.current().route.getName() != 'jobForFavs')
				return;
			var favProviders = Users.findOne({_id: Meteor.userId()}).favoriteUsers;
			doc.favoriteProviders = [];
			doc.applications = [];
			for(var i = 0; i < favProviders.length; i++) {
				var application = {
					userId: favProviders[i],
					applied_at: new Date(),
					app_status: 'accepted',
					app_type: 'application'
				}
				doc.applications.push(application);
				doc.favoriteProviders.push(favProviders[i]);
				doc.applicationStatus = 'frozen';
				doc.routed = true;
			}
		});
	}
});