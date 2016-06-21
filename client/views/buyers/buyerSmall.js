Template.buyerSmall.events({
	'click .favInactive': function(event, template) {
		event.preventDefault();
		Meteor.call('addToFav', this.userId, Meteor.user().roles[0], function(error) {
			if(error) {
				console.log('Failed to add to favorites');
			}
			else {
				$(event.currentTarget).removeClass('favInactive');
				$(event.currentTarget).addClass('favActive');
			}
		});
		event.stopPropagation();
	},
	'click .favActive': function(event, template) {
		event.preventDefault();
		Meteor.call('removeFromFav', this.userId, Meteor.user().roles[0], function(error) {
			if(error) {
				console.log('Failed to add to favorites');
			}
			else {
				$(event.currentTarget).removeClass('favActive');
				$(event.currentTarget).addClass('favInactive');
			}
		});
		event.stopPropagation();
	}
});

Template.buyerSmall.helpers({
	readableId: function() {
		return (Users.findOne({_id: this.userId}).readableID);
	},
	fav : function() {
		return Meteor.users.findOne({$and:[{_id:Meteor.userId()},{favoriteUsers: {$in: [this.userId]}}]})?true:false;
	},
	favCount: function() {
		return (Users.findOne({_id: this.userId}).favCount);
	},
	customImageUrl: function() {
		var imgUrl = Meteor.users.findOne({_id: this.userId}).imgURL;
		if(imgUrl) {
			return imgUrl;
		}
	},
	buyer: function() {
		return Buyers.findOne({_id: this._id});
	}
});