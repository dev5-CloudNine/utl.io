Meteor.publish("userData", function() {
    check(arguments, [Match.Any]);
    if (this.userId) {
        return [
            Users.find({
                _id: this.userId
            }),
            Profiles.find({
                userId: this.userId
            }),
            Buyers.find({
                userId: this.userId
            }),
            Dispatchers.find({
                userId: this.userId
            }),
            Accountants.find({
                userId: this.userId
            })
        ];
    }
    this.ready();
});

// Meteor.publish('onlineJobs', function() {
//     var self = this;
//     try {
//         var jobs = HTTP.get('https://utl-95476.app.xervo.io/api/jobs');
//         _.each(jobs.data.data, function(job) {
//             self.added('jobs', Random.id(), job)
//         })
//     } catch(error) {
//         console.log(error)
//     }
// })

Meteor.publish('userFiles', function(userId) {
    return FileManager.find({userId: userId});
})

Meteor.publish("messages", function (id) {
    return Messages.find({$or:[{recipient:id},{sender:id},{chain:id}]});
});

Meteor.publish('categories', function() {
    if(this.userId) {
        var user = Meteor.users.findOne({_id: this.userId});
        if(user)
            return Categories.find();
    }
});

Meteor.publish('skills', function() {
    if(this.userId) {
        var user = Meteor.users.findOne({_id: this.userId});
        if(user)
            return Skills.find();
    }
});

Meteor.publish('subcategories', function() {
    if(this.userId) {
        var user = Meteor.users.findOne({_id: this.userId});
        if(user)
            return SubCategories.find();
    }
})

Meteor.publish('usersTasks', function() {
    if(this.userId) {
        var user = Meteor.users.findOne({_id: this.userId});
        if(user) {
            var jobs = [];
            var userCollection = Meteor.users.findOne({_id:this.userId});
            var contactsPair = userCollection.contacts;
            var jobIDs = [];
            for(var i=0;i<contactsPair.length;i++) {
                jobIDs.push(contactsPair[i].split(':')[1]);
            }
            Jobs.find({_id:{$in:jobIDs||[]}}).map(function(ele){
                jobs.push(ele._id);
            });
            return Tasks.find({jobID:{$in:jobs||[]}});
        }
    }
})

Meteor.publish("tasks", function (taskID) {
    return Tasks.find({_id:taskID});
});

Meteor.publish("timeSheet", function (id) {
    return TimeSheet.find({jobID:id});
});

Meteor.publish("reviews", function() {
    return Reviews.find({});
});

Meteor.publish("tasksOfaJob", function (id) {
    return Tasks.find({jobID:id});
});

Meteor.publish('notifications', function(userId) {
    var usrObj = Meteor.users.findOne({_id: userId});
    var roles=[];
    if(usrObj) {
        roles = usrObj.roles;
    }
    if(roles.indexOf('admin') > -1) {
        return Notifications.find({});
    }
    if(roles.indexOf('buyer') > -1 || roles.indexOf('dispatcher') > -1) {
        return Notifications.find({$and: [{buyerId: this.userId}, {side: 'buyer'}]});
    } else if(roles.indexOf('provider') > -1 || roles.indexOf('corporate-provider') > -1) {
        return Notifications.find({$and: [{providerId: this.userId}, {side: 'provider'}]});
    }
});

Meteor.publish('notificationsJobs', function(userId) {
    var jobIDs = [];
    var notifications;
    var roles = Meteor.users.findOne({_id: userId}).roles
    if(roles.indexOf('admin') > -1) {
        return Notifications.find({});
    }
    if (roles.indexOf('buyer') > -1 || roles.indexOf('dispatcher') > -1) {
       notifications = Notifications.find({ $and: [{ buyerId: this.userId}, { side: 'buyer' }] });
    } else if (roles.indexOf('provider') > -1 || roles.indexOf('corporate-provider') > -1) {
       notifications = Notifications.find({ $and: [{ providerId: this.userId}, { side: 'provider' }] });
    }
    notifications.map(function(ele){
        jobIDs.push(ele.jobId);
    });
    return Jobs.find({_id:{$in:jobIDs}});
});

Meteor.publish('jobNotifications', function(jobId) {
    return Notifications.find({jobId: jobId});
})

