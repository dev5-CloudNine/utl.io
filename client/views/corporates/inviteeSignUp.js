Template.inviteeSignUp.events({

 'submit #signup-form' : function (event) {
  event.preventDefault();
  var user = {};
  user['email'] = $('#email').val();
  user['password'] = $('#password').val();

  var invite = TempInvitation.findOne({_id:Router.current().params.id});

  user.profile = {};  
  user.profile['companyName'] = invite.companyName;
  var role=[];
  role.push(invite.type);
  user.profile["role"] = role;
  Meteor.call("deleteInvite",invite._id);

  Meteor.call('onUserSignup', user, function (error, result) {
   if (error) {
    toastr.error(error.message,'Error');
    console.log(error);
   } else {
    toastr.success('success'); 
    Meteor.call('postUserSignup', result, function (error, result2) {});
    Router.go('home');
   }
  });
 }
});