Template.corporateSmall.helpers({
	readableId: function() {
		return Meteor.users.findOne({_id: this.userId}).readableID;
	}
})