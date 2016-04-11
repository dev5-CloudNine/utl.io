Template.addTeam.helpers({
	companyName: function () {
		var corpInfo = Meteor.user();
		return corpInfo.companyName;
	}
});

Template.addTeam.events({
	'click button.invite': function (event) {

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
		}

		var invitation = {};
		invitation.email = email;
		invitation.companyName = Meteor.users.findOne({_id:Meteor.userId()}).companyName;
		invitation.type = type;

		Meteor.call("createInvite",invitation,function(err,res){
			if(err){
				toastr.error("Failed to send and invite to this email.")
			} else {
				toastr.success("An invitation has been sent to the provided email ID.")
			}
		});
	}
});

