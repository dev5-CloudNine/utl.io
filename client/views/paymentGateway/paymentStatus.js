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
		var transferDetails = Transactions.findOne({_id: docID});
		var exact_ctr = '<p>' + transferDetails.exact_ctr.replace(/(?:\r\n|\r|\n)/g, '</p><p>');
		exact_ctr.slice(0, -3);
		var returnObj = {
			exact_ctr: exact_ctr
		}
		// return Transactions.findOne({'_id': docID});
		return returnObj;
	}
})