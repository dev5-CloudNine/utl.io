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
        var notificationObj = {
            jobId: jobId,
            providerId: applicationDetails.userId,
            buyerId: Jobs.findOne({_id: jobId}).userId,
            timeStamp: applicationDetails.applied_at,
            notificationType: 'newJobApplication',
            read: false
        }
        Jobs.update(jobId, {$addToSet: {applications: applicationDetails}});
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {appliedJobs: jobId}});
        Notifications.insert(notificationObj);
    },
    removeFromAppliedJobs: function(jobId, userId) {
        Jobs.update({$and:[{_id:jobId},{'applications.userId':userId}]},{$pull:{"applications":{"userId":userId}}});
        Profiles.update({userId: userId}, {$pull: {appliedJobs: jobId}});
    },
    acceptApplication: function(jobId, userId, applicationTime) {
        var notificationObj = {
            jobId: jobId,
            providerId: userId,
            buyerId: Jobs.findOne({_id: jobId}).userId,
            timeStamp: new Date(),
            notificationType: 'applicationAccepted',
            read: false
        }
        var jobNets = Jobs.findOne({_id: jobId}).freelancer_nets;
        Jobs.update({_id: jobId, 'applications.userId': userId, 'applications.applied_at': applicationTime}, {$set: {'applications.$.app_status': 'accepted', applicationStatus: 'frozen', proposedBudget: jobNets}});
        Notifications.insert(notificationObj);
    },
    "acceptCounterOffer": function(jobId, userId, applied_at, freenets) {
        var notificationObj = {
            jobId: jobId,
            providerId: userId,
            buyerId: Jobs.findOne({_id: jobId}).userId,
            timeStamp: new Date(),
            notificationType: 'applicationAccepted',
            read: false
        }
        Jobs.update({_id: jobId, 'applications.userId': userId, 'applications.applied_at': applied_at, 'applications.freelancer_nets': freenets}, {$set: {'applications.$.app_status': 'accepted', applicationStatus: 'frozen', proposedBudget: freenets}})
        Notifications.insert(notificationObj);
    },
    confirmAssignment: function(jobId, buyerId) {
        var notificationObj = {
            jobId: jobId,
            providerId: Meteor.userId(),
            buyerId: buyerId,
            timeStamp: new Date(),
            notificationType: 'confirmAssignment',
            read: false
        }
        var proBudget = Jobs.findOne({_id: jobId}).proposedBudget;
        Jobs.update({_id: jobId}, {$set: {applicationStatus: 'assigned', assignedProvider: Meteor.userId(), projectBudget: proBudget}});
        Notifications.insert(notificationObj);
    },
    declineAssignment: function(jobId, userId) {
        var notificationObj = {
            jobId: jobId,
            providerId: userId,
            buyerId: Jobs.findOne({_id: jobId}).userId,
            timeStamp: new Date(),
            notificationType: 'declineAssignment',
            read: false
        }
        Jobs.update({_id: jobId, 'applications.userId': userId}, {$set: {applicationStatus: 'open', 'applications.$.app_status': 'declined'}});
        Notifications.insert(notificationObj);
    },
    submitAssignment: function(jobId) {
        Jobs.update({_id: jobId}, {$set: {assignmentStatus: 'submitted'}});
    },
    approveAssignment: function(jobId, providerId) {
        Jobs.update({_id: jobId}, {$set: {assignmentStatus: 'approved', applicationStatus: 'done'}});
        // Profiles.update({userId: providerId}, {$addToSet: {completedJobs: jobId}}, {$pull: {ongoingJobs: jobId}});
        // Buyers.update({userId: Meteor.userId()}, {$pull: {ongoingJobs: jobId}});
    },
    rejectAssignment: function(jobId) {
        Jobs.update({_id: jobId}, {$set: {assignmentStatus: 'rejected'}});
    },
    publishToFavsUpdate: function(job) {
        Jobs.update({_id: job._id}, {$set: {invited: true}});
        for(var i = 0; i < job.favoriteProviders.length; i++) {
            Profiles.update({userId: job.favoriteProviders[i]}, {$addToSet: {invitedJobs: job._id}});
            var notificationObj = {
                jobId: job._id,
                providerId: job.favoriteProviders[i],
                buyerId: Meteor.userId(),
                timeStamp: new Date(),
                notificationType: 'jobInvitation',
                read: false
            };
            Notifications.insert(notificationObj);
        }
    },
    routeNotification: function(providerId, buyerId, jobId) {
        var notificationObj = {
            providerId: providerId,
            buyerId: buyerId, 
            jobId: jobId,
            timeStamp: new Date(),
            notificationType: 'routedJob',
            read: false
        };
        Notifications.insert(notificationObj);
    },
    writeReview: function(assignedProvider, userId, jobId, timeReviewed, ratedPoints, reviewMessage) {
        var review = {
            providerId: assignedProvider,
            reviewedBy: userId,
            reviewedJobId: jobId,
            reviewedAt: timeReviewed,
            pointsRated: ratedPoints,
            reviewMessage: reviewMessage
        };
        Reviews.insert(review);
    },
    markRead: function(notificationId) {
        Notifications.update({_id: notificationId}, {$set: {read: true}});
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
    },
    addFile: function(file,id) {
        Tasks.update(id, {$addToSet: {files: file}});
    },
    deleteFile: function(file,id) {
        Tasks.update(id, {$pull: {files: file}});
    },
    recordTime:function(id,data,isCheckIn){
        if(isCheckIn){
            TimeSheet.update({'jobID':id},{$set:{'checkIn':data.in}});
        } else {
            var checkInTime = TimeSheet.findOne({'jobID':id}).checkIn;
            var obj = {};
            obj.checkIn = data.in;
            obj.checkOut = data.out;

            if(data.logID=="new") {
                obj.id = Random.id();
                TimeSheet.update({'jobID':id},{$set:{checkIn:''}});
                TimeSheet.update({'jobID':id},{$push:{'logs':obj}});
            } else {
                console.log(data.logID);
                console.log(id);

                TimeSheet.update({$and:[{'jobID':id},{"logs.id" : data.logID}]}, {"$set" : {"logs.$.checkIn" : obj.checkIn,"logs.$.checkOut" : obj.checkOut}});
            }
        }
    },
    removeLog:function(jobID,isCheckIn,logID) {
        TimeSheet.update({jobID:jobID},{$pull:{'logs':{'id':logID}}});
    }
});