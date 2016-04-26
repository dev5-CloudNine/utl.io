Template.jobSmall.helpers({
	shortDesc: function() {
		var jobDetails = Jobs.findOne({
			_id: this._id
		});
		return jobDetails.htmlDescription.split('.')[0] + '.';
	},
	acceptedProvider: function() {
		var userId = Meteor.userId();
		if(this.display == false) {
			return;
		}
		if(Jobs.findOne({$and:[{'_id': this._id}, {'applications.userId':userId},{'applications.app_status':'accepted'}]})) {
			return true
		}
		else {
			return false
		}
	}
})
Template.jobSmall.events({
	'click a.addToFavorites': function(event, template) {
		event.preventDefault();
		var jobId = this._id;
		Meteor.call('addToFavorites', jobId, function(error) {
			if(error) {
				console.log('Failed to add to favorites');
			}
			else {
				console.log('Added to favorites');
			}
		});
	},
	'click button.confirmAssignment': function(event, template) {
		event.preventDefault();
		var buyerId = this.userId;
		var jobId = this._id;
		Meteor.call('confirmAssignment', jobId, buyerId, function(error) {
			if(error) {
				toastr.error('Failed to confirm assignment.');
			}
			else {
				toastr.success('The assignment has been confirmed.');
			}
		})
	},
	'click button.declineAssignment': function(event, template) {
		event.preventDefault();
		console.log(this);
	}
})