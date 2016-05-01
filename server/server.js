S3.config = {
    key: 'AKIAJFKN5NR3ZC2YF6KQ',
    secret: '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',
    bucket: 'project-tasks',
    region: 'us-east-1' // Only needed if not "us-east-1" or "us-standard"
};

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
    },
    "deleteFile": function(id) {
        Images.remove({_id:id});
    },
    deactivateJob: function(jobId, filled) {
        check(jobId, String);
        check(filled, Boolean);

        var job = Jobs.findOne({
            _id: jobId
        });
        if (!job)
            throw new Meteor.Error("Could not find job.");

        if (this.userId !== job.userId)
            throw new Meteor.Error("You can only deactivate your own job.");

        if (job.status !== "active")
            throw new Meteor.Error("You can only deactivate an active job.");      
        
        Jobs.update({
            _id: jobId
        }, {
            $set: {
                status:(filled ? "filled" : "inactive")
            }
        });

    },
    saveJobAsDraft: function(doc) {
        Jobs.insert(doc);
    },

    addToFav: function(id,type) {
        if(type=="job") {
            Meteor.users.update(Meteor.userId(), {$addToSet: {favoriteJobs: id}});
        } else {
            Meteor.users.update(Meteor.userId(), {$addToSet: {favoriteUsers: id}});
        }
    },
    removeFromFav: function(id,type) {
        if(type=="job") {
            Meteor.users.update(Meteor.userId(), {$pull: {favoriteJobs: id}});
        } else {
            Meteor.users.update(Meteor.userId(), {$pull: {favoriteUsers: id}});
        }
    },

    // addToFavorites: function(jobId) {
    //     Meteor.users.update(Meteor.userId(), {$addToSet: {favoriteJobs: jobId}});
    // },
    // addUserToFav: function(uId) {
    //     Meteor.users.update(Meteor.userId(), {$addToSet: {favoriteUsers: uId}});
    // },
    // removeUserFromFav: function(uId) {
    //     Meteor.users.update(Meteor.userId(), {$pull: {favoriteUsers: uId}});
    // },
    // addBuyerToFav: function(uId) {
    //     Meteor.users.update(Meteor.userId(), {$addToSet: {favoriteBuyers: uId}});
    // },
    // removeBuyerFromFav: function(uId) {
    //     Meteor.users.update(Meteor.userId(), {$pull: {favoriteBuyers: uId}});
    // },
    applyForThisJob: function(jobId, applicationDetails) {
        Jobs.update(jobId, {$addToSet: {applications: applicationDetails}});
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {appliedJobs: jobId}});
    },
    acceptApplication: function(jobId, userId, applicationTime) {
        Jobs.update({_id: jobId, 'applications.userId': userId, 'applications.applied_at': applicationTime}, {$set: {'applications.$.app_status': 'accepted', applicationStatus: 'frozen'}});
    },
    confirmAssignment: function(jobId, buyerId) {
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {ongoingJobs: jobId}});
        Profiles.update({userId: Meteor.userId()}, {$pull: {appliedJobs: jobId}});
        Jobs.update({_id: jobId}, {$set: {applicationStatus: 'assigned', assignedProvider: Meteor.userId()}});
        Buyers.update({userId: buyerId}, {$addToSet: {ongoingJobs: jobId}});
    },
    declineAssignment: function(jobId, userId) {
        Jobs.update(jobId, {$set: {applicationStatus: 'open'}});
        Profiles.update({'userId': userId}, {$pull: {appliedJobs: jobId}});
    },
    counterOfferThisJob: function(jobId, counterOffer) {
        Jobs.update(jobId, {$addToSet: {counterOffers: counterOffer}});
    },
    adminSetJobStatus: function(jobId, status) {
        check(jobId, String);
        check(status, String);

        var job = Jobs.findOne({
            _id: jobId
        });
        if (!job)
            throw new Meteor.Error("Could not find job.");

        if (!Roles.userIsInRole(this.userId, ['admin']))
            throw new Meteor.Error("Only admins can set job status");

        var setObject = {
            status: status
        };
        
        if (Meteor.isServer && status === "active" && job.featured())
            setObject.featuredThrough = moment().add(30,"days").toDate();

        Jobs.update({
            _id: jobId
        }, {
            $set: setObject
        });

    },
    createFeaturedJobCharge: function(tokenId, jobId) {
        check(tokenId, String);
        check(jobId, String);

        var job = Jobs.findOne({_id:jobId});
        if(!job)
            throw new Meteor.Error("Could not find job.");

        if(job.userId !== this.userId)
            throw new Meteor.Error("You can only pay for you own job post.");

        if(Meteor.isServer){
            // var result = Stripe.charges.create({
            //  source:tokenId,
            //  amount:10000,
            //  currency:"usd",
            //  description:"We Work Meteor - Featured Job Post - 30 Days"
            // });

            // if(result && result.status === "succeeded"){
            //  Jobs.update({_id:job._id},{
            //      $set:{
            //          featuredThrough:moment().add(30,"days").toDate()
            //      },
            //      $push:{
            //          featuredChargeHistory:result.id
            //      }
            //  });
            // }else{
            //  throw new Meteor.Error("Payment Failed!");
            // }
        }else{
            Jobs.update({
                _id: jobId
            }, {
                $set: {
                    featuredThrough: moment().add(30, "days").toDate()
                }
            });
        }
    },
    updateTask: function(id,obj){
        Tasks.update({'_id':id},{$set:{'state':obj.state,'comments':obj.comments}});
    }
});