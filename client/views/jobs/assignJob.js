Template.assignJob.events({
	'click button.assign': function(event, template) {
		Session.set('routingJob', true);
		$(event.curretnTarget).button('loading');
		Jobs.before.insert(function(userId, doc) {
			if(Router.current().route.getName() != 'assignJob') {
				$(event.curretnTarget).button('reset');
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
			doc.applicationStatus = 'frozen';
			doc.applications.push(appDetails);
			doc.routed = true;
		});
		Jobs.after.insert(function(userId, doc) {
			if(!Session.get('routingJob')) {
				return;
				$(event.curretnTarget).button('reset');
			}
			Meteor.call('routeNotification', Meteor.userId(), doc, function(error) {
				if(error) {
					toastr.error('Failed to route job.');
					$(event.curretnTarget).button('reset');
				} else {
					delete Session.keys['routingJob'];
					toastr.success('A notification has been sent to the provider to confirm assignment.');
				}
			})
		})
	}
});
Template.assignJob.helpers({
	// 'providerName': function() {
	// 	var providerDetails = Profiles.findOne({userId: Router.current().params.userId});
	// 	return providerDetails.firstName + ' ' + providerDetails.lastName;
	// },
	// providerId: function() {
	// 	return Router.current().params.userId;
	// },
	'selectedProvider': function() {
		return Profiles.findOne({userId: Router.current().params.userId});
	}
})