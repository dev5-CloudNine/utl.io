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
    ,"deleteMsg": function(id) {
        Messages.remove({parent:id});
        Messages.remove({_id:id});
    },
    "markRead": function(id){
        Messages.update({'_id':id},{$set:{'read':true}});
    }
});