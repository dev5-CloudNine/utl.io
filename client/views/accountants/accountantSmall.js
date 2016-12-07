Template.accountantSmall.events({
	'click a.sendAccountantMessage': function(event, template) {
		event.preventDefault();
		var userId = this.userId;
		Router.go('/mailBox/newaccmsg?userId=' + userId);
		event.stopPropagation();
	}
});

Template.accountantSmall.helpers({
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
	accountant: function() {
		return Accountants.findOne({_id: this._id});
	},
	initials: function() {
		var accountantDetails = Accountants.findOne({_id: this._id})
		return accountantDetails.firstName.charAt(0) + accountantDetails.lastName.charAt(0)
	}
});

Template.accountantSmall.rendered = function() {
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