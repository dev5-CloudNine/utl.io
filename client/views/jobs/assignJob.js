Template.assignJob.events({
	'click button.assign': function(event, template) {
		Session.set('routingJob', true);
		$(event.currentTarget).button('loading');
		Jobs.before.insert(function(userId, doc) {
			if(Router.current().route.getName() != 'assignJob') {
				$(event.currentTarget).button('reset');
				return;
			}
			doc.selectedProvider = "";
			doc.selectedProvider = Router.current().params.userId;
			doc.applications = [];
			var appDetails = {
				userId: doc.selectedProvider,
				applied_at: new Date(),
				app_status: 'accepted',
				app_type: 'application'
			}
			doc.applicationStatus = 'assigned';
			doc.assignmentStatus = 'not_confirmed'
			doc.applications.push(appDetails);
			doc.routed = true;
		});
		Jobs.after.insert(function(userId, doc) {
			if(!Session.get('routingJob')) {
				return;
				$(event.currentTarget).button('reset');
			}
			Meteor.call('routeNotification', Meteor.userId(), doc, function(error) {
				if(error) {
					toastr.error('Failed to route job.');
					$(event.currentTarget).button('reset');
				} else {
					delete Session.keys['routingJob'];
				}
			})
		})
	},
	// 'click .assignFavs': function(event, template) {
	// 	var applications = [];
	// 	var favUsers = Meteor.user().favoriteUsers;
	// 	if(favUsers.length > 0) {
	// 		for(var i = 0; i < favUsers.length; i++) {
	// 			var appDetails = {
	// 				userId: favUsers[i],
	// 				applied_at: new Date(),
	// 				app_status: 'accepted',
	// 				app_type: 'application'
	// 			}
	// 			applications.push(appDetails);
	// 		}
	// 	}
	// 	Session.set('assignToFavs', true);
	// 	$(event.currentTarget).button('loading');
	// 	Jobs.before.insert(function(userId, doc) {
	// 		if(Router.current().route.getName() != 'assignToFavs') {
	// 			$(event.currentTarget).button('reset');
	// 			return;
	// 		}
	// 		doc.applications = [];
	// 		doc.applications = applications;
	// 	})
	// }
});
Template.assignJob.helpers({
	'selectedProvider': function() {
		return Profiles.findOne({userId: Router.current().params.userId});
	},
	// assignFavProviders: function() {
	// 	if(Router.current().route.getName() == 'assignToFavs')
	// 		return true;
	// 	return false;
	// }
})