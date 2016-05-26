Template.assignJob.events({
	'click button.assign': function(event, template) {
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
	}
});

Template.assignJob.helpers({
	'selectedProvider': function() {
		return Profiles.findOne({_id: Router.current().params._id});
	}
})