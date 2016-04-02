Template.inviteeSignUp.events({

 'submit #signup-form' : function (event) {
  event.preventDefault();
  var user = {};
  user['email'] = $('#email').val();
  user['password'] = $('#password').val();
  user.profile = {};  
  user.profile['companyName'] = $('#signup-form').data('companyName');
  var role=[];
  role.push($('#signup-form').data('type'));
  user.profile["role"] = role;


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