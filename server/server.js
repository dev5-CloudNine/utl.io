S3.config = {
    key: 'AKIAJFKN5NR3ZC2YF6KQ',
    secret: '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',
    bucket: 'project-tasks',
    region: 'us-east-1' // Only needed if not "us-east-1" or "us-standard"
};

Slingshot.createDirective('userImages', Slingshot.S3Storage, {
    bucket: 'project-tasks',
    region: 'us-east-1',
    AWSAccessKeyId: 'AKIAJFKN5NR3ZC2YF6KQ',
    AWSSecretAccessKey: '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',
    acl: 'public-read',
    authorize: function() {
        return true
    },
    key: function(file){
        return new Date().getTime() + "_" + file.name;
    }
})

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

    addToFav: function(id, role) {
        if(role == 'buyer' || role == 'corporate-manager'){
            var notificationObj = {
                buyerId: Meteor.userId(),
                providerId: id,
                notificationType: 'addFavProvider',
                timeStamp: new Date(),
                side: 'provider',
                read: false,
                adminRead: false
            }
        } else if(role == 'provider' || role == 'corporate-provider') {
            var notificationObj = {
                providerId: Meteor.userId(),
                buyerId: id,
                notificationType: 'addFavBuyer',
                timeStamp: new Date(),
                side: 'buyer',
                read: false,
                adminRead: false
            }
        }
        Meteor.users.update(Meteor.userId(), {$addToSet: {favoriteUsers: id}});
        Meteor.users.update({_id: id}, {$inc: {favCount: 1}});
        Notifications.insert(notificationObj);
        if(role == 'buyer' || role =='corporate-manager') {
            var providerName = Profiles.findOne({userId: id}).name;
            var buyerDetails = Buyers.findOne({userId: Meteor.userId()});
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: id})),
                from: FROM_EMAIL,
                subject: 'A user has added you to his/her favorites.',
                text: 'Hello, ' + providerName + ', ' + buyerDetails.name + ' has added you to his/her favorites. Click the following link to see his/her profile. ' + Meteor.absoluteUrl('buyers/' + buyerDetails._id + '/' + buyerDetails.slug())
            })
        } else if(role == 'provider' || role == 'corporate-provider') {
            var buyerName = Buyers.findOne({userId: id}).name;
            var providerDetails = Profiles.findOne({userId: Meteor.userId()});
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: id})),
                from: FROM_EMAIL,
                subject: 'A user has added you to his/her favorites.',
                text: 'Hello ' + buyerName + ', ' + providerDetails.name + ' has added you to his/her favorites. Click the following link to see his/her profile. ' + Meteor.absoluteUrl('profiles/' + providerDetails._id + '/' + providerDetails.slug())
            })
        }
    },
    removeFromFav: function(id, role) {
        if(role == 'buyer' || role == 'corporate-manager') {
            var notificationObj = {
                buyerId: Meteor.userId(),
                providerId: id,
                notificationType: 'remFavProvider',
                timeStamp: new Date(),
                side: 'provider',
                read: false,
                adminRead: false
            }
        }else if(role == 'provider' || role == 'corporate-provider') {
            var notificationObj = {
                providerId: Meteor.userId(),
                buyerId: id,
                notificationType: 'remFavBuyer',
                timeStamp: new Date(),
                side: 'buyer',
                read: false,
                adminRead: false
            }
        }
        Meteor.users.update(Meteor.userId(), {$pull: {favoriteUsers: id}});
        Meteor.users.update({_id: id}, {$inc: {favCount: -1}});
        Notifications.insert(notificationObj);
        if(role == 'buyer' || role =='corporate-manager') {
            var providerName = Profiles.findOne({userId: id}).name;
            var buyerDetails = Buyers.findOne({userId: Meteor.userId()});
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: id})),
                from: FROM_EMAIL,
                subject: 'A user has removed you from his/her favorites.',
                text: 'Hello, ' + providerName + ', ' + buyerDetails.name + ' has removed you from his/her favorites. Click the following link to see his/her profile. ' + Meteor.absoluteUrl('buyers/' + buyerDetails._id + '/' + buyerDetails.slug())
            })
        } else if(role == 'provider' || role == 'corporate-provider') {
            var buyerName = Buyers.findOne({userId: id}).name;
            var providerDetails = Profiles.findOne({userId: Meteor.userId()});
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: id})),
                from: FROM_EMAIL,
                subject: 'A user has removed you from his/her favorites.',
                text: 'Hello ' + buyerName + ', ' + providerDetails.name + ' has removed you from his/her favorites. Click the following link to see his/her profile. ' + Meteor.absoluteUrl('profiles/' + providerDetails._id + '/' + providerDetails.slug())
            })
        }
    },
    applyForThisJob: function(jobId, applicationDetails) {
        var providerName = Profiles.findOne({userId: applicationDetails.userId}).name;
        var buyerName = Buyers.findOne({userId: Jobs.findOne({_id: jobId}).userId}).name;
        var jobName = Jobs.findOne({_id: jobId}).title;
        var jobSlug = Jobs.findOne({_id: jobId}).slug();
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
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: Jobs.findOne({_id: jobId}).userId})),
            from: FROM_EMAIL,
            subject: 'A provider has applied for the job you posted.',
            text: 'Hello ' + buyerName + ', ' + providerName + ' has applied for you job ' + jobName + '. Click on the following link to see the list of applications. ' + Meteor.absoluteUrl('jobs/' + jobId + '/' + jobSlug)
        });
    },
    removeFromAppliedJobs: function(jobId, userId) {
        Jobs.update({$and:[{_id:jobId},{'applications.userId':userId}]},{$pull:{"applications":{"userId":userId}}});
        Profiles.update({userId: userId}, {$pull: {appliedJobs: jobId}});
    },
    acceptApplication: function(jobId, userId, applicationTime) {
        var buyerName = Buyers.findOne({userId: Jobs.findOne({_id: jobId}).userId}).name;
        var jobname = Jobs.findOne({_id: jobId}).title;
        var providerName = Profiles.findOne({userId: userId}).name;
        var jobSlug = Jobs.findOne({_id: jobId}).slug();
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
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: userId})),
            from: FROM_EMAIL,
            subject: buyerName + ' has accepted your application for the job ' + jobname,
            text: 'Hello ' + providerName + ', ' + buyerName + 'has accepted you application for the job '+ jobname + '. You may confirm the assignment or reject the assignment by clicking the following link. ' + Meteor.absoluteUrl('jobs/' + jobId + '/' + jobSlug)
        })
    },
    "acceptCounterOffer": function(jobId, userId, applied_at, freenets) {
        var buyerName = Buyers.findOne({userId: Jobs.findOne({_id: jobId}).userId}).name;
        var jobname = Jobs.findOne({_id: jobId}).title;
        var providerName = Profiles.findOne({userId: userId}).name;
        var jobSlug = Jobs.findOne({_id: jobId}).slug();
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
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: userId})),
            from: FROM_EMAIL,
            subject: buyerName + ' has accepted your counter offer for the job ' + jobname,
            text: 'Hello ' + providerName + ', ' + buyerName + 'has accepted you application for the job '+ jobname + '. You may confirm the assignment or reject the assignment by clicking the following link. ' + Meteor.absoluteUrl('jobs/' + jobId + '/' + jobSlug)
        })
    },
    confirmAssignment: function(jobId, buyerId) {
        var jobName = Jobs.findOne({_id: jobId}).title;
        var providerName = Profiles.findOne({userId: Meteor.userId()}).name;
        var jobSlug = Jobs.findOne({_id: jobId}).slug();
        var buyerName = Buyers.findOne({userId: buyerId}).name;
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
        Meteor.users.update({_id: Meteor.userId()}, {$addToSet: {contacts: buyerId+":"+jobId}});
        Meteor.users.update({_id: buyerId}, {$addToSet: {contacts: Meteor.userId()+":"+jobId}});
        var proBudget = Jobs.findOne({_id: jobId}).proposedBudget;
        Jobs.update({_id: jobId}, {$set: {applicationStatus: 'assigned', assignedProvider: Meteor.userId(), projectBudget: proBudget}});
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {assignedJobs: jobId}});
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: buyerId})),
            from: FROM_EMAIL,
            subject: 'Provider has confirmed assignment.',
            text: 'Hello ' + buyerName + ', ' + providerName + ' has confirmed the assignment for the job ' + jobName + ' and the job is now assigned. ' + Meteor.absoluteUrl('jobs/' + jobId + '/' + jobSlug)
        });
    },
    declineAssignment: function(jobId, userId) {
        var providerName = Profiles.findOne({userId: userId}).name;
        var buyerName = Buyers.findOne({userId: Jobs.findOne({_id: jobId}).userId}).name;
        var jobName = Jobs.findOne({_id: jobId}).title;
        var jobSlug = Jobs.findOne({_id: jobId}).slug();
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
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: Jobs.findOne({_id: jobId}).userId})),
            from: FROM_EMAIL,
            subject: 'Provider has declined assignment.',
            text: 'Hello ' + buyerName + ', ' + providerName + ' has declined the assignment for the job ' + jobName + ' and the job is now Open. Click the following link to choose a different provider. ' + Meteor.absoluteUrl('jobs/' + jobId + '/' + jobSlug)
        })
    },
    submitAssignment: function(jobId) {
        var providerName = Profiles.findOne({userId: Meteor.userId()}).name;
        var buyerName = Buyers.findOne({userId: Jobs.findOne({_id: jobId}).userId}).name;
        var jobName = Jobs.findOne({_id: jobId}).title;
        var jobSlug = Jobs.findOne({_id: jobId}).slug();
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
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: Jobs.findOne({_id: jobId}).userId})),
            from: FROM_EMAIL,
            subject: 'Provider has submitted assignment for your job.',
            text: 'Hello ' + buyerName + ', ' + providerName + ' has submitted assignment for your job ' + jobName + '. Click the following link to either approve or reject the assignment. ' + Meteor.absoluteUrl('jobs/' + jobId + '/' + jobSlug)
        })
    },
    approveAssignment: function(jobId, providerId) {
        var providerName = Profiles.findOne({userId: providerId}).name;
        var buyerName = Buyers.findOne({userId: Meteor.userId()}).name;
        var jobName = Jobs.findOne({_id: jobId}).name;
        var jobSlug = Jobs.findOne({_id: jobId}).slug();
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
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: providerId})),
            from: FROM_EMAIL,
            subject: 'Buyer has approved your assignment.',
            text: 'Hello ' + providerName + ', ' + buyerName + ' has approved your assignment for the job ' + jobName + '. Click the following link to request for payment. ' + Meteor.absoluteUrl('jobs/' + jobId + '/' + jobSlug)
        });
    },
    rejectAssignment: function(jobId) {
        var providerName = Profiles.findOne({userId: Jobs.findOne({_id: jobId}).assignedProvider}).name;
        var buyerName = Buyers.findOne({userId: Meteor.userId()}).name;
        var jobName = Jobs.findOne({_id: jobId}).title;
        var jobSlug = Jobs.findOne({_id: jobId}).slug();
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
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: Jobs.findOne({_id: jobId}).assignedProvider})),
            from: FROM_EMAIL,
            subject: 'Buyer has rejected your assignment.',
            text: 'Hello ' + providerName + ', ' + buyerName + ' has rejected your assignment for the job ' + jobName + '. Click the following link to submit the assignment. ' + Meteor.absoluteUrl('jobs/' + jobId + '/' + jobSlug)
        })
    },
    publishToFavsUpdate: function(job) {
        Jobs.update({_id: job._id}, {$set: {invited: true}});
        for(var i = 0; i < job.favoriteProviders.length; i++) {
            var providerName = Profiles.findOne({userId: job.favoriteProviders[i]}).name;
            var buyerName = Buyers.findOne({userId: Meteor.userId()}).name;
            var jobName = job.title;
            var jobSlug = Jobs.findOne({_id: job._id}).slug();
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
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: job.favoriteProviders[i]})),
                from: FROM_EMAIL,
                subject: 'A buyer has invited to bid on his job.',
                text: 'Hello' + providerName + ', '+ buyerName + ' has invited you to bid on one of his jobs ' + jobName + '. Click on the following link to apply or counter offer the job. ' + Meteor.absoluteUrl('jobs/' + job._id + '/' + jobSlug)
            })
        }
    },
    routeNotification: function(providerId, buyerId, jobId) {
        Profiles.update({userId: providerId}, {$addToSet: {routedJobs: jobId}});
        var providerName = Profiles.findOne({userId: providerId}).name;
        var buyerName = Buyers.findOne({userId: buyerId}).name;
        var jobName = Jobs.findOne({_id: jobId}).title;
        var jobSlug = Jobs.findOne({_id: jobId}).slug();
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
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: providerId})),
            from: FROM_EMAIL,
            subject: 'A buyer has directly routed a job to you.',
            text: 'Hello ' + providerName + ', ' + buyerName + ' has directly routed a job ' + jobName + ' to you. You may confirm the assignment or reject the assignment by clicking the following link. ' + Meteor.absoluteUrl('jobs/' + jobId + '/' + jobSlug)
        })
    },
    requestPayment: function(jobId) {
        var providerName = Profiles.findOne({userId: Meteor.userId()}).name;
        var buyerName = Buyers.findOne({userId: Jobs.findOne({_id: jobId}).userId}).name;
        var jobName = Jobs.findOne({_id: jobId}).name;
        var jobSlug = Jobs.findOne({_id: jobId}).slug();
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
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: Jobs.findOne({_id: jobId}).userId})),
            from: FROM_EMAIL,
            subject: 'A provider has requested payment for your job.',
            text: 'Hello ' + buyerName + ', ' + providerName + ' has requested payment for the job ' + jobName + '. Click on the following link to approve the payment. ' + Meteor.absoluteUrl('jobs/' + jobId + '/' + jobSlug)
        });
    },
    approvePayment: function(jobId) {
        var providerName = Profiles.findOne({userId: Jobs.findOne({_id: jobId}).assignedProvider}).name;
        var buyerName = Buyers.findOne({userId: Meteor.userId()}).name;
        var jobName = Jobs.findOne({_id: jobId}).title;
        var jobSlug = Jobs.findOne({_id: jobId}).slug();
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
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: Jobs.findOne({_id: jobId}).assignedProvider})),
            from: FROM_EMAIL,
            subject: 'Buyer has approved payment for your job.',
            text: 'Hello ' + providerName + ', ' + buyerName + ' has approved payment for the job ' + jobName + '. Now the job is complete and you may rate the buyer.'
        })
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