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
    applyForThisJob: function(jobId, applicationDetails) {
        Jobs.update(jobId, {$addToSet: {applications: applicationDetails}});
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {appliedJobs: jobId}});
    },
    removeFromAppliedJobs: function(jobId, userId) {
        Jobs.update({$and:[{_id:jobId},{'applications.userId':userId}]},{$pull:{"applications":{"userId":userId}}});
        Profiles.update({userId: userId}, {$pull: {appliedJobs: jobId}});
    },
    acceptApplication: function(jobId, userId, applicationTime) {
        var jobNets = Jobs.findOne({_id: jobId}).freelancer_nets;
        Jobs.update({_id: jobId, 'applications.userId': userId, 'applications.applied_at': applicationTime}, {$set: {'applications.$.app_status': 'accepted', applicationStatus: 'frozen', proposedBudget: jobNets}});
    },
    assignJobUpdate: function(doc, pId) {
        Profiles.update({_id: pId}, {$addToSet: {routedJobs: doc._id}});
    },
    "acceptCounterOffer": function(jobId, userId, applied_at, freenets) {
        console.log(userId);
        console.log(applied_at);
        console.log(freenets);
        Jobs.update({_id: jobId, 'applications.userId': userId, 'applications.applied_at': applied_at, 'applications.freelancer_nets': freenets}, {$set: {'applications.$.app_status': 'accepted', applicationStatus: 'frozen', proposedBudget: freenets}})
    },
    confirmAssignment: function(jobId, buyerId) {
        var proBudget = Jobs.findOne({_id: jobId}).proposedBudget;
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {ongoingJobs: jobId}});
        Profiles.update({userId: Meteor.userId()}, {$pull: {appliedJobs: jobId}});
        Jobs.update({_id: jobId}, {$set: {applicationStatus: 'assigned', assignedProvider: Meteor.userId(), projectBudget: proBudget}});
        Buyers.update({userId: buyerId}, {$addToSet: {ongoingJobs: jobId}});
    },
    declineAssignment: function(jobId, userId) {
        Jobs.update({_id: jobId, 'applications.userId': userId}, {$set: {applicationStatus: 'open', 'applications.$.app_status': 'declined'}});
        // Profiles.update({'userId': userId}, {$pull: {appliedJobs: jobId}});
    },
    // counterOfferThisJob: function(jobId, counterOffer) {
    //     Jobs.update(jobId, {$addToSet: {counterOffers: counterOffer}});
    //     Profiles.update({userId: Meteor.userId()}, {$addToSet: {counteredJobs: jobId}});
    // },
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
    },
    addFile: function(file,id) {
        Tasks.update(id, {$addToSet: {files: file}});
    },
    deleteFile: function(file,id) {
        Tasks.update(id, {$pull: {files: file}});
    },
    recordTime:function(id){
        Tasks.update({'_id':id},{$set:{'time':new Date()}});
    }
});