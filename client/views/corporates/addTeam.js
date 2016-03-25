Template.addTeam.helpers({
	companyName: function () {
		var corpInfo = Corporates.findOne({
			userId: Meteor.userId()
		});
		return corpInfo.companyName;
	}
});