Meteor.publish("tempInvitation", function () {
    return TempInvitation.find();
});

Meteor.publish("userList", function () {
    return Meteor.users.find({}, {fields: {createdAt: 1, emails: 1, profile: 1, readableID: 1, roles: 1, imgURL: 1, companyName: 1, contacts: 1, favCount: 1, resumeURL: 1}});
});

Meteor.publish("contacts", function (userID) {
    var ids = Meteor.users.findOne({_id:userID}) && Meteor.users.findOne({_id:userID}).contacts;
    return Meteor.users.find({_id:{$in:ids||[]}},{fields: {emails: 1, roles: 1, companyName:1, contacts:1}});
});

Meteor.publish('developerCount', function() {
    Counts.publish(this, 'developers', Profiles.find({
        status: "active"
    }));
});

Meteor.publish('jobBonusRequest', function(jobId) {
    return BonusRequests.find({jobId: jobId});
});

// Meteor.publish('jobCount', function() {
//     Counts.publish(this, 'jobs', Jobs.find({status: 'active', applicationStatus: 'open', invited: false}));
// })

Meteor.publishComposite('providers', {
    find: function() {
        return Profiles.find({
        }, {
            sort: {
                createdAt: -1
            },
            limit: 8,
            fields: {
                userId: true,
                title: true,
                location: true,
                fullLocation: true,
                lastName: true,
                firstName: true,
                userName: true,
                status: true,
                customImageUrl: true,
                companyName: true,
                createdAt: true,
                readableID: true,
                contactNumber: true,
                smsAddress: true
            }
        });
    },
    children: [{
        find: function(profile) {
            return Users.find({
                _id: profile.userId
            }, {
                fields: {
                    "emailHash": true,
                    "services.facebook.id": true,
                    "services.twitter.profile_image_url": true,
                    "services.facebook.id": true,
                    "services.google.picture": true,
                    "services.github.username": true
                }
            });
        }
    }]
});

Meteor.publishComposite('buyers', {
    find: function() {
        return Buyers.find({
        }, {
            sort: {
                createdAt: -1
            },
            limit: 8,
            fields: {
                userId: true,
                title: true,
                location: true,
                firstName: true,
                lastName: true,
                userName: true,
                status: true,
                customImageUrl: true,
                companyName: true,
                companyUrl: true,
                createdAt: true,
                fullLocation: true,
                contactNumber: true,
                smsAddress: true
            }
        });
    }
})

Meteor.publish('adminJobs', function() {
    check(arguments, [Match.Any]);
    return Jobs.find({}, {sort: {createdAt: -1}});
});

Meteor.publish('adminJobCount', function() {
    Counts.publish(this, 'adminJobs', Jobs.find({}));
});

Meteor.publish('usersCount', function() {
    Counts.publish(this, 'userCount', Users.find({}));
})

Meteor.publish("jobs", function () {
    return Jobs.find({$and: [{status: "active"}, {invited: false}, {$or: [{applicationStatus: 'open'}, {$and: [{applicationStatus: 'assigned'}, {assignmentStatus: 'not_confirmed'}]}]}]}, {sort: {createdAt: -1}})
});

Meteor.publish('allJobs', function() {
    return Jobs.find({});
});

Meteor.publish("my_jobs", function () {
    return Jobs.find({userId: this.userId}, {sort: {createdAt: -1}})
});

Meteor.publish('dispatcher_jobs', function(buyerId) {
    var dispatcherIds = [];
    var dispatchers = Dispatchers.find({invitedBy: buyerId}).fetch();
    for(var i = 0; i < dispatchers.length; i++) {
        dispatcherIds.push(dispatchers[i].userId);
    }
    return Jobs.find({userId: {$in: dispatcherIds}});
});

Meteor.publish('buyerJobs', function(buyerId) {
    return Jobs.find({userId: buyerId});
})

Meteor.publish('categoryJobs', function(category) {
    return Jobs.find({$and: [{jobtype: {$in: [category]}}, {applicationStatus: 'open'}]}, {sort: {createdAt: -1}});
});

Meteor.publish('subCategoryJobs', function(subCategory) {
    return Jobs.find({$and: [{jobSubCategory: {$in: [subCategory]}}, {applicationStatus: 'open'}]}, {sort: {createdAt: -1}});
});

