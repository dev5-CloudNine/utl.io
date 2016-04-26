Template.buyerSmall.events({
	'click a.addToFavorites': function(event, template) {
		event.preventDefault();
		var button = event.target;
		$(button).toggleClass('removeFromFav');
		$(button).toggleClass('addToFavorites');
		var uId = this._id;
		Meteor.call('addBuyerToFav', uId, function(err) {
			if(err) {
				toastr.error('Failed to add buyer to favorites');
			}
			else {
				toastr.success('Added buyer to favorites');
			}
		});
	},
	'click a.removeFromFav': function(event, template) {
		event.preventDefault();
		$(event.target).toggleClass('addToFavorites');
		$(event.target).toggleClass('removeFromFav');
		var uId = this._id;
		Meteor.call('removeBuyerFromFav', uId, function(err) {
			if(err) {
				toastr.error('Failed to remove buyer from favorites');
			}
			else {
				toastr.success('Removed buyer from favorites.');
			}
		})
	}
});

Template.buyerSmall.helpers({
	liked: function () {
		if(!(Meteor.users.findOne({_id: Meteor.userId()}, {favoriteBuyers: {$in: [this._id]}})))
			return false;
		else
			return true;
	}
});