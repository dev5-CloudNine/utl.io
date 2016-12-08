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
	}
})