Template.contactUs.events({
	'submit #queryRequest': function (event, template) {
		event.preventDefault();
		var contactRequest = {
			firstName: $('input[name="firstName"]').val(),
			lastName: $('input[name="lastName"]').val(),
			companyName: $('input[name="companyName"]').val(),
			email: $('input[name="email"]').val(),
			mobile: $('input[name="mobile"]').val(),
			query: $('textarea[name="query"]').val()
		}
		Meteor.call('sendQueryRequest', contactRequest, function(error, result) {
			if(error) {
				$(".failedAlert").show().delay(5000).fadeOut();
			} else {
				$(".successAlert").show().delay(5000).fadeOut();
			}
		})
	}
});