Meteor.publish('paidJobs', function(userId) {
    if(Roles.userIsInRole(userId, ['provider'])) {
        return Jobs.find({$and: [{applicationStatus: 'paid'}, {assignedProvider: userId}]});
    }
    if(Roles.userIsInRole(userId, ['buyer', 'dispatcher'])) {
        return Jobs.find({$and: [{applicationStatus: 'paid'}, {userId: userId}]});
    }
})

Meteor.publish('allUsers', function() {
    check(arguments, [Match.Any]);
    return Meteor.users.find({});
})

Meteor.publish('allTransactions', function () {
    check(arguments, [Match.Any]);
    return Transactions.find({});
})

Meteor.publish('buyerPostedJobs', function(buyerId) {
    check(arguments, [Match.Any]);
    var uId = Buyers.findOne({_id: buyerId}).userId;
    return Jobs.find({status: 'active', userId: uId}, {sort: {createdAt: -1}});
});

Meteor.publish('dispatcherPostedJobs', function(dispatcherId) {
    check(arguments, [Match.Any]);
    var uId = Dispatchers.findOne({_id: dispatcherId}).userId;
    return Jobs.find({status: 'active', userId: uId}, {sort: {createdAt: -1}});
})

Meteor.publish("favorite_users", function() {
    check(arguments,[Match.Any]);
    return Profiles.find({}, {
        fields: {
            name: true,
            type: true,
            freelancerSkills: true,
            title: true,
            einTinNumber: true,
            socialSecurityNumber: true,
            insuranceNumber: true,
            location: true,
            htmlDescription: true,
            availableForHire: true,
            industryTypes: true,
            contactNumber: true,
            contactEmail: true,
            avgRatesPerHour: true,
            preferredWorkLocation: true,
            educationDetails: true,
            certifications: true,
            languages: true,
            url: true,
            resumeUrl: true,
            customImageUrl: true,
            status: true,
            fullLocation: true,
        }
    })
});

Meteor.publish("favorite_buyers", function() {
    check(arguments, [Match.Any]);
    return Buyers.find({}, {
        fields: {
            customImageUrl: true,
            name: true,
            title: true,
            companyName: true,
            eintinNumber: true,
            socialSecurityNumber: true,
            alternateEmail: true,
            location: true,
            description: true,
            htmlDescription: true,
            industryTypes: true,
            contactNumber: true,
            mobileCarrier: true,
            userId: true,
            userName: true,
            status: true,
            fullLocation: true
        }
    })
});

Meteor.publish('allAccountants', function(userId) {
    if(Roles.userIsInRole(userId, ['admin'])) {
        return Accountants.find({});
    }
})

Meteor.publish("job", function(jobId) {
    check(arguments, [Match.Any]);
    return [
        Jobs.find({
            _id: jobId
        })
    ];
});

Meteor.publishComposite('profile', function(profileId) {
    return {
        find: function() {
            return Profiles.find({_id: profileId});
        },
        children: [{
            find: function(profile) {
                return Users.find({
                    _id: profile.userId
                }, {
                    fields: {
                        "emailHash": true,
                        "services.facebook.id": true,
                        "services.twitter.profile_image_url": true,
                        "services.facebook.id": true,
                        "services.google.picture": true,
                        "services.github.username": true
                    }
                });
            }
        }]
    }
});

Meteor.publishComposite('corporate', function(corporateId) {
    return {
        find: function() {
            return Corporates.find({
                _id: corporateId
            })
        },
        children: [{
            find: function(corporate) {
                return Users.find({
                    _id: corporate.corporateId
                }, {
                    fields: {
                        "emailHash": true,
                    }
                });
            }
        }]
    }
})

Meteor.publishComposite('buyer', function(buyerId) {
    return {
        find: function() {
            return Buyers.find({_id: buyerId})
        },
        children: [{
            find: function(buyer) {
                return Users.find({
                    _id: buyer.buyerId
                }, {
                    fields: {
                        "emailHash": true,
                        "services.facebook.id": true,
                        "services.twitter.profile_image_url": true,
                        "services.facebook.id": true,
                        "services.google.picture": true,
                        "services.github.username": true
                    }
                });
            }
        }]
    }
});

Meteor.publishComposite('dispatcher', function(dispatcherId) {
    return {
        find: function() {
            return Dispatchers.find({_id: dispatcherId})
        }
    }
});

