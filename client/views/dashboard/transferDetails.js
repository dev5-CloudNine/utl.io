Template.transferDetails.helpers({
	ctDetails: function() {
		var transferId = Router.current().params.id;
		Meteor.call('getTransferDetails', transferId, function(error, result) {
			if(error) {
				console.log(error)
			} else {
				Session.set('ctDetails', result);
			}
		});
		var obj = Session.get('ctDetails');
		var result = {
			id: obj.id,
			amount: obj.amount,
			created: moment.utc(obj.created).format('MM/DD/YYYY, hh:mm:ss A'),
			status: obj.status
		}
		return result;
	}
})