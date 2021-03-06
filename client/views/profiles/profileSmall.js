Template.profileSmall.events({
	'click .favInactive': function(event, template) {
		event.preventDefault();
		Meteor.call('addToFav', this.userId, Meteor.user().roles[0], function(error) {
			if(error) {
				toastr.error('Failed to add to favorites');
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
				toastr.error('Failed to add to favorites');
			}
			else {
				$(event.currentTarget).removeClass('favActive');
				$(event.currentTarget).addClass('favInactive');
			}
		});
		event.stopPropagation();
	},
	'click #sendProviderMessage': function(event, template) {
		event.preventDefault();
		Router.go('/mailbox/newpromsg?userId=' + this.userId);
		event.stopPropagation();
	}
});

Template.profileSmall.helpers({
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
	initials: function() {
		var providerDetails = Profiles.findOne({_id: this._id})
		return providerDetails.firstName.charAt(0) + providerDetails.lastName.charAt(0)
	}
});

Template.profileSmall.rendered = function () {
	var points = 0;
	var reviews = Reviews.find({$and: [{providerId: this.data.userId}, {reviewedBy: 'buyer'}]}).fetch();
	if(reviews) {
		for(var i = 0; i < reviews.length; i++) {
			points += parseInt(reviews[i].pointsRated);
		}
	}
	var reviewPoints = points/reviews.length;
	this.$('.rateit').rateit({'readonly': true, value: reviewPoints});
};