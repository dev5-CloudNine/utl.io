Template.assignJob.events({
	'click button.assign': function(event, template) {
		Jobs.before.insert(function(userId, doc) {
			if(Router.current().route.getName() != 'assignJob')
				return;
			doc.selectedProvider = Profiles.findOne({_id: Router.current().params._id}).userId;
			doc.applications = [];
			var appDetails = {
				userId: doc.selectedProvider,
				applied_at: new Date(),
				app_status: 'accepted',
				app_type: 'application'
			}
			doc.applications.push(appDetails);
			doc.applicationStatus = 'frozen';
			doc.routed = true;
		});
		// Jobs.after.insert(function(userId, doc) {
		// 	// if(Router.current().route.getName() != 'assignJob')
		// 	// 	return;
		// 	Meteor.call('assignJobUpdate', doc, Router.current().params._id, function(error) {
		// 		if(error) {
		// 			toastr.error('Failed to assign job to the provider');
		// 		}
		// 		else {
		// 			toastr.success('An invitation has been sent to the provider to confirm assignment.');
		// 		}
		// 	})
		// });
	}
});

Template.assignJob.helpers({
	'selectedProvider': function() {
		return Profiles.findOne({_id: Router.current().params._id});
	}
})