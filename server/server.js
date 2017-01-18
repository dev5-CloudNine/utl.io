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
    "verifyEmailTrue": function(userId, invitedBuyer) {
        Buyers.update({userId: invitedBuyer}, {$addToSet: {invitees: userId}});
        Meteor.users.update({_id:userId,"emails.verified":false},{$set:{'emails.$.verified':true, invitedBy: invitedBuyer}});
        return;
    },
    "postMessage" : function(obj) {
    	Messages.insert(obj);
    },
    "deleteMsg": function(id) {
        Messages.remove({parent:id});
        Messages.remove({_id:id});
    },
    "markMessageRead": function(id){
        Messages.update({'_id':id},{$set:{'read':true}});
    },
    "createInvite": function(obj) {
        var id = TempInvitation.insert(obj);
        Email.send({
          to: obj.email,
          from: FROM_EMAIL,
          subject: "You are invited to join "+obj.buyerName ,
          text: "Please click on the following link to join " + obj.buyerName + ". "
                + Meteor.absoluteUrl("inviteeSignUp/"+id)
        });
    },
    "deleteInvite": function(id) {
        TempInvitation.remove({_id:id});
    },
    'addJobCategory': function(category) {
        Categories.insert({label: category, value: category});
    },
    "addJobSubCategory": function(parent, subCategory) {
        SubCategories.insert({label: subCategory, value: subCategory, parentId: parent});
    },
    'updateJobSubCategory': function(parent, subCategory, subCatId) {
        SubCategories.update({_id: subCatId}, {$set: {parentId: parent, label: subCategory, value: subCategory}});
    },
    'updateJobCategory': function(prevName, categoryId, categoryName) {
        SubCategories.update({parentId: prevName}, {$set: {parentId: categoryName}}, {multi: true});
        Categories.update({_id: categoryId}, {$set: {label: categoryName, value: categoryName}});
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
    'individualprovider': function(query, options) {
        if(!query) return [];
        options = options || {}
        if(options.limit) {
            options.limit = Math.min(50, Math.abs(options.limit));
        } else {
            options.limit = 50;
        }
        var regex = new RegExp("^" + query,'gi');
        return Profiles.find({$or: [{firstName: {$regex: regex}}, {lastName: {$regex: regex}}, {readableID: {$regex: regex}}, {title: {$regex: regex}}]}, options).fetch();
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
            var providerDetails = Profiles.findOne({userId: id});
            var buyerDetails = Buyers.findOne({userId: Meteor.userId()});
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: id})),
                cc: providerDetails.smsAddress,
                from: FROM_EMAIL,
                subject: 'A user has added you to his/her favorites.',
                text: 'Hello, ' + providerDetails.firstName + ' ' + providerDetails.lastName + ', ' + buyerDetails.firstName + buyerDetails.lastName + ' has added you to his/her favorites. Click the following link to see his/her profile. ' + Meteor.absoluteUrl('buyers/' + buyerDetails._id + '/' + buyerDetails.slug())
            })
        } else if(role == 'provider' || role == 'corporate-provider') {
            var buyerDetails = Buyers.findOne({userId: id});
            var providerDetails = Profiles.findOne({userId: Meteor.userId()});
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: id})),
                cc: buyerDetails.smsAddress,
                from: FROM_EMAIL,
                subject: 'A user has added you to his/her favorites.',
                text: 'Hello ' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ', ' + providerDetails.firstName + ' ' + providerDetails.lastName + ' has added you to his/her favorites. Click the following link to see his/her profile. ' + Meteor.absoluteUrl('profiles/' + providerDetails._id + '/' + providerDetails.slug())
            })
        }
    },
    removeFromFav: function(id, role) {
        if(role == 'buyer' || role == 'dispatcher') {
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
            var providerDetails = Profiles.findOne({userId: id})
            var buyerDetails = Buyers.findOne({userId: Meteor.userId()});
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: id})),
                cc: providerDetails.smsAddress,
                from: FROM_EMAIL,
                subject: 'A user has removed you from his/her favorites.',
                text: 'Hello, ' + providerDetails.firstName + ' ' + providerDetails.lastName + ', ' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has removed you from his/her favorites. Click the following link to see his/her profile. ' + Meteor.absoluteUrl('buyers/' + buyerDetails._id + '/' + buyerDetails.slug())
            })
        } else if(role == 'provider' || role == 'corporate-provider') {
            var buyerDetails = Buyers.findOne({userId: id})
            var providerDetails = Profiles.findOne({userId: Meteor.userId()});
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: id})),
                cc: buyerDetails.smsAddress,
                from: FROM_EMAIL,
                subject: 'A user has removed you from his/her favorites.',
                text: 'Hello ' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ', ' + providerDetails.firstName + ' ' + providerDetails.lastName + ' has removed you from his/her favorites. Click the following link to see his/her profile. ' + Meteor.absoluteUrl('profiles/' + providerDetails._id + '/' + providerDetails.slug())
            })
        }
    },
    applyForThisJob: function(jobId, applicationDetails) {
        var providerDetails = Profiles.findOne({userId: applicationDetails.userId});
        var buyerDetails;
        var jobPostedUser = Jobs.findOne({_id: jobId}).userId;
        if(Roles.userIsInRole(jobPostedUser, ['dispatcher'])) {
            buyerDetails = Dispatchers.findOne({userId: jobPostedUser});
        } else {
            buyerDetails = Buyers.findOne({userId: Jobs.findOne({_id: jobId}).userId});
        }
        var jobDetails = Jobs.findOne({_id: jobId});
        var notificationObj = {
            jobId: jobId,
            providerId: applicationDetails.userId,
            buyerId: jobDetails.userId,
            timeStamp: applicationDetails.applied_at,
            notificationType: 'newJobApplication',
            read: false,
            side: 'buyer',
            adminRead: false
        }
        Jobs.update(jobId, {$addToSet: {applications: applicationDetails}});
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {allJobs: jobId}});
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {appliedJobs: jobId}});
        if(jobDetails.invited) {
            Profiles.update({userId: Meteor.userId()}, {$pull: {invitedJobs: jobId}});
        }
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: jobDetails.userId})),
            cc: buyerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'A provider has applied for the job you posted.',
            html: 'Hello ' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ',<br> ' + providerDetails.firstName + ' ' + providerDetails.lastName + ' has applied for your job posted. <br><a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">' + jobDetails.readableID + ' - ' + jobDetails.title + '</a><br><a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">Click here</a> to see the list of applications.'
        });
    },
    removeFromAppliedJobs: function(jobId, userId) {
        var jobDetails = Jobs.findOne({_id: jobId});
        Jobs.update({$and:[{_id:jobId},{'applications.userId':userId}]},{$pull:{"applications":{"userId":userId}}});
        Profiles.update({userId: userId}, {$pull: {appliedJobs: jobId}});
        Profiles.update({userId: userId}, {$pull: {allJobs: jobId}});
    },
    acceptApplication: function(jobId, userId, applicationTime) {
        var jobDetails = Jobs.findOne({_id: jobId});
        var buyerId = jobDetails.userId;
        var buyerDetails;
        if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
            buyerDetails = Dispatchers.findOne({userId: buyerId});
        } else {
            buyerDetails = Buyers.findOne({userId: buyerId});
        }
        var providerDetails = Profiles.findOne({userId: userId});
        var notificationObj = {
            jobId: jobId,
            providerId: userId,
            buyerId: jobDetails.userId,
            timeStamp: new Date(),
            notificationType: 'applicationAccepted',
            read: false,
            side: 'provider',
            adminRead: false
        }
        var jobNets = jobDetails.freelancer_nets;
        Jobs.update({_id: jobId, 'applications.userId': userId}, {$set: {'applications.$.app_status': 'accepted', applicationStatus: 'assigned', assignmentStatus: 'not_confirmed'}});
        Profiles.update({userId: userId}, {$pull: {appliedJobs: jobId}});
        Profiles.update({userId: userId}, {$addToSet: {assignedJobs: jobId}});
        Jobs.update({_id: jobId}, {$set: {proposedBudget: jobNets}});
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: userId})),
            cc: providerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'Buyer has accepted your application for the job ' + jobDetails.title,
            html: 'Hello ' + providerDetails.firstName + ' ' + providerDetails.lastName + ', <br>' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has accepted you application for the job you applied. <br><a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">' + jobDetails.readableID + ' - ' + jobDetails.title + '</a><br>You may confirm the assignment or reject the assignment by <a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">clicking here</a>'
        })
    },
    acceptHighBudgetCO: function(difference, buyerId) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        Wallet.update({userId: buyerId}, {$inc: {accountBalance: -difference}});
        Wallet.update({userId: adminId}, {$inc: {accountBalance: difference}});
    },
    acceptLowBudgetCO: function(difference, buyerId) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        Wallet.update({userId: buyerId}, {$inc: {accountBalance: difference}});
        Wallet.update({userId: adminId}, {$inc: {accountBalance: -difference}});
    },
    "acceptCounterOffer": function(jobId, userId, applied_at, buyerCost, freenets) {
        var jobDetails = Jobs.findOne({_id: jobId});
        var buyerId = jobDetails.userId;
        var buyerDetails;
        if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
            buyerDetails = Dispatchers.findOne({userId: buyerId});
        } else {
            buyerDetails = Buyers.findOne({userId: buyerId});
        }
        var providerDetails = Profiles.findOne({userId: userId});
        var notificationObj = {
            jobId: jobId,
            providerId: userId,
            buyerId: jobDetails.userId,
            timeStamp: new Date(),
            notificationType: 'applicationAccepted',
            read: false,
            side: 'provider',
            adminRead: false
        }
        Jobs.update({_id: jobId, 'applications.userId': userId, 'applications.freelancer_nets': freenets}, {$set: {'applications.$.app_status': 'accepted', applicationStatus: 'assigned', assignmentStatus: 'not_confirmed'}})
        Jobs.update({_id: jobId}, {$set: {proposedBudget: freenets}});
        Profiles.update({userId: userId}, {$addToSet: {assignedJobs: jobId}});
        Profiles.update({userId: userId}, {$pull: {appliedJobs: jobId}});
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: userId})),
            cc: providerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'Buyer has accepted your counter offer for the job ' + jobDetails.title,
            html: 'Hello ' + providerDetails.firstName + ' ' + providerDetails.lastName + ', <br>' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has accepted you application for the job you applied. <br><a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">' + jobDetails.readableID + ' - ' + jobDetails.title + '</a><br>You may confirm the assignment or reject the assignment by <a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">clicking here</a>'
        })
    },
    rejectApplication: function(jobId, userId, applied_at) {
        Profiles.update({userId: userId}, {$pull: {assignedJobs: jobId}});
        Jobs.update({_id: jobId, 'applications.userId': userId}, {$set: {'applications.$.app_status': 'rejected', applicationStatus: 'open'}})
    },
    rejectCounterOffer: function(jobId, userId, applied_at, difference) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        var jobDetails = Jobs.findOne({_id: jobId});
        Jobs.update({_id: jobId, 'applications.userId': userId}, {$set: {'applications.$.app_status': 'rejected', applicationStatus: 'open'}})
        Wallet.update({userId: adminId}, {$inc: {accountBalance: -difference}});
        Wallet.update({userId: jobDetails.userId}, {$inc: {accountBalance: difference}});
    },
    confirmAssignment: function(jobId, buyerId) {
        var jobDetails = Jobs.findOne({_id: jobId});
        var buyerId = jobDetails.userId;
        var buyerDetails;
        if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
            buyerDetails = Dispatchers.findOne({userId: buyerId});
        } else {
            buyerDetails = Buyers.findOne({userId: buyerId});
        }
        var providerDetails = Profiles.findOne({userId: Meteor.userId()});
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
        var proBudget = jobDetails.proposedBudget;
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        var buyerCost = jobDetails.your_cost;
        Jobs.update({_id: jobId}, {$set: {assignedProvider: Meteor.userId(), projectBudget: proBudget, assignmentStatus: 'confirmed'}});
        var applicants = jobDetails.applications;
        for(var i = 0; i < applicants.length; i++) {
            Profiles.update({userId: applicants[i].userId}, {$pull: {appliedJobs: jobId}});
        }
        if(jobDetails.invited) {
            for(var i = 0; i < jobDetails.invitedproviders.length; i++) {
                if(jobDetails.invitedproviders[i] != jobDetails.assignedProvider) {
                    Profiles.update({userId: jobDetails.invitedproviders[i]}, {$pull: {invitedJobs: jobId}});
                }
            }
        }
        if(jobDetails.routed) {
            Jobs.update({_id: jobId}, {$set: {projectBudget: jobDetails.freelancer_nets}});
            Profiles.update({userId: Meteor.userId()}, {$pull: {routedJobs: jobId}});
        }
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: buyerId})),
            cc: buyerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'Provider has confirmed to do the job.',
            html: 'Hello ' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ', <br>' + providerDetails.firstName + ' ' + providerDetails.lastName + ' has confirmed the assignment for the job.<br><a href="' + Meteor.absoluteUrl('jobs/' + jobId + '/') + '">' + jobDetails.readableID + ' - ' + jobDetails.title + '</a><br>The job is now assigned.'
        });
    },
    declineAssignment: function(jobId, userId) {
        var jobDetails = Jobs.findOne({_id: jobId});
        var providerDetails = Profiles.findOne({userId: userId});
        var buyerId = jobDetails.userId;
        var buyerDetails;
        if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
            buyerDetails = Dispatchers.findOne({userId: buyerId});
        } else {
            buyerDetails = Buyers.findOne({userId: buyerId});
        }
        var notificationObj = {
            jobId: jobId,
            providerId: userId,
            buyerId: buyerId,
            timeStamp: new Date(),
            notificationType: 'declineAssignment',
            read: false,
            side: 'buyer',
            adminRead: false
        }
        Jobs.update({_id: jobId, 'applications.userId': userId}, {$set: {applicationStatus: 'open', 'applications.$.app_status': 'declined'}});
        Profiles.update({userId: userId}, {$addToSet: {declinedJobs: jobId}});
        Profiles.update({userId: userId}, {$pull: {appliedJobs: jobId}});
        if(jobDetails.routed) {
            Profiles.update({userId: userId}, {$pull: {routedJobs: jobId}});
            Jobs.update({_id: jobId}, {$unset: {routed: '', selectedProvider: ''}});
            Jobs.update({$and:[{_id:jobId},{'applications.userId':userId}]},{$pull:{"applications":{"userId":userId}}});
        }
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: jobDetails.userId})),
            cc: buyerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'Provider has declined to do the job.',
            html: 'Hello ' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ',<br>' + providerDetails.firstName + ' ' + providerDetails.lastName + ' has declined the assignment for the job.<br><a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">' + jobDetails.readableID + ' - ' + jobDetails.title + '</a><br>The job is now open. <a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">Click here</a> to choose a different provider.'
        })
    },
    submitAssignment: function(jobId) {
        var providerDetails = Profiles.findOne({userId: Meteor.userId()});
        var jobDetails = Jobs.findOne({_id: jobId});
        var buyerId = jobDetails.userId;
        var buyerDetails;
        if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
            buyerDetails = Dispatchers.findOne({userId: buyerId});
        } else {
            buyerDetails = Buyers.findOne({userId: buyerId});
        }
        var notificationObj = {
            jobId: jobId,
            providerId: Meteor.userId(),
            buyerId: buyerId,
            timeStamp: new Date(),
            notificationType: 'submitAssignment',
            read: false,
            side: 'buyer',
            adminRead: false
        }
        Jobs.update({_id: jobId}, {$set: {assignmentStatus: 'submitted'}});
        Profiles.update({userId: Meteor.userId()}, {$pull: {assignedJobs: jobId}});
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {pendingApproval: jobId}});
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: Jobs.findOne({_id: jobId}).userId})),
            cc: buyerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'Provider has submitted job for approval.',
            html: 'Hello ' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ',<br>' + providerDetails.firstName + ' ' + providerDetails.lastName + ' has submitted job for approval. <br><a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">' + jobDetails.readableID + ' - ' + jobDetails.title + '</a><br><a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">Click here</a> to either approve or reject the job done.'
        })
    },
    approveAssignment: function(jobId, providerId) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        var providerDetails = Profiles.findOne({userId: providerId})
        var jobDetails = Jobs.findOne({_id: jobId});
        var buyerId = jobDetails.userId;
        var buyerDetails;
        if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
            buyerDetails = Dispatchers.findOne({userId: buyerId});
        } else {
            buyerDetails = Buyers.findOne({userId: buyerId});
        }
        var notificationObj = {
            jobId: jobId,
            providerId: providerId,
            buyerId: buyerId,
            timeStamp: new Date(),
            notificationType: 'approveAssignment',
            read: false,
            side: 'provider',
            adminRead: false
        }
        var invoiceObject = {
            jobId: jobId,
            providerId: providerDetails.userId,
            buyerId: buyerId,
            budget: jobDetails.projectBudget,
            date: new Date(),
            invoiceId: jobDetails.readableID,
            invoiceStatus: 'paid'
        }
        Invoices.insert(invoiceObject);
        Jobs.update({_id: jobId}, {$set: {assignmentStatus: 'approved', applicationStatus: 'paid'}});
        Profiles.update({userId: providerId}, {$addToSet: {paidJobs: jobId}});        
        Profiles.update({userId: providerId}, {$pull: {pendingApproval: jobId}});        
        Wallet.update({userId: adminId}, {$inc: {accountBalance: -jobDetails.projectBudget}});
        Wallet.update({userId: jobDetails.userId}, {$inc: {amountSpent: jobDetails.projectBudget}});
        Wallet.update({userId: providerDetails.userId}, {$inc: {accountBalance: jobDetails.projectBudget}});
        Wallet.update({userId: providerDetails.userId}, {$inc: {amountEarned: jobDetails.projectBudget}});
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: providerId})),
            cc: providerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'Buyer has approved the job.',
            html: 'Hello ' + providerDetails.firstName + ' ' + providerDetails.lastName + ',<br>' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has approved the job you submitted.'
        });
    },
    rejectAssignment: function(jobId) {
        var jobDetails = Jobs.findOne({_id: jobId});
        var providerDetails = Profiles.findOne({userId: jobDetails.assignedProvider});
        var buyerId = jobDetails.userId;
        var buyerDetails;
        if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
            buyerDetails = Dispatchers.findOne({userId: buyerId});
        } else {
            buyerDetails = Buyers.findOne({userId: buyerId});
        }
        var notificationObj = {
            jobId: jobId,
            providerId: providerDetails.userId,
            buyerId: buyerId,
            timeStamp: new Date(),
            notificationType: 'rejectAssignment',
            read: false,
            side: 'provider',
            adminRead: false
        }
        Jobs.update({_id: jobId}, {$set: {assignmentStatus: 'rejected'}});
        Profiles.update({userId: jobDetails.assignedProvider}, {$pull: {pendingApproval: jobId}});
        Profiles.update({userId: jobDetails.assignedProvider}, {$addToSet: {assignedJobs: jobId}});
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: Jobs.findOne({_id: jobId}).assignedProvider})),
            cc: providerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'Buyer has rejected your assignment.',
            html: 'Hello ' + providerDetails.firstName + ' ' + providerDetails.lastName + ',<br>' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has rejected the job you submitted for approval.<br><a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">' + jobDetails.readableID + ' - ' + jobDetails.title + '</a><br><a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">Click here</a> to view details and discuss the matter with the buyer.'
        })
    },
    publishToFavsUpdate: function(job, favoriteProviders) {
        Jobs.update({_id: job._id}, {$set: {invited: true}});
        for(var i = 0; i < favoriteProviders.length; i++) {
            var providerDetails = Profiles.findOne({userId: favoriteProviders[i]});
            var buyerId = job.userId;
            var buyerDetails;
            if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
                buyerDetails = Dispatchers.findOne({userId: buyerId});
            } else {
                buyerDetails = Buyers.findOne({userId: buyerId});
            }
            Profiles.update({userId: favoriteProviders[i]}, {$addToSet: {invitedJobs: job._id}});
            var notificationObj = {
                jobId: job._id,
                providerId: favoriteProviders[i],
                buyerId: buyerId,
                timeStamp: new Date(),
                notificationType: 'jobInvitation',
                read: false,
                side: 'provider',
                adminRead: false
            };
            Notifications.insert(notificationObj);
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: favoriteProviders[i]})),
                cc: providerDetails.smsAddress,
                from: FROM_EMAIL,
                subject: 'You have a new routed job.',
                html: 'Hello ' + providerDetails.firstName + ' ' + providerDetails.lastName + ',<br>' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has routed a job to you.<br><a href="' + Meteor.absoluteUrl('jobs/' + job._id) + '">ID: ' + job.readableID + '<br>' + job.title + '<br><a href="' + Meteor.absoluteUrl('jobs/' + job._id) + '">Click here</a> to apply or counter offer the job.'
            })
        }
    },
    publishToIndividualUpdate: function(job, selectedProviders) {
        for(var i = 0; i < selectedProviders.length; i++) {
            var providerDetails = Profiles.findOne({userId: selectedProviders[i]});
            var buyerId = job.userId;
            var buyerDetails;
            if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
                buyerDetails = Dispatchers.findOne({userId: buyerId});
            } else {
                buyerDetails = Buyers.findOne({userId: buyerId});
            }
            Profiles.update({userId: selectedProviders[i]}, {$addToSet: {invitedJobs: job._id}});
            var notificationObj = {
                jobId: job._id,
                providerId: selectedProviders[i],
                buyerId: buyerId,
                timeStamp: new Date(),
                notificationType: 'jobInvitation',
                read: false,
                side: 'provider',
                adminRead: false
            };
            Notifications.insert(notificationObj);
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: selectedProviders[i]})),
                cc: providerDetails.smsAddress,
                from: FROM_EMAIL,
                subject: 'A buyer has invited to bid on his job.',
                html: 'Hello ' + providerDetails.firstName + ' ' + providerDetails.lastName + ',<br>' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has invited you to bid on one of his jobs.<br><a href="' + Meteor.absoluteUrl('jobs/' + job._id) + '">' + job.readableID + ' - ' + job.title + '<br><a href="' + Meteor.absoluteUrl('jobs/' + job._id) + '">Click here</a> to apply or counter offer the job.'
            });
        }
        Jobs.update({_id: job._id}, {$set: {invited: true}});
    },
    routeNotification: function(buyerId, doc) {
        Profiles.update({userId: doc.selectedProvider}, {$addToSet: {assignedJobs: doc._id}});
        Profiles.update({userId: doc.selectedProvider}, {$addToSet: {allJobs: doc._id}});
        var providerDetails = Profiles.findOne({userId: doc.selectedProvider});
        var buyerDetails;
        if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
            buyerDetails = Dispatchers.findOne({userId: buyerId});
        } else {
            buyerDetails = Buyers.findOne({userId: buyerId});
        }
        var notificationObj = {
            providerId: doc.selectedProvider,
            buyerId: buyerId, 
            jobId: doc._id,
            timeStamp: new Date(),
            notificationType: 'routedJob',
            read: false,
            side: 'provider',
            adminRead: false
        };
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: doc.selectedProvider})),
            cc: providerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'A buyer has directly routed a job to you.',
            html: 'Hello ' + providerDetails.firstName + ' ' + providerDetails.lastName + ',<br>' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has directly routed a job to you.<br><a href="' + Meteor.absoluteUrl('jobs/' + doc._id) + '">' + doc.readableID + ' - ' + doc.title + '<br><a href="' + Meteor.absoluteUrl('jobs/' + doc._id) + '">Click here</a> to confirm or reject the job offer.'
        })
    },
    requestPayment: function(jobId) {
        var providerDetails = Profiles.findOne({userId: Meteor.userId()});
        var jobDetails = Jobs.findOne({_id: jobId});
        var buyerId = jobDetails.userId;
        var buyerDetails;
        if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
            buyerDetails = Dispatchers.findOne({userId: buyerId});
        } else {
            buyerDetails = Buyers.findOne({userId: buyerId});
        }
        var invoiceObject = {
            jobId: jobId,
            providerId: Meteor.userId(),
            buyerId: jobDetails.userId,
            budget: jobDetails.projectBudget,
            date: new Date(),
            invoiceId: 'INV' + jobDetails.readableID,
            invoiceStatus: 'Pending'
        }
        var notificationObj = {
            providerId: Meteor.userId(),
            buyerId: jobDetails.userId,
            jobId: jobId,
            timeStamp: new Date(),
            notificationType: 'requestPayment',
            read: false,
            side: 'buyer',
            adminRead: false
        };
        Jobs.update({_id: jobId}, {$set: {applicationStatus: 'pending_payment', assignmentStatus: 'pending_payment'}});
        Profiles.update({userId: Meteor.userId()}, {$pull: {completedJobs: jobId}});
        Profiles.update({userId: Meteor.userId()}, {$addToSet: {paymentPendingJobs: jobId}});
        Invoices.insert(invoiceObject);
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: jobDetails.userId})),
            cc: buyerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'A provider has requested payment for your job.',
            html: 'Hello ' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ',<br>' + providerDetails.firstName + ' ' + providerDetails.lastName + ' has requested payment for the job.<br><a href="' + Meteor.absoluteUrl('jobs/' + jobDetails._id) + '">' + jobDetails.readableID + ' - ' + jobDetails.title + '<br>Click here</a> to approve the payment.'
        });
    },
    approvePayment: function(jobId) {
        var jobDetails = Jobs.findOne({_id: jobId});
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        var projectBudget = jobDetails.projectBudget;
        var buyerId = jobDetails.userId;
        var buyerDetails;
        if(Roles.userIsInRole(buyerId, ['dispatcher'])) {
            buyerDetails = Dispatchers.findOne({userId: buyerId});
        } else {
            buyerDetails = Buyers.findOne({userId: buyerId});
        }
        var providerDetails = Profiles.findOne({userId: jobDetails.assignedProvider});
        var notificationObj = {
            providerId: jobDetails.assignedProvider,
            buyerId: Meteor.userId(),
            jobId: jobId,
            timeStamp: new Date(),
            notificationType: 'approvePayment',
            read: false,
            side: 'provider',
            adminRead: false
        };
        var jobTransObj = {
            jobId: jobId,
            budget: projectBudget,
            creditedAccount: jobDetails.assignedProvider,
            debitedAccount: adminId,
            dateAndTime: new Date()
        }
        var invoiceObject = {
            jobId: jobId,
            providerId: jobDetails.assignedProvider,
            buyerId: jobDetails.userId,
            budget: jobDetails.projectBudget,
            date: new Date(),
            invoiceId: jobDetails.readableID,
            invoiceStatus: 'Paid'
        }
        Jobs.update({_id: jobId}, {$set: {assignmentStatus: 'paid', applicationStatus: 'paid'}});
        Profiles.update({userId: jobDetails.assignedProvider}, {$addToSet: {paidJobs: jobId}});
        Profiles.update({userId: jobDetails.assignedProvider}, {$pull: {paymentPendingJobs: jobId}});
        Wallet.update({userId: adminId}, {$inc: {accountBalance: -projectBudget}});
        Wallet.update({userId: Meteor.userId()}, {$inc: {amountSpent: projectBudget}});
        Wallet.update({userId: providerDetails.userId}, {$inc: {accountBalance: projectBudget}});
        Wallet.update({userId: providerDetails.userId}, {$inc: {amountEarned: projectBudget}});
        JobTransactions.insert(jobTransObj);
        Invoices.insert(invoiceObject);
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: jobDetails.assignedProvider})),
            cc: providerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'Buyer has approved payment for your job.',
            html: 'Hello ' + providerDetails.firstName + ' ' + providerDetails.lastName + ',<br>' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has approved payment for the job.<br><a href="' + Meteor.absoluteUrl('jobs/' + jobDetails._id) + '">' + jobDetails.readableID + ' - ' + jobDetails.title + '</a><br>Now the job is complete and you may rate the buyer by <a href="' + Meteor.absoluteUrl('jobs/' + jobDetails._id) + '">clicking here</a>.'
        })
    },
    reviewProvider: function(providerId, buyerId, jobId, timeReviewed, timeAttention, instructionAttention, deliverableAttention, ratedPoints, reviewMessage) {
        var review = {
            providerId: providerId,
            buyerId: buyerId,
            reviewedBy: 'buyer',
            reviewedJobId: jobId,
            reviewedAt: timeReviewed,
            timeAttention: timeAttention,
            instructionAttention: instructionAttention,
            deliverableAttention: deliverableAttention,
            pointsRated: ratedPoints,
            reviewMessage: reviewMessage
        };
        Reviews.insert(review);
    },
    reviewBuyer: function(providerId, buyerId, jobId, timeReviewed, experience, ratedPoints, reviewMessage) {
        var review = {
            providerId: providerId,
            buyerId: buyerId,
            reviewedBy: 'provider',
            reviewedJobId: jobId,
            reviewedAt: timeReviewed,
            experience: experience,
            pointsRated: ratedPoints,
            reviewMessage: reviewMessage
        }
        Reviews.insert(review);
    },
    archiveJob: function(jobId, userId) {
        if(Roles.userIsInRole(userId, ['provider'])) {
            Jobs.update({_id: jobId}, {$set: {providerArchived: true}});
            Profiles.update({userId: userId}, {$pull: {paidJobs: jobId}});
        } else if(Roles.userIsInRole(userId, ['buyer', 'dispatcher'])) {
            Jobs.update({_id: jobId}, {$set: {buyerArchived: true}});
        }
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
    updateTask: function(id,obj){
        Tasks.update({'_id':id},{$set:{'state':obj.state,'comments':obj.comments}});
    },
    addFile: function(file,id) {
        Tasks.update(id, {$addToSet: {files: file}});
    },
    addJobFile: function(file,id) {
        Jobs.update(id, {$addToSet: {files: file}});
    },
    addFileToUserFM: function(fileDetails, userId) {
        FileManager.update({userId: userId}, {$addToSet: {files: fileDetails}});
    },
    addMessageFile: function(file, msgId) {
        Messages.update(id, {$addToSet: {files: file}});
    },
    deleteMessageFile: function(file, msgId) {
        Messages.update(id, {$pull: {files: file}});
    },
    deleteJobFile: function(file, id, buyerId) {
        Jobs.update(id, {$pull: {"files": {file_url: file}}});
    },
    deleteFile: function(file,id) {
        Tasks.update(id, {$pull: {files: {file_url: file}}});
    },
    removeUserFile: function(file, id) {
        FileManager.update({userId: id}, {$pull: {files: {file_url: file}}})
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
        Meteor.users.update({_id: id}, {$addToSet: {resumeURL: url}});
    },
    removeResumeURL: function(id, url) {
        Meteor.users.update({_id: id}, {$pull: {resumeURL: {file_url: url}}});
    },
    deactivateJob: function(jobId, buyerId) {
        var jobDetails = Jobs.findOne({_id: jobId});
        if(jobDetails.status == 'active') {
            Jobs.update({_id: jobId}, {$set: {status: 'deactivated'}});
            var buyerGettable;
            if(jobDetails.applicationStatus == 'open') {
                buyerGettable = jobDetails.your_cost;
                if(jobDetails.applications) {
                    for(var i = 0; i < jobDetails.applications.length; i++) {
                        Profiles.update({userId: jobDetails.applications[i].userId}, {$pull: {appliedJobs: jobId}});
                        Profiles.update({userId: jobDetails.applications[i].userId}, {$addToSet: {deactivatedJobs: jobId}});
                    }
                }
            }
            if(jobDetails.applicationStatus == 'assigned') {
                if(jobDetails.assignmentStatus == 'submitted') {
                    Profiles.update({userId: jobDetails.assignedProvider}, {$pull: {paymentPendingJobs: jobId}});
                }
                if(jobDetails.assignmentStatus == 'not_confirmed' || jobDetails.assignmentStatus == 'confirmed' || jobDetails.assignmentStatus == 'rejected')
                    Profiles.update({userId: jobDetails.assignedProvider}, {$pull: {assignedJobs: jobId}});
                Profiles.update({userId: jobDetails.assignedProvider}, {$addToSet: {deactivatedJobs: jobId}});
                if(jobDetails.assignmentStatus == 'not_confirmed') {
                    var acceptedApplication = {};
                    for(var i = 0; i < jobDetails.applications.length; i++) {
                        if(jobDetails.applications[i].app_status == 'accepted') {
                            acceptedApplication = jobDetails.applications[i];
                            break;
                        }
                    }
                    if(acceptedApplication.app_type == 'counteroffer') {
                        buyerGettable = acceptedApplication.buyer_cost;
                    }
                }
                if(jobDetails.assignmentStatus == 'confirmed' || jobDetails.assignmentStatus == 'rejected' || jobDetails.assignmentStatus == 'submitted')
                    buyerGettable = jobDetails.projectBudget + (jobDetails.projectBudget * 5/100);
            }
            var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
            Wallet.update({userId: buyerId}, {$inc: {accountBalance: buyerGettable}});
            Wallet.update({userId: adminId}, {$inc: {accountBalance: -buyerGettable}});
            var notificationObj = {
                buyerId: buyerId,
                jobId: jobId,
                timeStamp: new Date(),
                notificationType: 'jobDeactivated',
                side: 'provider',
                read: false,
                adminRead: false
            };
            Notifications.insert(notificationObj);
        } else {
            throw new Meteor.Error(406, 'Not acceptable');
        }
    },
    pay30Usd: function(buyerPays, adminGets, providerGets, assignedProvider, buyerId, jobId) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        Wallet.update({userId: buyerId}, {$inc: {accountBalance: -buyerPays}});
        Wallet.update({userId: adminId}, {$inc: {accountBalance: adminGets}});
        Wallet.update({userId: assignedProvider}, {$inc: {accountBalance: providerGets}});
        Jobs.update({_id: jobId}, {$set: {paid30Usd: true}});
        var notificationObj = {
            jobId: jobId,
            buyerId: buyerId,
            providerId: assignedProvider,
            timeStamp: new Date(),
            notificationType: 'paid30Usd',
            side: 'provider',
            read: false,
            adminRead: false
        };
        Notifications.insert(notificationObj);
    },
    deny30Usd: function(jobId) {
        var jobDetails = Jobs.findOne({_id: jobId});
        Jobs.update({_id: jobId}, {$set: {denied30Usd: true}});
        var notificationObj = {
            jobId: jobId,
            buyerId: jobDetails.userId,
            providerId: jobDetails.assignedProvider,
            timeStamp: new Date(),
            notificationType: 'denied30Usd',
            side: 'provider',
            read: false,
            adminRead: false
        }
    },
    saveReceipt : function(data) {
        return Transactions.insert(data);
    },
    updateTransaction: function(docID, userID, depositedBy) {
        Transactions.update({_id: docID}, {$set: {userID: userID, depositedBy: depositedBy}})
        var amountDeposited = parseInt(Transactions.findOne({_id: docID}).dollarAmount);
        Wallet.update({userId: userID}, {$inc: {accountBalance: amountDeposited}});
    },
    deactivateProviderProfile: function(userId) {
        Profiles.update({userId: userId}, {$set: {status: 'inactive'}});
    },
    activateProviderProfile: function(userId) {
        Profiles.update({userId: userId}, {$set: {status: 'active'}});
    },
    deactivateBuyerProfile: function(userId) {
        Buyers.update({userId: userId}, {$set: {status: 'inactive'}});
    },
    activateBuyerProfile: function(userId) {
        Buyers.update({userId: userId}, {$set: {status: 'active'}});
    },
    deactivateDispatcherProfile: function(userId) {
        Dispatchers.update({userId: userId}, {$set: {status: 'inactive'}});
    },
    activateDispatcherProfile: function(userId) {
        Dispatchers.update({userId: userId}, {$set: {status: 'active'}});
    },
    generatePdf: function(jobId) {
        var webshot = Meteor.npmRequire('webshot');
        var fs = Meteor.npmRequire('fs');
        console.log(fs)
        var Future = Npm.require('fibers/future');
        var fut = new Future();
        var fileName = 'jobdetails.pdf';
        var css = Assets.getText('bootstrap.css');
        SSR.compileTemplate('layout', Assets.getText('layout.html'));
        Template.layout.helpers({
            getDocType: function() {
                return "<!DOCTYPE html>";
            }
        });
        SSR.compileTemplate('jobReport', Assets.getText('job-report.html'));
        Template.jobReport.helpers({
            'equals': function(a, b) {
                return a === b;
            },
            'buyerName': function() {
                return Buyers.findOne({userId: this.userId}).name;
            },
            'providerName': function() {
                return Profiles.findOne({userId: this.assignedProvider}).name;
            },
            'tasks': function() {
                return Tasks.find({jobID: this._id}).fetch();
            }
        })
        var jobDetials = Jobs.findOne({_id: jobId});
        var data = {
            jobDetails: jobDetials
        }
        var html_string = SSR.render('layout', {
            css: css,
            template: 'jobReport',
            data: data
        });
        var options = {
            "paperSize": {
                "format": "Letter",
                "orientation": "portrait",
                "margin": "1cm"
            },
            siteType: 'html'
        };
        webshot(html_string, fileName, options, function(err) {
            fs.readFile(fileName, function(err, data) {
                if(err) {
                    return console.log(err);
                }
                fs.unlinkSync(fileName);
                fut.return(data);
            });
        });
        var pdfData = fut.wait();
        var base64String = new Buffer(pdfData).toString('base64');
        return base64String;
    },
    'updateWalletAfterTransfer': function(reqAmount, providerId) {
        Wallet.update({userId: providerId}, {$inc: {accountBalance: -reqAmount}});
        
    },
    'updateBuyerWallet': function(reqAmount, buyerId) {
        Wallet.update({userId: buyerId}, {$inc: {accountBalance: parseFloat(reqAmount)}});
    },
    'sendQueryRequest': function(queryObject) {
        Email.send({
            to: 'administrator@ustechland.com',
            from: queryObject.email,
            subject: queryObject.firstName + ' has sent you a message.',
            html: 'Hello admin, <br>' + queryObject.query
        });
    },
    'search_providers': function(query) {
        return Profiles.find({$and: [{}, {$text: {$search: query}}]}).fetch();
    },
    'search_buyers': function(query) {
        return Buyers.find({$and: [{}, {$text: {$search: query}}]}).fetch();
    },
    getDistance: function(prolatlng, joblatlng) {
        var requestUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + prolatlng + '&destinations=' + joblatlng + '&key=AIzaSyCYOFS20R2pwj_iypwsOloV5ctxzClT4GM';
        var request = Npm.require('request');
        var Future = Npm.require('fibers/future');
        var fut = new Future();
        request(requestUrl, function(error, response, body) {
            var stringified = JSON.parse(body)
            fut.return(stringified)
        });
        fut.wait();
        return fut.value;
    },
    requestBudgetIncrease: function(jobId, request_object) {
        Jobs.update({_id: jobId}, {$addToSet: {budgetIncreases: request_object}});
    },
    cancelBudgetIncrease: function(requestId, jobId) {
        Jobs.update({$and: [{_id: jobId}, {'budgetIncreases.request_id': requestId}]}, {$pull: {'budgetIncreases': {'request_id': requestId}}});
    },
    acceptBudgetIncrease: function(jobId, buyerId, requestId) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        var jobDetails = Jobs.findOne({_id: jobId});
        var budgetDetails = {};
        var increases = jobDetails.budgetIncreases;
        if(increases) {
            for(var i = 0; i < increases.length; i++) {
                if(increases[i].request_id == requestId) {
                    budgetDetails = increases[i];
                    break;
                }
            }
        }
        Jobs.update({_id: jobId}, {$inc: {projectBudget: budgetDetails.provider_nets}});
        Jobs.update({$and: [{_id: jobId}, {'budgetIncreases.request_id': requestId}]}, {$set: {'budgetIncreases.$.request_status': 'accepted'}});
        Wallet.update({userId: buyerId}, {$inc: {accountBalance: -budgetDetails.buyer_cost}});
        Wallet.update({userId: adminId}, {$inc: {accountBalance: budgetDetails.buyer_cost}});
    },
    rejectBudgetIncrease: function(jobId, requestId) {
        Jobs.update({$and: [{_id: jobId}, {'budgetIncreases.request_id': requestId}]}, {$set: {'budgetIncreases.$.request_status': 'rejected'}})
        // BonusRequests.update({_id: budgetObject._id}, {$set: {request_status: 'rejected'}});
    },
    requestExpense: function(jobId, request_object) {
        Jobs.update({_id: jobId}, {$addToSet: {expenses: request_object}});
    },
    removeExpense: function(jobId, expenseId) {
        Jobs.update({$and: [{_id: jobId}, {'expenses.expense_id': expenseId}]}, {$pull: {'expenses': {'expense_id': expenseId}}});
    },
    approveExpense: function(jobId, buyerId, expenseId) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        var jobDetails = Jobs.findOne({_id: jobId});
        var expenseDetails = {};
        var expenses = jobDetails.expenses;
        if(expenses) {
            for(var i = 0; i < expenses.length; i++) {
                if(expenses[i].expense_id == expenseId) {
                    expenseDetails = expenses[i];
                    break;
                }
            }
        }
        Jobs.update({_id: jobId}, {$inc: {projectBudget: expenseDetails.expense_amount}});
        Jobs.update({$and: [{_id: jobId}, {'expenses.expense_id': expenseId}]}, {$set: {'expenses.$.request_status': 'accepted'}});
        Wallet.update({userId: adminId}, {$inc: {accountBalance: expenseDetails.buyer_cost}});
        Wallet.update({userId: buyerId}, {$inc: {accountBalance: -expenseDetails.buyer_cost}});
    },
    rejectExpense: function(jobId, expenseId) {
        Jobs.update({$and: [{_id: jobId}, {'expenses.expense_id': expenseId}]}, {$set: {'expenses.$.request_status': 'rejected'}});
    },
    setWorkedDevices: function(jobId, numberOfDevices) {
        Jobs.update({_id: jobId}, {$set: {devicescompleted: numberOfDevices}});
    },
    updateBudget: function(jobId, diff) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        var jobDetails = Jobs.findOne({_id: jobId});
        Jobs.update({_id: jobId}, {$inc: {projectBudget: -diff}});
        var buyerReturns = diff + diff * 5 / 100;
        Wallet.update({userId: adminId}, {$inc: {accountBalance: -buyerReturns}});
        if(Roles.userIsInRole(jobDetails.userId, ['dispatcher'])) {
            var buyerId = Dispatchers.findOne({userId: jobDetails.userId}).invitedBy;
            Wallet.update({userId: buyerId}, {$inc: {accountBalance: buyerReturns}});
        } else if(Roles.userIsInRole(jobDetails.userId, ['buyer'])) {
            Wallet.update({userId: jobDetails.userId}, {$inc: {accountBalance: buyerReturns}});
        }
    }
});