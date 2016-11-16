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
        if(user.isDeveloper || user.isBuyer || user.isDispatcher)
            Router.go('/dashboard');
        else {
            if(Roles.userIsInRole(Meteor.userId(), ['provider']))
                Router.go('/profile')
            if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
                Router.go('/buyerNew')
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
                Router.go('/dispatcherNew');
        }
        if(Roles.userIsInRole(Meteor.userId(), ['admin']))
            Router.go('/dashboard');
    }
});
// AccountsTemplates.configureRoute("signUp", {
//     name: 'signUp',
//     path: '/sign-up',
//     redirect: '/',
// });



