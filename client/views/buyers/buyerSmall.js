Template.buyerSmall.events({
	'click .favInactive': function(event, template) {
		event.preventDefault();
		Meteor.call('addToFav', this.userId, "", function(error) {
			if(error) {
				console.log('Failed to add to favorites');
			}
			else {
				$(event.currentTarget).find('i').html('Lik\'d');
				$(event.currentTarget).removeClass('favInactive');
				$(event.currentTarget).addClass('favActive');
			}
		});
		event.stopPropagation();
	},
	'click .favActive': function(event, template) {
		event.preventDefault();
		Meteor.call('removeFromFav', this.userId, "", function(error) {
			if(error) {
				console.log('Failed to add to favorites');
			}
			else {
				$(event.currentTarget).find('i').html('Like');
				$(event.currentTarget).removeClass('favActive');
				$(event.currentTarget).addClass('favInactive');
				console.log('Added to favorites');
			}
		});
		event.stopPropagation();
	}
});

Template.buyerSmall.helpers({
	readableId: function() {
		return Meteor.users.findOne({_id: this.userId}).readableID;
	},
	fav : function() {
		return Meteor.users.findOne({$and:[{_id:Meteor.userId()},{favoriteUsers: {$in: [this.userId]}}]})?true:false;
	}
});