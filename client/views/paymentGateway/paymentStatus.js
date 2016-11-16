Template.paymentStatus.onRendered(function(){
	var docID = Router.current().params.query.id;	
	if(!docID) return;
	if(!Meteor.userId()) return;
	if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
		Meteor.call('updateTransaction', docID, Meteor.user().invitedBy, Meteor.userId());
		return;
	}
	Meteor.call('updateTransaction', docID, Meteor.userId(), Meteor.userId());
});

Template.paymentStatus.helpers({
	transaction: function(){
		var docID = Router.current().params.query.id;
		return Transactions.findOne({'_id':docID});
	}
})