Template.dwollaTransfers.helpers({
	'adminTransfers': function() {
		var resArr = [];
		Meteor.call('listTransfers', function(err, res) {
			if(err) {
				console.log(err)
			} else {
				console.log(res);
				Session.set('transfersResult', res);
			}
		});
		return Session.get('transfersResult');
	}
})