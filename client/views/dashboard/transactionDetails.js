Template.transactionDetails.helpers({
	transaction: function(){
		var docID = Router.current().params._id;
		return Transactions.findOne({'_id': docID});
	}
})