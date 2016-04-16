Template.buyerSmall.events({
	'click a.addToFavorites': function(event, template) {
		var uId = this._id;
		Meteor.call('addBuyerToFav', uId, function(err) {
			if(err) {
				toastr.error('Failed to add buyer to favorites');
			}
			else {
				toastr.success('Added buyer to favorites');
			}
		});
	}
})