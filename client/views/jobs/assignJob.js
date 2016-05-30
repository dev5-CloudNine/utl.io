Template.assignJob.events({
	'click button.assign': function(event, template) {
		Session.set('routingJob', true);
		Jobs.before.insert(function(userId, doc) {
			if(Router.current().route.getName() != 'assignJob')
				return;
			doc.selectedProvider = "";
			doc.selectedProvider = Profiles.findOne({_id: Router.current().params._id}).userId;
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
			console.log(doc);
			debugger;
		});
		Jobs.after.insert(function(userId, doc) {
			if(!Session.get('routingJob'))
				return;
			Meteor.call('routeNotification', doc.selectedProvider, Meteor.userId(), doc._id, function(error) {
				if(error) {
					toastr.error('Failed to route job.');
				} else {
					delete Session.keys['routingJob'];
					toastr.success('A notification has been sent to the provider to confirm assignment.');
				}
			})
		})
	}
});

Template.assignJob.helpers({
	'selectedProvider': function() {
		return Profiles.findOne({_id: Router.current().params._id});
	}
})