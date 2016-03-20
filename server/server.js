Meteor.methods({
    "onUserSignup": function(user) {
        return Accounts.createUser(user);
    },    
    "postUserSignup": function(userId) {
        Accounts.sendVerificationEmail(userId);
        return;
    },
    "postMessage" : function(obj) {
    	Messages.insert(obj);
    }
});