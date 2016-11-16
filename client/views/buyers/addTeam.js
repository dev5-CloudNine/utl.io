Template.addTeam.helpers({
	buyerName: function () {
		var buyerDetails = Buyers.findOne({userId: Meteor.userId()});
		return buyerDetails.firstName + ' ' + buyerDetails.lastName;
	}
});

Template.addTeam.events({
	'click button.invite': function (event, template) {
		$(event.target).prop('disabled', true);
		var email = $('input.email').val();
		var type = $('input[name=corpRole]:checked').val();

		if(!email) {
			toastr.error('Please enter email id');
			return;
		}
		if(!type) {
			toastr.error('Please select account type');
			return;
		}

		var exists = Meteor.users.findOne({'emails.address':email});
		if(exists) {
			toastr.error('Email ID exists');
			return;
		}

		// var invitation = {};
		// invitation.email = email;
		// invitation.companyName = Meteor.users.findOne({_id:Meteor.userId()}).companyName;
		// invitation.type = type;

		var invitation = {
			buyerName: $('#buyerName').val(),
			email: email,
			type: type,
			invitedBy: Meteor.userId()
		}

		Meteor.call("createInvite",invitation,function(err,res){
			if(err){
				toastr.error("Failed to send and invite to this email.")
			} else {
				toastr.success("An invitation has been sent to the provided email ID.")
			}
		});
	}
});

