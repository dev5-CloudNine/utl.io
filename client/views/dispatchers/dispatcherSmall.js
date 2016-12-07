Template.dispatcherSmall.events({
	'click a.sendDispatcherMessage': function(event, template) {
		event.preventDefault();
		var userId = this.userId;
		Router.go('/mailBox/newdismsg?userId=' + userId);
		event.stopPropagation();
	}
});

Template.dispatcherSmall.helpers({
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
	dispatcher: function() {
		return Dispatchers.findOne({_id: this._id});
	},
	initials: function() {
		var dispatcherDetails = Dispatchers.findOne({_id: this._id})
		return dispatcherDetails.firstName.charAt(0) + dispatcherDetails.lastName.charAt(0)
	}
});

Template.dispatcherSmall.rendered = function() {
	var points = 0;
	var reviews = Reviews.find({$and: [{buyerId: this.data.userId}, {reviewedBy: 'provider'}]}).fetch();
	if(reviews) {
		for (var i = 0; i < reviews.length; i++) {
			points += reviews[i].pointsRated;
		}
	}
	var reviewPoints = points/reviews.length;
	this.$('.rateit').rateit({'readonly': true, value: reviewPoints});
}