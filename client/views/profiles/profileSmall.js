Template.profileSmall.events({
	'click a.addToFavorites': function(event, template) {
		var uId = this._id;
		console.log(event.target);
		Meteor.call('addUserToFav', uId, function(err) {
			if(err) {
				toastr.error('Failed to add user to favorites');
			}
			else {
				toastr.success('Added user to favorites');
			}
		});
	}
});

Template.profileSmall.helpers({
	readableId: function() {
		return(Users.findOne({_id: this.userId}).readableID);
	}
})