Meteor.publishComposite('accountant', function(accountantId) {
    return {
        find: function() {
            return Accountants.find({_id: accountantId});
        }
    }
})

Meteor.publish("developerUsers", function() {
    check(arguments, [Match.Any]);
    return [
        Users.find({
            isDeveloper: true
        }, {
            fields: {
                "emailHash": true,
            }
        })
    ];
});

Meteor.publish("buyerUsers", function() {
    check(arguments, [Match.Any]);
    return [
        Users.find({
            isBuyer: true
        }, {
            fields: {
                "emailHash": true,
                "status": true
            }
        })
    ];
});

Meteor.publish('dispatcherUsers', function() {
    check(arguments, [Match.Any]);
    return [
        Users.find({
            isDispatcher: true
        }, {
            fields: {
                'emailHash': true,
                'status': true
            }
        })
    ]
});

Meteor.publish('profiles', function(limit) {
    var selector = {};
    check(limit, Number);

    return Profiles.find(selector, {
        limit: limit,
        sort: {
            createdAt: 1
        }
    });
});

Meteor.publish('dispatchers', function(buyerId) {
    return Dispatchers.find({invitedBy: buyerId});
});

Meteor.publish('allDispatchers', function() {
    return Dispatchers.find({});
})

Meteor.publish('accountants', function(buyerId) {
    return  Accountants.find({invitedBy: buyerId});
});

Meteor.publish('subcategoryProfiles', function(subcategory) {
    check(arguments, [Match.Any]);
    return Profiles.find({industryTypes: {$in: [subcategory]}});
});

Meteor.publish('wallet', function() {
    return Wallet.find({});
})

Meteor.publish('userWallet', function(userId) {
    check(arguments, [Match.Any]);
    return Wallet.find({userId: userId});
});

Meteor.publish('invoices', function(userId) {
    if(Roles.userIsInRole(userId, ['admin']))
        return Invoices.find({});
});

Meteor.publish('jobInvoice',function(jobId) {
    check(arguments, [Match.Any]);
    return Invoices.find({jobId: jobId})
})

Meteor.publish('providerInvoices', function(userId) {
    check(arguments, [Match.Any]);
    return Invoices.find({providerId: userId});
});

Meteor.publish('buyerInvoices', function(userId) {
    check(arguments, [Match.Any]);
    var dispatcherIds = [];
    var dispatchers;
    if(Roles.userIsInRole(userId, ['accountant'])) {
        var invitedBy = Accountants.findOne({userId: userId}).invitedBy;
        dispatchers = Dispatchers.find({invitedBy: invitedBy}).fetch();
    }
    else if(Roles.userIsInRole(userId, ['buyer']))
        dispatchers = Dispatchers.find({invitedBy: userId}).fetch();
    if(Roles.userIsInRole(userId, ['accountant', 'buyer'])) {
        for(var i = 0; i < dispatchers.length; i++) {
            dispatcherIds.push(dispatchers[i].userId);
        }
    }
    if(Roles.userIsInRole(userId, ['buyer']))
        return Invoices.find({$or: [{buyerId: userId}, {buyerId: {$in: dispatcherIds}}]});
    else if(Roles.userIsInRole(userId, ['dispatcher']))
        return Invoices.find({buyerId: userId});
    else if(Roles.userIsInRole(userId, ['accountant'])) {
        return Invoices.find({$or: [{buyerId: Accountants.findOne({userId: userId}).invitedBy}, {buyerId: {$in: dispatcherIds}}]});
    }
});

Meteor.publish('allJobTransactions', function() {
    return JobTransactions.find({});
})

Meteor.publish('buyerJobTransactions', function(userId) {
    check(arguments, [Match.Any]);
    return JobTransactions.find({$or: [{debitedAccount: userId}, {creditedAccount: userId}]});
});

Meteor.publish('userTransactions', function(userId) {
    check(arguments, [Match.Any]);
    return Transactions.find({userID: userId});
})

Meteor.publish('transactions', function(userId) {
    check(arguments, [Match.Any]);
    return Transactions.find({userID: userId});
})

Meteor.publish('transactionDetails', function(transId) {
    check(arguments, [Match.Any]);
    return Transactions.find({_id: transId});
})
