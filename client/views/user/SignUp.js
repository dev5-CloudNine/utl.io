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
  }
  // user.profile["firstName"] = $('#firstName').val();
  // user.profile["lastName"] = $('#lastName').val();
  // user.profile["phone"] = $('#phone').val();
  // user.profile["company"] = $('#company').val();
  // user.profile["jobTitle"] = $('#jobTitle').val();
  // user.profile["address"] = $('#address').val();
  // user.profile["city"] = $('#city').val();
  // user.profile["state"] = $('#state').val();
  // user.profile["zip"] = $('#zip').val();
  // user.profile["country"] = $('#country').val();
  // user.profile["areaOfInterest"] = $('#areaOfInterest').val(); 
  Meteor.call('onUserSignup', user, function (error, result) {
   if (error) {
    toastr.error(error.message,'Error');
    console.log(error);
    // bootbox.dialog({
    //  message : error.reason,
    //  title : "Error",
    //  buttons : {
    //   danger : {
    //    label : "Close",
    //    className : "btn-danger",
    //    callback : function () {}
    //   }
    //  }
    // });
   } else {
    toastr.success('success');
    // bootbox.dialog({
    //  message : 'You are now part of the interactive digital experience for all IBM conferences and an exclusive member of the social community. Enjoy live and on-demand broadcasts, theCUBE interviews, CrowdChats, and access to premium content and presentations. Engage and interact in real time with influencers and peers in a social space designed for collaboration and networking. Discover all that IBMGO has to offer before, during and after the event.<br/>Please check your email for your account verification and welcome message. Once you receive that, you\'ll be able to log into your account.',
    //  title : "Welcome to IBMGO!",
    //  buttons : {
    //   danger : {
    //    label : "OK",
    //    className : "btn-success",
    //    callback : function () {}
    //   }
    //  }
    // });    
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