Template.dwollaCustomers.rendered = function() {
	Meteor.call('showCustomers', Meteor.userId(), function(error, result) {
		if(error){
			$('.show-info').text(JSON.stringify(error));
			return;
		}
		result.forEach(function(customer) {
			$('.customers').append('<a href="#" data-customer-url="' + customer._links.self.href + '" class="getCustomerDetails">' + '<li class="list-group-item">' + customer.firstName + ' ' + customer.lastName + '</li></a>');
		})
	});
}

Template.dwollaCustomers.events({
	'click a.getCustomerDetails': function(event, template) {
		var customerUrl = $(event.currentTarget).data('customer-url');
		Meteor.call('getCustomerDetails', customerUrl, function(error, result) {
			if(error)
				console.log(error);
			else {
				$('.customer-details').html('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">' + result.firstName + ' ' + result.lastName + '</h3></div><div class="panel-body"><h2>' + result.email + '</h2><small>' + result.id + '</small><br><button class="btn btn-primary btn-sm show-transfers" data-transfers-url="' + result._links.transfers.href +'">Show Transfers</button><div class="customerFST"></div></div></div>');
			}
		})
	},
	'click button.show-transfers': function(event, template) {
		var customerTransfersUrl = $(event.currentTarget).data('transfers-url');
		Meteor.call('getCustomerTransfers', customerTransfersUrl, function(error, result) {
			var tableData = function() {
				var tdata = '';
				for(var i=0; i < result._embedded.transfers.length; i++) {
					tdata += '<tr><td>' + result._embedded.transfers[i].id + '</td><td>' + result._embedded.transfers[i].created + '</td><td>$ ' + result._embedded.transfers[i].amount.value + ' ' + result._embedded.transfers[i].amount.currency.toUpperCase() + '</td><td>' + result._embedded.transfers[i].status + '</td></tr>';
				}
				return tdata;
			}
			if(error)
				console.log(error);
			else {
				$('.customerFST').html('<hr><h3>Transfers</h3><table class="table table-striped"><tr><th>Transfer ID</th><th>Date</th><th>Amount</th><th>Status</th></tr>' + tableData() +' </table>');
			}
		});
	}
})