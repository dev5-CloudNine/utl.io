Template.breadcrumbs.onCreated(function() {
	Blaze._allowJavascriptUrls();
});

Template.breadcrumbs.helpers({
	buyer: function() {
		return Buyers.findOne({userId: Meteor.userId()});
	},
	dispatcher: function() {
		return Dispatchers.findOne({userId: Meteor.userId()});
	},
	accountant: function() {
		return Accountants.findOne({userId: Meteor.userId()});
	},
	profile: function() {
		return Profiles.findOne({userId: Meteor.userId()});
	},
	profileCreated: function() {
		return Meteor.user().isDeveloper || Meteor.user().isBuyer || Meteor.user().isDispatcher || Meteor.user().isAccountant;
	},
	buyerHasFavs: function() {
		var favUsers = Meteor.users.findOne({_id: Meteor.userId()}).favoriteUsers;
		if(favUsers && favUsers.length > 0)
			return true;
		return false;
	}
})