Template.jobSmall.helpers({
	shortDesc: function() {
		var jobDetails = Jobs.findOne({
			_id: this._id
		});
		return jobDetails.htmlDescription.split('.')[0] + '.';
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