Template.favoriteBuyers.helpers({
	favBuyers: function() {
		var favBuyerIds = [];
		var favBuyerArray = [];
		var userDetails = Meteor.user();
		userDetails.favoriteUsers.forEach(function(favBuyer) {
			favBuyerIds.push(favBuyer);
		});
		favBuyerIds.forEach(function(id) {
			favBuyerArray.push(Buyers.findOne({
				userId: id
			}));
		});
		return favBuyerArray;
	}
});