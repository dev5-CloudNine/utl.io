Meteor.methods({
    "onUserSignup": function(user) {
        return Accounts.createUser(user);
    },    
    "postUserSignup": function(userId) {
        Accounts.sendVerificationEmail(userId);
        return;
    },  
    "verifyEmailTrue": function(userId) {
        Meteor.users.update({_id:userId,"emails.verified":false},{$set:{'emails.$.verified':true}});
        return;
    },
    "postMessage" : function(obj) {
    	Messages.insert(obj);
    },
    "deleteMsg": function(id) {
        Messages.remove({parent:id});
        Messages.remove({_id:id});
    },
    "markRead": function(id){
        Messages.update({'_id':id},{$set:{'read':true}});
    },
    "createInvite": function(obj) {
        var id = TempInvitation.insert(obj);
        Email.send({
          to: obj.email,
          from: FROM_EMAIL,
          subject: "You are invited to join "+obj.companyName ,
          text: "Please click on the following link to join " + obj.companyName + ". "
                + Meteor.absoluteUrl("inviteeSignUp/"+id)
        });
    },
    "deleteInvite": function(id) {
        TempInvitation.remove({_id:id});
    },
    "location": function(query, options) {
        if (!query) return [];

        options = options || {};

        // guard against client-side DOS: hard limit to 50
        if (options.limit) {
            options.limit = Math.min(50, Math.abs(options.limit));
        } else {
            options.limit = 50;
        }

        // TODO fix regexp to support multiple tokens
        var regex = new RegExp("^" + query,'gi');
        return Cities.find({city: {$regex:  regex}}, options).fetch();
    }
});