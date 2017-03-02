Meteor.startup(function () {
  smtp = {
    username : 'postmaster@ustechland.com',
    password : 'Dd02515676',
    server : 'smtp.mailgun.org',
    port : 587
  }

 process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port + '/';

 Accounts.emailTemplates.from = FROM_EMAIL;
 Accounts.emailTemplates.siteName = 'UTL';
 Accounts.emailTemplates.verifyEmail.subject = function (user) {
  return 'Email Verification';
 };
 Accounts.emailTemplates.verifyEmail.text = function (user, url) {
    var urls = url.split("/#/");
    url = Meteor.settings.public.ROOT_URL + "/#/"+urls[1];
  return 'Click on the following link to verify your email address: ' + url;
 };
 Accounts.emailTemplates.resetPassword.subject = function (user) {
  return 'Reset Password';
 };
 Accounts.emailTemplates.resetPassword.text = function (user, url) {
  return 'Click on the following link to reset your password: ' + url;
 };
 // Accounts.config({
 //  sendVerificationEmail : true,
 //  forbidClientAccountCreation : true
 // });
  Accounts.validateLoginAttempt(function (attempt) {
  var user = attempt.user;
  if (user && !user.emails[0].verified)
    throw new Meteor.Error(403, 'E-Mail address not verified.');
  return true;
  });


  Accounts.onCreateUser(function(options, user) {
    user.favoriteJobs = [];
    if (options.profile)
      user.profile = options.profile;
    user.roles = options.profile.role;
    var email = getUserEmail(user);
    if (email) {
      user.emailHash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
    }
    return user;
  });
});