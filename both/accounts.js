AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    overrideLoginErrors: true,
    sendVerificationEmail: true,

    // Appearance
    showForgotPasswordLink: true,
    showLabels: false,
    showPlaceholders: true,

    // Client-side Validation
    continuousValidation: true,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: false,
    positiveFeedback: false,
    forbidClientAccountCreation : true,

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 2000,
});


AccountsTemplates.configureRoute("forgotPwd");
AccountsTemplates.configureRoute("resetPwd");
AccountsTemplates.configureRoute("signIn", {
    name: 'signIn',
    path: '/sign-in',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    yieldTemplates: {
        header: {
            to: 'header'
        },
        footer: {
            to: 'footer'
        }
    },
    redirect: function() {
        var user = Meteor.user();

        if (user && Roles.userIsInRole(user, ['admin'])) {
          Router.go('/admin');
        }
        else {
          Router.go('/');
        }
    }
});
// AccountsTemplates.configureRoute("signUp", {
//     name: 'signUp',
//     path: '/sign-up',
//     redirect: '/',
// });



