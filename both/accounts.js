AccountsTemplates.configure({
    confirmPassword: true,
    enablePasswordChange: true,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    showForgotPasswordLink: true,
    showLabels: false,
    showPlaceholders: true,
    continuousValidation: true,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: false,
    positiveFeedback: false,
    forbidClientAccountCreation : true,
    homeRoutePath: '/',
    redirectTimeout: 2000,
});

AccountsTemplates.addField({
    _id: 'terms',
    type: 'checkbox',
    displayName: 'I have read and agree to the <a href="/terms">Terms and Conditions</a>',
    errStr: 'You must agree to the terms and conditions.',
    func: function(value) {
        return value != '1'
    }
})


AccountsTemplates.configureRoute("forgotPwd");
AccountsTemplates.configureRoute("resetPwd");
AccountsTemplates.configureRoute("signIn", {
    name: 'signIn',
    path: '/sign-in',
    template: 'signin',
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
        if(user && (user.isDeveloper || user.isBuyer || user.isDispatcher || user.isAccountant))
            Router.go('/dashboard');
        else {
            if(Roles.userIsInRole(Meteor.userId(), ['provider']))
                Router.go('/profile')
            if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
                Router.go('/buyerNew')
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
                Router.go('/dispatcherNew');
            if(Roles.userIsInRole(Meteor.userId(), ['accountant']))
                Router.go('/accountantNew');
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



