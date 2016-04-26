Template.profileSmall.events({
	'click a.addToFavorites': function(event, template) {
		event.preventDefault();
		var button = event.target;
		$(button).toggleClass('removeFromFav');
		$(button).toggleClass('addToFavorites');
		var uId = this._id;
		Meteor.call('addUserToFav', uId, function(err) {
			if(err) {
				toastr.error('Failed to add user to favorites');
			}
			else {
				toastr.success('Added user to favorites');
			}
		});
	},
	'click a.removeFromFav': function(event, template) {
		event.preventDefault();
		$(event.target).toggleClass('addToFavorites');
		$(event.target).toggleClass('removeFromFav');
		var uId = this._id;
		Meteor.call('removeUserFromFav', uId, function(err) {
			if(err) {
				toastr.error('Failed to remove user from favorites');
			}
			else {
				toastr.success('Removed user from favorites.');
			}
		})
	},
	'click a.assignJob': function(event, template) {
		event.preventDefault();
		console.log(this);
	}
});

Template.profileSmall.helpers({
	readableId: function() {
		return(Users.findOne({_id: this.userId}).readableID);
	},
	liked: function () {
		if(!(Meteor.users.findOne({_id: Meteor.userId()}, {favoriteUsers: {$in: [this._id]}})))
			return false;
		else
			return true;
	}
})