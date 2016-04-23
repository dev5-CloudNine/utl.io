Template.jobSmall.helpers({
	shortDesc: function() {
		var jobDetails = Jobs.findOne({
			_id: this._id
		});
		return jobDetails.htmlDescription.split('.')[0] + '.';
	},
	acceptedProvider: function() {
		var userId = Meteor.userId();
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
		var jobId = this._id;
		Meteor.call('addToFavorites', jobId, function(error) {
			if(error) {
				console.log('Failed to add to favorites');
			}
			else {
				console.log('Added to favorites');
			}
		});
	}
})