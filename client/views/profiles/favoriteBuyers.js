Template.favoriteBuyers.helpers({
	favBuyers: function() {
		var favUserArray = [];
		var userDetails = Meteor.user();
		if(userDetails.favoriteUsers) {
			for(var i = userDetails.favoriteUsers.length - 1; i >= 0; i--) {
				if(Roles.userIsInRole(userDetails.favoriteUsers[i], ['buyer']))
					favUserArray.push(Buyers.findOne({userId: userDetails.favoriteUsers[i]}));
				else if(Roles.userIsInRole(userDetails.favoriteUsers[i], ['dispatcher']))
					favUserArray.push(Dispatchers.findOne({userId: userDetails.favoriteUsers[i]}));
			}
		}
		return favUserArray;
	},
	isBuyer: function(userId) {
		return (Roles.userIsInRole(userId, ['buyer']))? true: false;
	},
	isDispatcher: function(userId) {
		return (Roles.userIsInRole(userId, ['dispatcher']))? true: false;
	}
});