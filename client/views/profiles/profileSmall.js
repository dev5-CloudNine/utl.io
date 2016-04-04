Template.profileSmall.events({
	'click a.addToFavorites': function(event, template) {
		var uId = this._id;
		Meteor.call('addUserToFav', uId, function(err) {
			if(err) {
				console.log('Failed to add user to favorites');
			}
			else {
				console.log('Added user to favorites');
			}
		});
	}
})