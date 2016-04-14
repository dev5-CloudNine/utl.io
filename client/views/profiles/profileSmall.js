Template.profileSmall.events({
	'click a.addToFavorites': function(event, template) {
		var uId = this._id;
		Meteor.call('addUserToFav', uId, function(err) {
			if(err) {
				toastr.error('Failed to add user to favorites');
			}
			else {
				toastr.success('Added user to favorites');
			}
		});
	}
})