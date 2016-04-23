Template.SignUp.events({
  'change input.type' : function(event) {
    var val = $(event.currentTarget).val();
    if(val=='corporate-admin')
      $('.company-name').show();
    else
      $('.company-name').hide();
  },
 'submit #signup-form' : function (event) {
  event.preventDefault();
  var user = {};
  user['email'] = $('#email').val();
  user['password'] = $('#password').val();
  var role=[];
  var roleVal = $('input[name=type]:checked', '#signup-form').val();
  user.profile = {};  
  if(roleVal=='corporate-admin')
    user.profile['companyName'] = $('.txt-company-name').val();
  if(roleVal) {
    role.push(roleVal);
    user.profile["role"] = role;
  } else {
    toastr.error('Please select a role');
    return;
  } 

  Meteor.call('onUserSignup', user, function (error, result) {
   if (error) {
    toastr.error(error.message,'Error');
    console.log(error);
   } else {
    toastr.success('A verification link has been sent to your email. Please check your email.'); 
    Meteor.call('postUserSignup', result, function (error, result2) {});
    Router.go('home');
   }
  });
 }
});

Template.SignUp.rendered = function () {
  $('.company-name').hide();
 $(".chosen-select").chosen();
 jQuery.validator.addMethod("genericPhoneNumber", function (phone_number, element) {
  phone_number = phone_number.replace(/\s+/g, "");
  return this.optional(element) || phone_number.length > 9 &&
  phone_number.match(/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i);
 }, "Please specify a valid phone number");
 $('#signup-form').validate({
  rules : {
   firstName : {
    required : true,
    maxlength : 50
   },
   lastName : {
    required : true,
    maxlength : 50
   },
   phone : {
    required : true,
    genericPhoneNumber : true,
    maxlength : 50
   },
   email : {
    required : true,
    email : true,
    maxlength : 50
   },
   password : {
    required : true,
    minlength : 8,
    maxlength : 50
   },
   confirmPassword : {
    required : true,
    minlength : 8,
    maxlength : 50,
    equalTo : "#password"
   },
   company : {
    required : true,
    maxlength : 50
   },
   jobTitle : {
    required : true,
    maxlength : 50
   },
   address : {
    required : true,
    maxlength : 100
   },
   city : {
    required : true,
    maxlength : 50
   },
   state : {
    required : true,
    maxlength : 50
   },
   zip : {
    required : true,
    maxlength : 10
   },
   country : {
    required : true
   },
   areaOfInterest : {
    required : true
   },
   termsOfUse : "required"
  },
  messages : {
   confirmPassword : {
    equalTo : "Passwords don't match."
   }
  }
 });
};