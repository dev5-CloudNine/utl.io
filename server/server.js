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
        var notificationObj = {
            notificationType: 'userSignUp',
            timeStamp: new Date(),
            userId: userId,
            adminSide: true,
            adminRead: false
        };
        var welcomeNotification = {
            notificationType: 'welcomeNotification',
            timeStamp: new Date(),
            userId: userId,
            read: false
        };
        Notifications.insert(notificationObj);
        Notifications.insert(welcomeNotification);
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
            read: false,
            side: 'buyer',
            adminRead: false
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
            read: false,
            side: 'provider',
            adminRead: false
        }
        var jobNets = Jobs.findOne({_id: jobId}).freelancer_nets;
        Jobs.update({_id: jobId, 'applications.userId': userId}, {$set: {'applications.$.app_status': 'accepted', applicationStatus: 'frozen', proposedBudget: jobNets}});
        Notifications.insert(notificationObj);
    },
    "acceptCounterOffer": function(jobId, userId, applied_at, freenets) {
        var notificationObj = {
            jobId: jobId,
            providerId: userId,
            buyerId: Jobs.findOne({_id: jobId}).userId,
            timeStamp: new Date(),
            notificationType: 'applicationAccepted',
            read: false,
            side: 'provider',
            adminRead: false
        }
        Jobs.update({_id: jobId, 'applications.userId': userId, 'applications.freelancer_nets': freenets}, {$set: {'applications.$.app_status': 'accepted', applicationStatus: 'frozen', proposedBudget: freenets}})
        Notifications.insert(notificationObj);
    },
    confirmAssignment: function(jobId, buyerId) {
        var notificationObj = {
            jobId: jobId,
            providerId: Meteor.userId(),
            buyerId: buyerId,
            timeStamp: new Date(),
            notificationType: 'confirmAssignment',
            read: false,
            side: 'buyer',
            adminRead: false
        }
        var proBudget = Jobs.findOne({_id: jobId}).proposedBudget;
        Jobs.update({_id: jobId}, {$set: {applicationStatus: 'assigned', assignedProvider: Meteor.userId(), projectBudget: proBudget}});
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {assignedJobs: jobId}});
        Notifications.insert(notificationObj);
    },
    declineAssignment: function(jobId, userId) {
        var notificationObj = {
            jobId: jobId,
            providerId: userId,
            buyerId: Jobs.findOne({_id: jobId}).userId,
            timeStamp: new Date(),
            notificationType: 'declineAssignment',
            read: false,
            side: 'buyer',
            adminRead: false
        }
        Jobs.update({_id: jobId, 'applications.userId': userId}, {$set: {applicationStatus: 'open', 'applications.$.app_status': 'declined'}});
        Notifications.insert(notificationObj);
    },
    submitAssignment: function(jobId) {
        var notificationObj = {
            jobId: jobId,
            providerId: Meteor.userId(),
            buyerId: Jobs.findOne({_id: jobId}).userId,
            timeStamp: new Date(),
            notificationType: 'submitAssignment',
            read: false,
            side: 'buyer',
            adminRead: false
        }
        Jobs.update({_id: jobId}, {$set: {assignmentStatus: 'submitted'}});
        Notifications.insert(notificationObj);
    },
    approveAssignment: function(jobId, providerId) {
        var notificationObj = {
            jobId: jobId,
            providerId: providerId,
            buyerId: Meteor.userId(),
            timeStamp: new Date(),
            notificationType: 'approveAssignment',
            read: false,
            side: 'provider',
            adminRead: false
        }
        Jobs.update({_id: jobId}, {$set: {assignmentStatus: 'approved'}});
        Notifications.insert(notificationObj);
    },
    rejectAssignment: function(jobId) {
        var notificationObj = {
            jobId: jobId,
            providerId: Jobs.findOne({_id: jobId}).assignedProvider,
            buyerId: Meteor.userId(),
            timeStamp: new Date(),
            notificationType: 'rejectAssignment',
            read: false,
            side: 'provider',
            adminRead: false
        }
        Jobs.update({_id: jobId}, {$set: {assignmentStatus: 'rejected'}});
        Notifications.insert(notificationObj);
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
                read: false,
                side: 'provider',
                adminRead: false
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
            read: false,
            side: 'provider',
            adminRead: false
        };
        Notifications.insert(notificationObj);
    },
    requestPayment: function(jobId) {
        var notificationObj = {
            providerId: Meteor.userId(),
            buyerId: Jobs.findOne({_id: jobId}).userId,
            jobId: jobId,
            timeStamp: new Date(),
            notificationType: 'requestPayment',
            read: false,
            side: 'buyer',
            adminRead: false
        };
        Jobs.update({_id: jobId}, {$set: {applicationStatus: 'pending_payment', assignmentStatus: 'pending_payment'}});
        Profiles.update({userId: Meteor.userId()}, {$pull: {assignedJobs: jobId}});
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {paymentPendingJobs: jobId}});
        Notifications.insert(notificationObj);
    },
    approvePayment: function(jobId) {
        var notificationObj = {
            providerId: Jobs.findOne({_id: jobId}).assignedProvider,
            buyerId: Meteor.userId(),
            jobId: jobId,
            timeStamp: new Date(),
            notificationType: 'approvePayment',
            read: false,
            side: 'provider',
            adminRead: false
        };
        Jobs.update({_id: jobId}, {$set: {assignmentStatus: 'paid', applicationStatus: 'done'}});
        Profiles.update({userId: Jobs.findOne({_id: jobId}).assignedProvider}, {$addToSet: {completedJobs: jobId}});
        Profiles.update({userId: Jobs.findOne({_id: jobId}).assignedProvider}, {$pull: {paymentPendingJobs: jobId}});
        Notifications.insert(notificationObj);
    },
    reviewProvider: function(providerId, buyerId, jobId, timeReviewed, ratedPoints, reviewMessage) {
        var review = {
            providerId: providerId,
            buyerId: buyerId,
            reviewedBy: 'buyer',
            reviewedJobId: jobId,
            reviewedAt: timeReviewed,
            pointsRated: ratedPoints,
            reviewMessage: reviewMessage
        };
        Reviews.insert(review);
    },
    reviewBuyer: function(providerId, buyerId, jobId, timeReviewed, ratedPoints, reviewMessage) {
        var review = {
            providerId: providerId,
            buyerId: buyerId,
            reviewedBy: 'provider',
            reviewedJobId: jobId,
            reviewedAt: timeReviewed,
            pointsRated: ratedPoints,
            reviewMessage: reviewMessage
        }
        Reviews.insert(review);
    },
    markRead: function(notificationId, side) {
        if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
            Notifications.update({_id: notificationId}, {$set: {adminRead: true}});
            return;
        }
        Notifications.update({$and: [{_id: notificationId}, {side: side}]}, {$set: {read: true}});
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

                TimeSheet.update({$and:[{'jobID':id},{"logs.id" : data.logID}]}, {"$set" : {"logs.$.checkIn" : obj.checkIn,"logs.$.checkOut" : obj.checkOut}});
            }
        }
    },
    removeLog:function(jobID,isCheckIn,logID) {
        TimeSheet.update({jobID:jobID},{$pull:{'logs':{'id':logID}}});
    },
    addNewSkill : function(skill,ID) {
        Skills.insert({"label" : skill, "value" : skill });
        Profiles.update({_id: ID}, {$addToSet: {freelancerSkills: skill}});
    },
    updateImgURL: function(id,url){
        if(url){
            Meteor.users.update({_id:id},{$set:{'imgURL':url}});
        } else {
            Meteor.users.update({_id:id},{$set:{'imgURL':''}});
        }
    },
    updateResumeURL: function(id, url) {
        if(url) {
            Meteor.users.update({_id: id}, {$set: {'resumeURL': url}});
        } else {
            Meteor.users.update({_id: id}, {$set: {'resumeURL': ''}});
        }
    }
});