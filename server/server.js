S3.config = {
    key: 'AKIAIVSMWFVGFI7JSDJA',
    secret: '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',
    bucket: 'ustechland',
    region: 'us-east-1'
};

Slingshot.createDirective('userImages', Slingshot.S3Storage, {
    bucket: 'ustechland',
    region: 'us-east-1',
    AWSAccessKeyId: 'AKIAIVSMWFVGFI7JSDJA',
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
    // "markMessageRead": function(id){
    //     Messages.update({'_id':id},{$set:{'read':true}});
    // },
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
        if (options.limit) {
            options.limit = Math.min(50, Math.abs(options.limit));
        } else {
            options.limit = 50;
        }
        var regex = new RegExp("^" + query,'gi');
        return Cities.find({city: {$regex:  regex}}, options).fetch();
    },
    allUsers: function(query, options, userId)  {
        if(!query) return [];
        options = options || {};
        var regex = new RegExp('^' + query, 'gi');
        var users = [];
        if(Roles.userIsInRole(userId, ['buyer'])) {
            users = users.concat(Profiles.find({$or: [{firstName: {$regex: regex}}, {lastName: {$regex: regex}}]}, options).fetch());
            users = users.concat(Dispatchers.find({$and: [{invitedBy: userId}, {$or: [{firstName: {$regex: regex}}, {lastName: {$regex: regex}}]}]}, options).fetch());
        }
        return users;
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
        if(role == 'buyer' || role == 'dispatcher'){
            var notificationObj = {
                buyerId: Meteor.userId(),
                providerId: id,
                notificationType: 'addFavProvider',
                timeStamp: new Date(),
                side: 'provider',
                read: false,
                adminRead: false
            }
        } else if(role == 'provider') {
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
        if(role == 'buyer' || role =='dispatcher') {
            var providerDetails = Profiles.findOne({userId: id});
            var buyerDetails;
            if(role == 'buyer')
                buyerDetails = Buyers.findOne({userId: Meteor.userId()});
            if(role == 'dispatcher')
                buyerDetails = Dispatchers.findOne({userId: Meteor.userId()});
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: id})),
                cc: providerDetails.smsAddress,
                from: FROM_EMAIL,
                subject: 'A user has added you to his/her favorites.',
                text: 'Hello, ' + providerDetails.firstName + ' ' + providerDetails.lastName + ', ' + buyerDetails.firstName + buyerDetails.lastName + ' has added you to his/her favorites. Click the following link to see his/her profile. ' + Meteor.absoluteUrl('buyers/' + buyerDetails._id + '/' + buyerDetails.slug())
            })
        } else if(role == 'provider') {
            var buyerDetails;
            if(Roles.userIsInRole(id, ['buyer'])) {
                buyerDetails = Buyers.findOne({userId: id});
            } else if(Roles.userIsInRole(id, ['dispatcher'])) {
                buyerDetails = Dispatchers.findOne({userId: id});
            }
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
        }else if(role == 'provider') {
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
        if(role == 'buyer' || role =='dispatcher') {
            var providerDetails = Profiles.findOne({userId: id})
            var buyerDetails;
            if(role == 'buyer')
                buyerDetails = Buyers.findOne({userId: Meteor.userId()});
            if(role == 'dispatcher')
                buyerDetails = Dispatchers.findOne({userId: Meteor.userId()});
            Email.send({
                to: getUserEmail(Meteor.users.findOne({_id: id})),
                cc: providerDetails.smsAddress,
                from: FROM_EMAIL,
                subject: 'A user has removed you from his/her favorites.',
                text: 'Hello, ' + providerDetails.firstName + ' ' + providerDetails.lastName + ', ' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has removed you from his/her favorites. Click the following link to see his/her profile. ' + Meteor.absoluteUrl('buyers/' + buyerDetails._id + '/' + buyerDetails.slug())
            })
        } else if(role == 'provider') {
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
            subject: providerDetails.firstName + ' ' + providerDetails.lastName + ' has applied for the job you posted.',
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
        Notifications.insert(notificationObj);
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: userId})),
            cc: providerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: 'Buyer has accepted your application for the job ' + jobDetails.title,
            html: 'Hello ' + providerDetails.firstName + ' ' + providerDetails.lastName + ', <br>' + buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has accepted you application for the job you applied. <br><a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">' + jobDetails.readableID + ' - ' + jobDetails.title + '</a><br>You may confirm the assignment or reject the assignment by <a href="' + Meteor.absoluteUrl('jobs/' + jobId) + '">clicking here</a>'
        })
    },
    acceptHighBudgetCO: function(difference, buyerId, jobId) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        Jobs.update({_id: jobId}, {$inc: {buyerCost: difference}})
        Jobs.update({_id: jobId}, {$inc: {buyerInitialBudget: difference}})
        Wallet.update({userId: buyerId}, {$inc: {accountBalance: -difference}});
        Wallet.update({userId: adminId}, {$inc: {accountBalance: difference}});
    },
    acceptLowBudgetCO: function(difference, buyerId, jobId) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        Jobs.update({_id: jobId}, {$inc: {buyerCost: -difference}})
        Jobs.update({_id: jobId}, {$inc: {buyerInitialBudget: -difference}})
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
        Profiles.update({userId: userId}, {$addToSet: {appliedJobs: jobId}});
        Jobs.update({_id: jobId, 'applications.userId': userId}, {$set: {'applications.$.app_status': 'rejected', applicationStatus: 'open'}})
    },
    rejectHighBudgetCO: function(jobId, buyerId, diff) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        Jobs.update({_id: jobId}, {$inc: {buyerCost: -diff}});
        Jobs.update({_id: jobId}, {$inc: {buyerInitialBudget: -diff}});
        Wallet.update({userId: adminId}, {$inc: {accountBalance: -diff}});
        Wallet.update({userId: buyerId}, {$inc: {accountBalance: diff}});
    },
    rejectLowBudgetCO: function(jobId, buyerId, diff) {
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        Jobs.update({_id: jobId}, {$inc: {buyerCost: diff}});
        Jobs.update({_id: jobId}, {$inc: {buyerInitialBudget: diff}});
        Wallet.update({userId: adminId}, {$inc: {accountBalance: diff}});
        Wallet.update({userId: buyerId}, {$inc: {accountBalance: -diff}});
    },
    rejectCounterOffer: function(jobId, userId, applied_at) {        
        var jobDetails = Jobs.findOne({_id: jobId});
        Profiles.update({userId: userId}, {$pull: {assignedJobs: jobId}});
        Profiles.update({userId: userId}, {$addToSet: {appliedJobs: jobId}});
        Jobs.update({_id: jobId, 'applications.userId': userId}, {$set: {'applications.$.app_status': 'rejected', applicationStatus: 'open'}});
    },
    setEstimatedDevices: function(no_of_devices, jobId) {
        Jobs.update({_id: jobId}, {$set: {estimatedDevices: no_of_devices}});
    },
    increaseEstimatedDevices: function(no_of_devices, provider_nets, buyer_cost, jobId) {
        Jobs.update({_id: jobId}, {$inc: {estimatedDevices: no_of_devices}});
        Jobs.update({_id: jobId}, {$inc: {proposedBudget: provider_nets}});
        Jobs.update({_id: jobId}, {$inc: {buyerInitialBudget: buyer_cost}});
    },
    confirmAssignment: function(jobId, buyerId, providerEarnings) {
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
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        var buyerCost = jobDetails.your_cost;
        Jobs.update({_id: jobId}, {$set: {projectBudget: providerEarnings, proposedBudget: providerEarnings}});
        Jobs.update({_id: jobId}, {$set: {assignedProvider: Meteor.userId(), assignmentStatus: 'confirmed'}});
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
        }
        var participants = [buyerId, providerDetails.userId, adminId];
        var newChannel = {
            jobId: jobId,
            participants: participants,
            messages: [],
            updatedAt: new Date()
        }
        Channels.insert(newChannel);
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
        var utlFees = jobDetails.buyerCost - jobDetails.projectBudget;
        Wallet.update({userId: adminId}, {$inc: {amountEarned: utlFees}});
        Wallet.update({userId: adminId}, {$inc: {accountBalance: -utlFees}});
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
    routeEmail: function(buyerDetails, providerDetails, jobDetails) {
        var address;
        if(jobDetails.servicelocation == 'Field Job') {
            address = jobDetails.fullLocation.formatted_address;
        } else {
            address = 'Remote Job'
        }
        var budgetDetails;
        if(jobDetails.ratebasis == 'Fixed Pay') {
            budgetDetails = 'Fixed amount of ' + jobDetails.fixedamount + ' USD.';
        } else if(jobDetails.ratebasis == 'Per Hour') {
            budgetDetails = jobDetails.hourlyrate + '/hour for upto ' + jobDetails.maxhours + ' hours.';
        } else if(jobDetails.ratebasis == 'Per Device') {
            budgetDetails = jobDetails.devicerate + '/device for upto ' + jobDetails.maxdevices + ' devices.';
        } else if(jobDetails.ratebasis == 'Blended') {
            budgetDetails = 'Fixed amount of ' + jobDetails.payforfirsthours + ' USD for the first' + jobDetails.firsthours + ' hour(s) and then ' + jobDetails.payfornexthours + '/hour for the next ' + jobDetails.nexthours + ' hours.';
        }
        var jobSchedule;
        if(jobDetails.serviceschedule == 'exactdate') {
            jobSchedule = moment(jobDetails.exactdate).format('LLLL') + ' ' + jobDetails.exacttime;
        } else {
            jobSchedule = 'Between ' + moment(jobDetails.startdate).format('DD/MM/YYYY') + ' and ' + moment(jobDetails.enddate).format('DD/MM/YYYY') + ' from ' + jobDetails.starttime + ' to ' + jobDetails.endtime;
        }
        Email.send({
            to: getUserEmail(Meteor.users.findOne({_id: jobDetails.selectedProvider})),
            cc: providerDetails.smsAddress,
            from: FROM_EMAIL,
            subject: buyerDetails.firstName + ' ' + buyerDetails.lastName + ' has directly assigned a job to you.',
            html: 'Hello ' + providerDetails.firstName + ' ' + providerDetails.lastName + ',<br><a href="' + Meteor.absoluteUrl('jobs/' + jobDetails._id) + '"><i>#' + jobDetails.readableID + '</i><br>' + jobDetails.title + '</a><br>' + address + '<br>' + budgetDetails + '<br>' + jobSchedule +'<br><a href="' + Meteor.absoluteUrl('jobs/' + jobDetails._id) + '">Click here</a> to confirm.'
        })
    },
    openJobEmails: function(jobDetails, buyerDetails, providerEmails, providerSmsAddresses) {
        var address;
        if(jobDetails.servicelocation == 'Field Job') {
            address = jobDetails.fullLocation.formatted_address;
        } else {
            address = 'Remote Job'
        }
        var budgetDetails;
        if(jobDetails.ratebasis == 'Fixed Pay') {
            budgetDetails = 'Fixed amount of ' + jobDetails.fixedamount + ' USD.';
        } else if(jobDetails.ratebasis == 'Per Hour') {
            budgetDetails = jobDetails.hourlyrate + ' USD/hour for upto ' + jobDetails.maxhours + ' hours.';
        } else if(jobDetails.ratebasis == 'Per Device') {
            budgetDetails = jobDetails.rateperdevice + ' USD/device for upto ' + jobDetails.maxdevices + ' devices.';
        } else if(jobDetails.ratebasis == 'Blended') {
            budgetDetails = 'Fixed amount of ' + jobDetails.payforfirsthours + ' USD for the first ' + jobDetails.firsthours + ' hour(s) and then ' + jobDetails.payfornexthours + '/hour for the next ' + jobDetails.nexthours + ' hours.';
        }
        var jobSchedule;
        if(jobDetails.serviceschedule == 'exactdate') {
            jobSchedule = moment(jobDetails.exactdate).format('LLLL') + ' ' + jobDetails.exacttime;
        } else {
            jobSchedule = 'Between ' + moment(jobDetails.startdate).format('DD/MM/YYYY') + ' and ' + moment(jobDetails.enddate).format('DD/MM/YYYY') + ' from ' + jobDetails.starttime + ' to ' + jobDetails.endtime;
        }
        var job = Jobs.findOne({_id: jobDetails._id})
        var admin = Users.findOne({roles: {$in: ['admin']}});
        var allProviderEmails = providerEmails.concat(providerSmsAddresses);
        Email.send({
            to: getUserEmail(admin),
            bcc: allProviderEmails,
            from: FROM_EMAIL,
            subject: 'New Job Posted - ' + jobDetails.title,
            html: '<a href="' + Meteor.absoluteUrl('jobs/' + jobDetails._id) + '"><i>#' + job.readableID + '</i><br>' + jobDetails.title + '</a><br>' + address + '<br>' + budgetDetails + '<br>' + jobSchedule +'<br><a href="' + Meteor.absoluteUrl('jobs/' + jobDetails._id) + '">Click here</a> to apply or counter offer the job.'
        })
    },
    favProvidersEmail: function(jobDetails, buyerDetails, providerEmails, providerSmsAddresses) {
        var address;
        if(jobDetails.servicelocation == 'Field Job') {
            address = jobDetails.fullLocation.formatted_address;
        } else {
            address = 'Remote Job'
        }
        var budgetDetails;
        if(jobDetails.ratebasis == 'Fixed Pay') {
            budgetDetails = 'Fixed amount of ' + jobDetails.fixedamount + ' USD.';
        } else if(jobDetails.ratebasis == 'Per Hour') {
            budgetDetails = jobDetails.hourlyrate + '/hour for upto ' + jobDetails.maxhours + ' hours.';
        } else if(jobDetails.ratebasis == 'Per Device') {
            budgetDetails = jobDetails.devicerate + '/device for upto ' + jobDetails.maxdevices + ' devices.';
        } else if(jobDetails.ratebasis == 'Blended') {
            budgetDetails = 'Fixed amount of ' + jobDetails.payforfirsthours + ' USD for the first' + jobDetails.firsthours + ' hour(s) and then ' + jobDetails.payfornexthours + '/hour for the next ' + jobDetails.nexthours + ' hours.';
        }
        var jobSchedule;
        if(jobDetails.serviceschedule == 'exactdate') {
            jobSchedule = moment(jobDetails.exactdate).format('LLLL') + ' ' + jobDetails.exacttime;
        } else {
            jobSchedule = 'Between ' + moment(jobDetails.startdate).format('DD/MM/YYYY') + ' and ' + moment(jobDetails.enddate).format('DD/MM/YYYY') + ' from ' + jobDetails.starttime + ' to ' + jobDetails.endtime;
        }
        var job = Jobs.findOne({_id: jobDetails._id});
        var admin = Meteor.users.findOne({roles: {$in: ['admin']}});
        var allProviderEmails = providerEmails.concat(providerSmsAddresses);
        Email.send({
            to: getUserEmail(admin),
            bcc: allProviderEmails,
            from: FROM_EMAIL,
            subject: 'A buyer has invited to bid on his job.',
            html: '<a href="' + Meteor.absoluteUrl('jobs/' + jobDetails._id) + '"><i>#' + job.readableID + '</i><br>' + jobDetails.title + '</a><br>' + address + '<br>' + budgetDetails + '<br>' + jobSchedule +'<br><a href="' + Meteor.absoluteUrl('jobs/' + jobDetails._id) + '">Click here</a> to apply or counter offer the job.'
        })
    },
    individualProviderEmail: function(jobDetails, buyerDetails, providerEmails, providerSmsAddresses) {
        var address;
        if(jobDetails.servicelocation == 'Field Job') {
            address = jobDetails.fullLocation.formatted_address;
        } else {
            address = 'Remote Job'
        }
        var budgetDetails;
        if(jobDetails.ratebasis == 'Fixed Pay') {
            budgetDetails = 'Fixed amount of ' + jobDetails.fixedamount + ' USD.';
        } else if(jobDetails.ratebasis == 'Per Hour') {
            budgetDetails = jobDetails.hourlyrate + '/hour for upto ' + jobDetails.maxhours + ' hours.';
        } else if(jobDetails.ratebasis == 'Per Device') {
            budgetDetails = jobDetails.devicerate + '/device for upto ' + jobDetails.maxdevices + ' devices.';
        } else if(jobDetails.ratebasis == 'Blended') {
            budgetDetails = 'Fixed amount of ' + jobDetails.payforfirsthours + ' USD for the first' + jobDetails.firsthours + ' hour(s) and then ' + jobDetails.payfornexthours + '/hour for the next ' + jobDetails.nexthours + ' hours.';
        }
        var jobSchedule;
        if(jobDetails.serviceschedule == 'exactdate') {
            jobSchedule = moment(jobDetails.exactdate).format('LLLL') + ' ' + jobDetails.exacttime;
        } else {
            jobSchedule = 'Between ' + moment(jobDetails.startdate).format('DD/MM/YYYY') + ' and ' + moment(jobDetails.enddate).format('DD/MM/YYYY') + ' from ' + jobDetails.starttime + ' to ' + jobDetails.endtime;
        }
        var job = Jobs.findOne({_id: jobDetails._id});
        var admin = Users.findOne({roles: {$in: ['admin']}});
        var allProviderEmails = providerEmails.concat(providerSmsAddresses);
        Email.send({
            to: getUserEmail(admin),
            bcc: allProviderEmails,
            from: FROM_EMAIL,
            subject: 'A buyer has invited to bid on his job.',
            html: '<a href="' + Meteor.absoluteUrl('jobs/' + jobDetails._id) + '"><i>#' + job.readableID + '</i><br>' + jobDetails.title + '</a><br>' + address + '<br>' + budgetDetails + '<br>' + jobSchedule +'<br><a href="' + Meteor.absoluteUrl('jobs/' + jobDetails._id) + '">Click here</a> to apply or counter offer the job.'
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
            var buyerGettable = jobDetails.buyerCost;
            if(jobDetails.applicationStatus == 'open') {
                if(jobDetails.invited && jobDetails.invitedproviders.length > 0) {
                    for(var i = 0; i < jobDetails.invitedproviders.length; i++) {
                        Profiles.update({userId: jobDetails.invitedproviders[i]}, {$pull: {invitedJobs: jobId}})
                        Profiles.update({userId: jobDetails.invitedproviders[i]}, {$addToSet: {deactivatedJobs: jobId}})
                    }
                }
                if(jobDetails.applications && jobDetails.applications.length > 0) {
                    for(var i = 0; i < jobDetails.applications.length; i++) {
                        Profiles.update({userId: jobDetails.applications[i].userId}, {$pull: {appliedJobs: jobId}});
                        Profiles.update({userId: jobDetails.applications[i].userId}, {$addToSet: {deactivatedJobs: jobId}});
                    }
                }
            }
            if(jobDetails.applicationStatus == 'assigned') {
                if(jobDetails.routed && jobDetails.assignmentStatus == 'not_confirmed') {
                    Profiles.update({userId: jobDetails.selectedProvider}, {$pull: {assignedJobs: jobId}});
                    Profiles.update({userId: jobDetails.selectedProvider}, {$addToSet: {deactivatedJobs: jobId}});
                }
                if(jobDetails.assignmentStatus == 'submitted') {
                    Profiles.update({userId: jobDetails.assignedProvider}, {$pull: {pendingApproval: jobId}});
                }
                if(jobDetails.assignmentStatus == 'not_confirmed' || jobDetails.assignmentStatus == 'confirmed' || jobDetails.assignmentStatus == 'rejected')
                    Profiles.update({userId: jobDetails.assignedProvider}, {$pull: {assignedJobs: jobId}});
                Profiles.update({userId: jobDetails.assignedProvider}, {$addToSet: {deactivatedJobs: jobId}});
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
        Wallet.update({userId: adminId}, {$inc: {amountEarned: adminGets}});
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
        var jobDetails = Jobs.findOne({_id: jobId});
        var invoiceObject = {
            jobId: jobId,
            providerId: assignedProvider,
            buyerId: buyerId,
            budget: jobDetails.projectBudget,
            date: new Date(),
            invoiceId: jobDetails.readableID,
            invoiceStatus: 'paid (deactivated)'
        }
        Invoices.insert(invoiceObject);
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
        var transcationDetails = Transactions.findOne({_id: docID});
        if(parseInt(transcationDetails.bankResponseCode) == 100) {
            Wallet.update({userId: userID}, {$inc: {accountBalance: amountDeposited}});
        } else {
            return;
        }
    },
    deactivateProviderProfile: function(userId) {
        Profiles.update({userId: userId}, {$set: {status: 'deactivated'}});
    },
    activateProviderProfile: function(userId) {
        Profiles.update({userId: userId}, {$set: {status: 'active'}});
    },
    deactivateBuyerProfile: function(userId) {
        Buyers.update({userId: userId}, {$set: {status: 'deactivated'}});
    },
    activateBuyerProfile: function(userId) {
        Buyers.update({userId: userId}, {$set: {status: 'active'}});
    },
    deactivateDispatcherProfile: function(userId) {
        Dispatchers.update({userId: userId}, {$set: {status: 'deactivated'}});
    },
    activateDispatcherProfile: function(userId) {
        Dispatchers.update({userId: userId}, {$set: {status: 'active'}});
    },
    generatePdf: function(jobId) {
        var webshot = Meteor.npmRequire('webshot');
        var fs = Meteor.npmRequire('fs');
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
            'buyerDetails': function() {
                return Buyers.findOne({userId: this.userId});
            },
            'providerDetails': function() {
                return Profiles.findOne({userId: this.assignedProvider});
            },
            'tasks': function() {
                return Tasks.find({jobID: this._id}).fetch();
            },
            formatDate: function(scheduleDate) {
                return moment(scheduleDate).format('dddd, MMMM D, YYYY');
            },
            budgetDetails: function(jobId) {
                var applicationDetails = {};
                var jobDetails = Jobs.findOne({_id: jobId})
                for(var i = 0; i < jobDetails.applications.length; i++) {
                    if(jobDetails.applications[i].userId == jobDetails.assignedProvider && jobDetails.applications[i].app_status == 'accepted') {
                        if(jobDetails.applications[i].app_type == 'application') {
                            applicationDetails = {
                                appType: jobDetails.applications[i].app_type,
                                appliedAt: jobDetails.applications[i].applied_at
                            }
                        }
                        if(jobDetails.applications[i].app_type == 'counteroffer') {
                            applicationDetails = {
                                appType: jobDetails.applications[i].app_type,
                                appliedAt: jobDetails.applications[i].applied_at,
                                counter_type: jobDetails.applications[i].counterType,
                                fixed_amount:jobDetails.applications[i].fixed_amount,
                                hourly_rate: jobDetails.applications[i].hourly_rate,
                                max_hours: jobDetails.applications[i].max_hours,
                                device_rate: jobDetails.applications[i].device_rate,
                                max_devices: jobDetails.applications[i].max_devices,
                                first_hours: jobDetails.applications[i].first_hours,
                                first_max_hours: jobDetails.applications[i].first_max_hours,
                                next_hours: jobDetails.applications[i].next_hours,
                                next_max_hours: jobDetails.applications[i].next_max_hours,
                                buyer_cost: jobDetails.applications[i].buyer_cost,
                                freelancer_nets: jobDetails.applications[i].freelancer_nets,
                            }
                        }
                    }
                }
                var provider = Profiles.findOne({userId: jobDetails.assignedProvider});
                var providerImg = Users.findOne({_id: jobDetails.assignedProvider}).imgURL;
                var imgURL;
                if(providerImg) {
                    imgURL = providerImg
                } else {
                    imgURL = '/images/avatar.png'
                }
                if(applicationDetails.appType == 'application') {
                    var providerDetails = {
                        name: provider.firstName + ' ' + provider.lastName,
                        title: provider.title,
                        status: provider.status,
                        imgUrl: imgURL,
                        id: provider._id,
                        readableID: Meteor.users.findOne({_id: provider.userId}).readableID,
                        appType: applicationDetails.appType,
                        appliedAt: applicationDetails.appliedAt,
                        paymentType: jobDetails.ratebasis,
                        gross: jobDetails.your_cost,
                        freelancer_nets: jobDetails.freelancer_nets
                    }
                }
                if(applicationDetails.appType == 'counteroffer') {
                    var providerDetails = {
                        name: provider.firstName + ' ' + provider.lastName,
                        title: provider.title,
                        status: provider.status,
                        imgUrl: imgURL,
                        id: provider._id,
                        readableID: Meteor.users.findOne({_id: provider.userId}).readableID,
                        appType: applicationDetails.appType,
                        appliedAt: applicationDetails.appliedAt,
                        paymentType: jobDetails.ratebasis,
                        counter_type: applicationDetails.counter_type,
                        fixed_amount:applicationDetails.fixed_amount,
                        hourly_rate: applicationDetails.hourly_rate,
                        max_hours: applicationDetails.max_hours,
                        device_rate: applicationDetails.device_rate,
                        max_devices: applicationDetails.max_devices,
                        first_hours: applicationDetails.first_hours,
                        first_max_hours: applicationDetails.first_max_hours,
                        next_hours: applicationDetails.next_hours,
                        next_max_hours: applicationDetails.next_max_hours,
                        buyer_cost: applicationDetails.buyer_cost,
                        freelancer_nets: applicationDetails.freelancer_nets
                    }
                }
                return providerDetails;
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
                "orientation": "landscape",
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
        var subject;
        if(queryObject.subject == 1) {
            subject = 'I have problems to sign in';
        } else if(queryObject.subject == 2) {
            subject = 'I have problems to create a Work Order';
        } else if(queryObject.subject == 3) {
            subject = 'I need to talk to a customer service agent';
        } else if(queryObject.subject == 4) {
            subject = 'Other reason'
        }
        Email.send({
            to: 'administrator@ustechland.com',
            from: queryObject.email,
            subject: queryObject.firstName + ', ' + subject,
            html: 'Hello admin, <br>' + queryObject.query
        });
    },
    'search_providers': function(query) {
        return Profiles.find({$and: [{}, {$text: {$search: query}}]}).fetch();
    },
    'search_buyers': function(query) {
        var buyersDispatchers = [];
        if(query) {
            buyersDispatchers = buyersDispatchers.concat(Buyers.find({$and: [{}, {$text: {$search: query}}]}).fetch());
            buyersDispatchers = buyersDispatchers.concat(Dispatchers.find({$and: [{}, {$text: {$search: query}}]}).fetch());
        }
        return buyersDispatchers;
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
        Jobs.update({_id: jobId}, {$inc: {projectBudget: budgetDetails.provider_nets, buyerCost: budgetDetails.buyer_cost}});
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
        Jobs.update({_id: jobId}, {$inc: {projectBudget: expenseDetails.expense_amount, buyerCost: expenseDetails.buyer_cost}});
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
    updateBudget: function(jobId, providerEarnings, buyerReturns) {
        console.log(jobId);
        var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
        var jobDetails = Jobs.findOne({_id: jobId});
        var diff = jobDetails.proposedBudget - providerEarnings;
        console.log(providerEarnings, buyerReturns, diff);
        Jobs.update({_id: jobId}, {$inc: {projectBudget: -diff}});
        Jobs.update({_id: jobId}, {$inc: {buyerCost: -buyerReturns}});
        Wallet.update({userId: adminId}, {$inc: {accountBalance: -buyerReturns}});
        if(Roles.userIsInRole(jobDetails.userId, ['dispatcher'])) {
            var buyerId = Dispatchers.findOne({userId: jobDetails.userId}).invitedBy;
            Wallet.update({userId: buyerId}, {$inc: {accountBalance: buyerReturns}});
            // Jobs.update({userId: buyerId}, {$inc: {buyerCost: -buyerReturns}});
        } else if(Roles.userIsInRole(jobDetails.userId, ['buyer'])) {
            Wallet.update({userId: jobDetails.userId}, {$inc: {accountBalance: buyerReturns}});
        }
    },
    sendMessage: function(messageObject, jobId) {
        Channels.update({jobId: jobId}, {$addToSet: {messages: messageObject}});
        Channels.update({jobId: jobId}, {$set: {updatedAt: new Date()}});
    },
    sendFile: function(fileObj, jobId) {
        Channels.update({jobId: jobId}, {$addToSet: {messages: fileObj}});
        Channels.update({jobId: jobId}, {$set: {updatedAt: new Date()}});
    },
    createUserChat: function(participant_1, participant_2) {
        var participants = [participant_1, participant_2]
        var chatObject = {
            participants: participants,
            messages: []
        }
        return UserChats.insert(chatObject);
    },
    sendUserMessage: function(messageObject, chatId) {
        UserChats.update({_id: chatId}, {$addToSet: {messages: messageObject}})
        UserChats.update({_id: chatId}, {$set: {updatedAt: new Date()}})
    },
    sendUserFile: function(fileObj, chatId) {
        UserChats.update({_id: chatId}, {$addToSet: {messages: fileObj}})
        UserChats.update({_id: chatId}, {$set: {updatedAt: new Date()}})
    },
    markMessageRead: function(chatId, text, time, senderId, userId) {
        if(Roles.userIsInRole(userId, ['buyer']))
            UserChats.update({_id: chatId, 'messages.text': text, 'messages.time': time, 'messages.sender': senderId}, {$set: {'messages.$.buyerRead': true}});
        if(Roles.userIsInRole(userId, ['provider']))
            UserChats.update({_id: chatId, 'messages.text': text, 'messages.time': time, 'messages.sender': senderId}, {$set: {'messages.$.providerRead': true}});
        if(Roles.userIsInRole(userId, ['dispatcher']))
            UserChats.update({_id: chatId, 'messages.text': text, 'messages.time': time, 'messages.sender': senderId}, {$set: {'messages.$.dispatcherRead': true}});
        if(Roles.userIsInRole(userId, ['accountant']))
            UserChats.update({_id: chatId, 'messages.text': text, 'messages.time': time, 'messages.sender': senderId}, {$set: {'messages.$.accountantRead': true}});
    },
    markJobMsgRead: function(chatId, text, time, userId) {
        if(Roles.userIsInRole(userId, ['buyer']))
            Channels.update({_id: chatId, 'messages.text': text, 'messages.time': time}, {$set: {'messages.$.buyerRead': true}});
        if(Roles.userIsInRole(userId, ['provider']))
            Channels.update({_id: chatId, 'messages.text': text, 'messages.time': time}, {$set: {'messages.$.providerRead': true}});
        if(Roles.userIsInRole(userId, ['dispatcher']))
            Channels.update({_id: chatId, 'messages.text': text, 'messages.time': time}, {$set: {'messages.$.dispatcherRead': true}});
        if(Roles.userIsInRole(userId, ['accountant']))
            Channels.update({_id: chatId, 'messages.text': text, 'messages.time': time}, {$set: {'messages.$.accountantRead': true}});
        if(Roles.userIsInRole(userId, ['admin']))
            Channels.update({_id: chatId, 'messages.text': text, 'messages.time': time}, {$set: {'messages.$.adminRead': true}});
    }
});