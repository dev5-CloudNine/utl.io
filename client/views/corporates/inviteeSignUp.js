Template.inviteeSignUp.events({

 'submit #signup-form' : function (event) {
  Router.go('home');
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
    Meteor.call('verifyEmailTrue', result, function (error, result2) {});
    Meteor.loginWithPassword(user.email, user.password);
   }
  });
 }
});