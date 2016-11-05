Template.assignJob.events({
	'click button.inviteIndividual': function(event, template) {
		var individualProvider = $('input[name="individualprovider"]')[0].id;
		Session.set('publishToIndividual', true);
		Jobs.before.insert(function(userId, doc) {
			$(event.target).prop('disabled', true);
			$('button.publish').prop('disabled', true);
 			$('button.publishToFavs').prop('disabled', true);
			if(!Session.get('publishToIndividual'))
				return;
			if(Session.get('insertError')) {
				$('button.publish').prop('disabled', false);
 				$('button.publishToFavs').prop('disabled', false);
 				$(event.currentTarget).prop('disabled', false);
				return;
			}
			doc.invited = true;
			doc.individualprovider = individualProvider;
		});
		Jobs.after.insert(function(userId, doc) {
			if(!Session.get('publishToIndividual'))
				return;
			if(Session.get('insertError'))
				return;
			Meteor.call('publishToIndividualUpdate', doc, function(error) {
				if(error) {
					toastr.error('Failed to publish to the individual. Please try again.');
				} else {
					delete Session.keys['publishToIndividual'];
				}
			})
			Router.go('job', {_id: doc._id})
		})
	}
});

Template.assignJob.helpers({
	'providerName': function() {
		var providerDetails = Profiles.findOne({userId: Router.current().params.userId});
		return providerDetails.firstName + ' ' + providerDetails.lastName;
	},
	providerId: function() {
		return Router.current().params.userId;
	},
	'selectedProvider': function() {
		return Profiles.findOne({userId: Router.current().params.userId});
	}
})