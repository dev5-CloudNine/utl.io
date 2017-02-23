Template.transactionDetails.helpers({
	transaction: function(){
		var docID = Router.current().params._id;
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