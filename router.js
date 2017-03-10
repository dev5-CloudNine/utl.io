Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    yieldTemplates: {
        header: {
            to: 'header'
        },
        footer: {
            to: 'footer'
        }
    },
    progressSpinner: false,
    progressDelay: 250,
    title: "UTL - Job board and professionals listing just for IT"
});

Router.map(function() {
    this.route('home', {
        path: '/',
        layoutTemplate: 'layout',
        data: function() {
            return {
                jobs: Jobs.find(
                {
                    $and: [
                        {status: "active"},
                        {applicationStatus: 'open'},
                        {invited: false}
                    ]
                }, {
                    sort: {
                        createdAt: -1
                    }
                }),
                profiles: Profiles.find({}, {
                    sort: {
                        availableForHire: -1,
                        randomSorter: 1
                    },
                    limit: 8
                }),
                profile: Profiles.findOne({
                    userId: Meteor.userId()
                })
            };
        },
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                Meteor.subscribe('allJobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
                Meteor.subscribe('userWallet', Meteor.user().invitedBy);
            }
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                Meteor.subscribe('my_jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                Meteor.subscribe('jobs');
            }
            return;
        }
    });

    this.route('jobs', {
        path: '/jobs',
        title: "UTL - All Jobs",
        waitOn: function() {
            Meteor.subscribe('jobs');
            return Meteor.subscribe('userWallet', Meteor.userId());
        }
    });

    this.route('allUsers', {
        path: '/allusers',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                Meteor.subscribe('allJobs');
                Meteor.subscribe('userData')
            }
            Meteor.subscribe('wallet');
            return Meteor.subscribe('allUsers');
        }
    });

    this.route('allJobs', {
        path: '/allJobs',
        title: 'UTL - All Jobs',
        waitOn: function() {
            return Meteor.subscribe('adminJobs');
        }
    });

    this.route('allDeposits', {
        path: '/allDeposits',
        title: 'UTL - All Deposits',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                Meteor.subscribe('allJobs');
            }
            return Meteor.subscribe('allTransactions');
        }
    });

    this.route('allWithdrawls', {
        path: '/allWithdrawls',
        title: 'UTL - All Withdrawls',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                Meteor.subscribe('allJobs');
            }
            return Meteor.subscribe('allTransactions');
        }
    });

    this.route('allInvoices', {
        path: '/allInvoices',
        title: 'UTL - All Invoices',
        waitOn: function() {
            Meteor.subscribe('allJobs');
            return Meteor.subscribe('invoices', Meteor.userId());
        }
    });

    this.route('jobCategories', {
        path: '/allJobCategories',
        title: 'UTL - All Job Categories'
    })

    this.route('myJobs', {
        path: '/myjobs',
        title: "UTL - Posted Jobs",
        data: function() {
            return {
                jobs: Jobs.find({
                    userId: Meteor.userId()
                }, {
                    sort: {
                        createdAt: -1
                    }
                })
            };
        },
        waitOn: function() {
            Meteor.subscribe('my_jobs');
            Meteor.subscribe('buyerInvoices', Meteor.userId());
            Meteor.subscribe('userWallet', Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
                Meteor.subscribe('userWallet', Meteor.user().invitedBy);
            return Meteor.subscribe('reviews');
        }
    });

    this.route('buyerOpenJobs', {
        path: '/myJobs/open',
        title: 'UTL - Open Jobs',
        waitOn: function() {
            Meteor.subscribe('my_jobs');
            Meteor.subscribe('buyerInvoices', Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
                return Meteor.subscribe('userWallet', Meteor.user().invitedBy);
            return Meteor.subscribe('userWallet', Meteor.userId());
        }
    });

    this.route('providerAllJobs', {
        path: '/allProviderJobs',
        title: 'UTL - All Provider Jobs',
        waitOn: function() {
            Meteor.subscribe('reviews');
            Meteor.subscribe('providerInvoices', Meteor.userId());
            Meteor.subscribe('usersTasks');
            Meteor.subscribe('providerDeactivatedJobs');
            Meteor.subscribe('allJobs');
            return Meteor.subscribe('userWallet', Meteor.userId());
        }
    })

    this.route('appliedJobs', {
        path: '/appliedJobs',
        title: 'UTL - Applied Jobs',
        waitOn: function() {
            Meteor.subscribe('allJobs');            
            Meteor.subscribe('providerInvoices', Meteor.userId());
            Meteor.subscribe('usersTasks');
            return Meteor.subscribe('userWallet', Meteor.userId());
        }
    })

    this.route('buyerInvitedJobs', {
        path: '/myJobs/invited',
        title: 'UTL - Invited Jobs',
        waitOn: function() {
            Meteor.subscribe('my_jobs');
            return Meteor.subscribe('reviews');
        }
    });

    this.route('buyerRoutedJobs', {
        path: '/myJobs/routed',
        title: 'UTL - Routed Jobs',
        waitOn: function() {
            Meteor.subscribe('my_jobs');
            return Meteor.subscribe('reviews');
        }
    })

    this.route('providerRoutedJobs', {
        path: '/routedJobs',
        title: 'UTL - Routed Jobs',
        waitOn: function() {
            Meteor.subscribe('allJobs')
            return Meteor.subscribe('userWallet', Meteor.userId());
        }
    });

    this.route('buyerAssignedJobs', {
        path: '/myJobs/assigned',
        title: 'UTL - Assigned Jobs',
        waitOn: function() {
            return Meteor.subscribe('my_jobs');
        }
    });

    this.route('buyerPendingApprovalJobs', {
        path: '/myJobs/pendingApproval',
        title: 'UTL - Pending Approval Jobs',
        waitOn: function() {
            return Meteor.subscribe('my_jobs');            
        }
    });

    this.route('providerAssignedJobs', {
        path: '/assignedJobs',
        title: 'UTL - Assigned Jobs',
        waitOn: function() {
            return Meteor.subscribe('allJobs');
            // return Meteor.subscribe('usersTasks');
        }
    });

    this.route('providerPendingApprovalJobs', {
        path: '/pendingApproval',
        title: 'UTL - Pending Approval Jobs',
        waitOn: function() {
            return Meteor.subscribe('allJobs');
            // Meteor.subscribe('usersTasks');
        }
    });

    this.route('providerDeactivatedJobs', {
        path: '/deactivatedJobs',
        title: 'UTL - Deactivated Jobs',
        waitOn: function() {
            return Meteor.subscribe('allJobs');
        }
    });

    this.route('buyerPaidJobs', {
        path: 'myJobs/paid',
        title: 'UTL - Paid Jobs',
        waitOn: function() {
            Meteor.subscribe('my_jobs');
            return Meteor.subscribe('reviews');
        }
    });

    this.route('deactivatedJobs', {
        path: 'myJobs/deactivatedJobs',
        title: 'UTL - Deactivated Jobs',
        waitOn: function() {
            return Meteor.subscribe('my_jobs');
        }
    })

    this.route('providerPaidJobs', {
        path: '/paidJobs',
        title: 'UTL - Paid Jobs',
        waitOn: function() {
            Meteor.subscribe('allJobs');
            return Meteor.subscribe('reviews');
        }
    })

    this.route('recommendedJobs', {
        path: '/recommendedjobs',
        title: 'UTL - Recommended Jobs',
        waitOn: function() {
            return Meteor.subscribe('jobs');
        }
    });

    this.route('invitedJobs', {
        path: '/invitedJobs',
        title: 'UTL - Invited Jobs',
        waitOn: function() {
            return Meteor.subscribe('jobs');
        }
    });

    this.route('job', {
        path: '/jobs/:_id/:slug?',
        title: function() {
            if (this.data())
                return "UTL - " + this.data().title;
        },
        data: function() {
            return Jobs.findOne({
                _id: this.params._id
            });
        },
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                Meteor.subscribe('jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                Meteor.subscribe('my_jobs');
            }
            Meteor.subscribe('jobBonusRequest', this.params._id);
            Meteor.subscribe('jobNotifications', this.params._id);
            Meteor.subscribe("tasksOfaJob",this.params._id);
            Meteor.subscribe("timeSheet",this.params._id);
            Meteor.subscribe("reviews");
            return Meteor.subscribe("job", this.params._id);
        },
        onBeforeAction: function() {
            var expectedSlug = this.data().slug();
            if (this.params.slug !== expectedSlug) {
                this.redirect("job", {
                    _id: this.params._id,
                    slug: expectedSlug
                },{replaceState: true});
            } else {
                this.next();
            }
        },
        subscriptions: function() {
            return subs.subscribe("userData");
        }
    });

    this.route('filteredJobs', {
        path: '/category/:category',
        title: function() {
            return "UTL - " + this.params.category;
        },
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                Meteor.subscribe('jobs');
            }
            Meteor.subscribe('reviews');
            return Meteor.subscribe('categoryJobs', this.params.category);
        }
    });

    this.route('subCategoryJobs', {
        path: '/subcategory/:subcategory',
        title: function() {
            return "UTL - " + this.params.subcategory;
        },
        waitOn: function() {
            Meteor.subscribe('jobs');
            Meteor.subscribe('reviews');
            return Meteor.subscribe('subCategoryJobs', this.params.subcategory);
        }
    });

    this.route('subcategoryProfiles', {
        path: '/pro/:subcategory',
        title: function() {
            return "UTL - Profiles - " + this.params.subcategory;
        },
        waitOn: function() {
            return Meteor.subscribe('subcategoryProfiles', this.params.subcategory);
        }
    })

    this.route('jobNew', {
        path: '/job',
        title: "UTL - Post a Job",
        onBeforeAction: function () {
            if (Meteor.user() &&
                Meteor.user().roles &&
                ((Meteor.user().roles.indexOf("buyer")) != -1 || (Meteor.user().roles.indexOf("dispatcher")) != -1 )
                ) {
                this.next();
            } else {
                this.render('notYourUrl');
            }
        },
        waitOn: function() {
            Meteor.subscribe('buyerInvoices', Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher']))
                Meteor.subscribe('my_jobs');
            Meteor.subscribe('userWallet', Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
                Meteor.subscribe('userWallet', Meteor.user().invitedBy);
            return Meteor.subscribe('userFiles', Meteor.userId());
        }
    });

    this.route('assignJob', {
        path: '/job/:userId',
        title: "UTL - Route job to a provider",
        onBeforeAction: function () {
            if (Meteor.user() &&
                Meteor.user().roles &&
                ((Meteor.user().roles.indexOf("buyer")) != -1 || (Meteor.user().roles.indexOf("dispatcher")) != -1 )
                ) {
                this.next();
            } else {
                this.render('notFound');
            }
        },
        waitOn: function() {
            Meteor.subscribe('buyerInvoices', Meteor.userId());
            Meteor.subscribe('my_jobs');
            Meteor.subscribe('userWallet', Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
                Meteor.subscribe('userWallet', Meteor.user().invitedBy);
        }
    });

    this.route('jobEdit', {
        path: '/jobs/:_id/:slug/edit',
        title: "UTL - Edit Job Post",
        data: function() {
            return {
                job: Jobs.findOne({
                    _id: this.params._id
                })
            };
        },
        waitOn: function() {
            Meteor.subscribe('buyerInvoices', Meteor.userId());
            Meteor.subscribe('userWallet', Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
                Meteor.subscribe('userWallet', Meteor.user().invitedBy);
            Meteor.subscribe('userFiles', Meteor.userId());
            return Meteor.subscribe("job", this.params._id);
        },
        onBeforeAction: function() {
            var id = this.params._id;
            var userID = Jobs.findOne({_id: id}).userId;
            if(Meteor.userId()==userID) {
                this.next();
            } else {
                Router.go('notFound');
            }
        }
    });

    this.route('duplicateJob', {
        path: '/jobs/:_id/:slug/duplicate',
        title: 'UTL - Duplicate Job',
        data: function() {
            return {
                job: Jobs.findOne({_id: this.params._id})
            };
        },
        waitOn: function() {
            Meteor.subscribe('buyerInvoices', Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
                Meteor.subscribe('userWallet', Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
                Meteor.subscribe('userWallet', Meteor.user().invitedBy);
            return Meteor.subscribe('job', this.params._id);
        },
        onBeforeAction: function() {
            var id = this.params._id;
            var userID = Jobs.findOne({_id: id}).userId;
            if(Meteor.userId()==userID) {
                this.next();
            } else {
                Router.go('notFound');
            }
        }
    })

    this.route('profiles', {
        path: '/profiles',
        title: "UTL - All Service Providers",
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher']))
                Meteor.subscribe('my_jobs');
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
                Meteor.subscribe('providers');
            }
            Meteor.subscribe('reviews');
            return subs.subscribe('developerUsers');
        }
    });

    this.route('favoriteProfiles', {
        path: 'profiles/favorites',
        title: "UTL - My Favorite Providers",
        waitOn: function() {
            Meteor.subscribe('myJobs', Meteor.userId());
            return Meteor.subscribe('favorite_users');
        }
    });

    this.route('favoriteBuyers', {
        path: 'buyers/favorites',
        title: "UTL - My Favorite Buyers",
        waitOn: function() {
            Meteor.subscribe('jobs');
            return Meteor.subscribe('favorite_buyers');
        }
    });

    this.route('profile', {
        path: '/profiles/:_id/:slug?',
        title: function() {
            if (this.data())
                return "UTL - " + this.data().displayName() + " - " + this.data().title;
        },
        data: function() {
            return Profiles.findOne({
                _id: this.params._id
            });
        },
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                Meteor.subscribe('jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                Meteor.subscribe('my_jobs');
            }
            Meteor.subscribe('reviews');
            return Meteor.subscribe('profile', this.params._id);
        },
        onBeforeAction: function() {
            var expectedSlug = this.data().slug();
            if (this.params.slug !== expectedSlug) {
                this.redirect("profile", {
                    _id: this.params._id,
                    slug: expectedSlug
                },{replaceState: true});
            } else {
                this.next();
            }
        }
    });

    this.route('profileNew', {
        path: '/profile',
        title: "UTL - Create Provider Profile",
        onBeforeAction: function () {
            if (Meteor.user() && Meteor.user().roles && ((Meteor.user().roles.indexOf("buyer")) != -1 || (Meteor.user().roles.indexOf("dispatcher")) != -1 )) {
                this.next();
            } else {
                this.render('notYourUrl');
            }
        },
        onBeforeAction: function() {
            if (Meteor.user().isDeveloper) {
                Router.go('profile', Profiles.findOne({
                    userId: Meteor.userId()
                }));
            } else if(Meteor.user() && Meteor.user().roles && ((Meteor.user().roles.indexOf("provider")) != -1)) {
                this.next();
            } else {
                this.render('notYourUrl');
            }
        }
    });

    this.route('profileEdit', {
        path: '/profiles/:_id/:slug/edit',
        title: "UTL - Edit My Provider Profile",
        data: function() {
            return {
                profile: Profiles.findOne({
                    _id: this.params._id
                })
            };
        },
        waitOn: function() {
            Meteor.subscribe('jobs');
            return subs.subscribe('profile', this.params._id);
        },
        onBeforeAction: function() {
            var id = this.params._id;
            var userID = Profiles.findOne({_id: id}).userId;
            if(Meteor.userId()==userID || Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                this.next();
            } else {
                Router.go('notFound');
            }
        }
    });

    this.route('dashboard', {
        path: '/dashboard',
        title: "UTL - Dashboard",
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                Meteor.subscribe('my_jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                Meteor.subscribe('jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
                var dispatcher = Dispatchers.findOne({userId: Meteor.userId()})._id
                Meteor.subscribe('dispatcher', dispatcher)
            }
            Meteor.subscribe('jobCount');
            Meteor.subscribe("contacts",Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['admin']))
                Meteor.subscribe('allJobs');
            Meteor.subscribe('reviews');
            Meteor.subscribe('userChatList', Meteor.userId());
            return Meteor.subscribe("messages",Meteor.userId());
        }
    });

    this.route('mailBox', {
        path: '/mailbox/:tab',
        title: 'UTL - Messages',
        data: function() {
            if(this.params.tab.substr(0, 5)=='mails') {
                return {
                  layout: {mails: true},
                  active: 'messaging'
                };
            } else if(this.params.tab.substr(0, 3)=='new') {
                return {
                  layout: {compose: true},
                  active: 'messaging'
                };
            } else if(this.params.tab.substr(0, 3)=='msg') {
                return {
                  layout: {message: true},
                  active: 'messaging'
                };
            }
        },
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                Meteor.subscribe('jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
                Meteor.subscribe('my_jobs')
            }
            if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
                Meteor.subscribe('accountants', Meteor.user().invitedBy);
            }
            if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                Meteor.subscribe('allJobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
                Meteor.subscribe('my_jobs');
                Meteor.subscribe('job', this.params.query.jobId);
                Meteor.subscribe('accountants', Meteor.userId());
                Meteor.subscribe('dispatchers', Meteor.userId());
            }
            return Meteor.subscribe('messages', Meteor.userId());
        }
    });

    this.route('deposit', {
        path: '/wallet/deposit',
        title: 'UTL - Deposit Funds',
        onBeforeAction: function () {
            if (Meteor.user() &&
                Meteor.user().roles &&
                ((Meteor.user().roles.indexOf("buyer")) != -1 || (Meteor.user().roles.indexOf("accountant")) != -1 )
                ) {
                this.next();
            } else {
                this.render('notFound');
            }
        },
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                Meteor.subscribe('my_jobs');
            }
            Meteor.subscribe('userWallet', Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
                Meteor.subscribe('accountants', Meteor.user().invitedBy);
                Meteor.subscribe('userTransactions', Meteor.user().invitedBy);
                return Meteor.subscribe('userWallet', Meteor.user().invitedBy);
            }
            Meteor.subscribe('accountants', Meteor.userId());
            return Meteor.subscribe('userTransactions', Meteor.userId());
        }
    });

    this.route('attachBankAccount', {
        path: '/wallet/account-verification',
        title: 'UTL - Attach Bank Account'
    })

    this.route('withdraw', {
        path: '/wallet/withdraw',
        title: 'UTL - Withdraw Funds',
        waitOn: function() {
            Meteor.subscribe('userWallet', Meteor.userId());
            Meteor.subscribe('jobs');
            return Meteor.subscribe('providerInvoices', Meteor.userId());
        }
    });

    this.route('invoices', {
        path: '/wallet/invoices',
        title: 'UTL - Invoices',
        waitOn: function() {
            Meteor.subscribe('paidJobs', Meteor.userId());
            Meteor.subscribe('userWallet', Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                Meteor.subscribe('jobs');
                return Meteor.subscribe('providerInvoices', Meteor.userId());
            }
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                Meteor.subscribe('my_jobs');
                Meteor.subscribe('dispatcher_jobs', Meteor.userId());
                return Meteor.subscribe('buyerInvoices', Meteor.userId());
            }
            if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
                Meteor.subscribe('dispatcher_jobs', Meteor.user().invitedBy);
                Meteor.subscribe('dispatchers', Meteor.user().invitedBy)
                Meteor.subscribe('buyerJobs', Meteor.user().invitedBy);
                return Meteor.subscribe('buyerInvoices', Meteor.userId());
            }
        }
    });

    this.route('jobTransactions', {
        path: '/jobTransactions',
        title: 'UTL - Job Transactions',
        waitOn: function() {
            Meteor.subscribe('my_jobs');
            Meteor.subscribe('providerCompletedJobs');
            return Meteor.subscribe('buyerJobTransactions', Meteor.userId());
        }
    });

    this.route('allJobTransactions', {
        path: '/allJobTransactions',
        title: 'UTL - All Job Transactions',
        waitOn: function() {
            Meteor.subscribe('allJobs');
            return Meteor.subscribe('allJobTransactions');
        }
    })

    this.route('buyers', {
        path: '/buyers',
        title: "UTL - All Buyers",
        waitOn: function() {
            Meteor.subscribe('jobs');
            Meteor.subscribe('reviews');
            return Meteor.subscribe('buyerUsers');
        }
    });

    this.route('buyer', {
        path: '/buyers/:_id/:slug?',
        title: function() {
            if(this.data())
                return "UTL - " + this.data().displayName() + " - " + this.data().title;
        },
        data: function() {
            return Buyers.findOne({
                _id: this.params._id
            });
        },
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                Meteor.subscribe('jobs');
            }
            Meteor.subscribe('reviews');
            return subs.subscribe('buyer', this.params._id);
        },
        onBeforeAction: function() {
            var expectedSlug = this.data().slug();
            if(this.params.slug !== expectedSlug) {
                this.redirect("buyer", {
                    _id: this.params._id,
                    slug: expectedSlug
                },{replaceState: true});
            } else {
                this.next();
            }
        }
    });

    this.route('buyerNew', {
        path: '/buyerNew',
        title: 'UTL - Create Buyer Profile',
        onBeforeAction: function() {
            if(Meteor.user().isBuyer) {
                Router.go('buyer', Buyers.findOne({
                    userId: Meteor.userId()
                }));
            } else {
                this.next();
            }
        }
    });

    this.route('buyerEdit', {
        path: 'buyers/:_id/:slug/edit',
        title: "UTL - Edit My Buyer Profile",
        data: function() {
            return {
                buyerProfile: Buyers.findOne({
                    _id: this.params._id
                })
            }
        },
        waitOn: function() {
            return subs.subscribe('buyer', this.params._id);
        },
        onBeforeAction: function() {
            var id = this.params._id;
            var userID = Buyers.findOne({_id: id}).userId;
            if(Meteor.userId()==userID || Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                this.next();
            } else {
                Router.go('notFound');
            }
        }
    });

    this.route('accountants', {
        path: '/accountants',
        title: 'UTL - Accountants',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['accountant', 'dispatcher'])) {
                Meteor.subscribe('accountants', Meteor.user().invitedBy);
            }
            if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
                Meteor.subscribe('my_jobs');
                Meteor.subscribe('accountants', Meteor.userId());
            }
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
                Meteor.subscribe('my_jobs')
            }
        }
    });

    this.route('accountant', {
        path: '/accountants/:_id/:slug?',
        title: function() {
            if(this.data())
                return "UTL - " + this.data().displayName() + " - " + this.data().title;
        },
        data: function() {
            return Accountants.findOne({
                _id: this.params._id
            });
        },
        waitOn: function() {
            return Meteor.subscribe('accountant', this.params._id);
        },
        onBeforeAction: function() {
            var expectedSlug = this.data().slug();
            if(this.params.slug !== expectedSlug) {
                this.redirect("accountant", {
                    _id: this.params._id,
                    slug: expectedSlug
                },{replaceState: true});
            } else {
                this.next();
            }
        }
    });

    this.route('accountantNew', {
        path: '/accountantNew',
        title: 'UTL - Create Accountant Profile',
        onBeforeAction: function() {
            if(Meteor.user().isDispatcher) {
                Router.go('accountant', Dispatchers.findOne({
                    userId: Meteor.userId()
                }));
            } else {
                this.next();
            }
        }
    });

    this.route('accountantEdit', {
        path: 'accountants/:_id/:slug/edit',
        title: "UTL - Edit My Accountant Profile",
        data: function() {
            return {
                accountantProfile: Accountants.findOne({
                    _id: this.params._id
                })
            }
        },
        waitOn: function() {
            return subs.subscribe('accountant', this.params._id);
        },
        onBeforeAction: function() {
            var userID = Accountants.findOne({_id: this.params._id}).userId;
            if(Meteor.userId()==userID || Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                this.next();
            } else {
                Router.go('notFound');
            }
        }
    });

    this.route('dispatchers', {
        path: '/dispatchers',
        title: "UTL - Dispatchers",
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
                Meteor.subscribe('my_jobs');
            }
            Meteor.subscribe('reviews');
            if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
                Meteor.subscribe('my_jobs');
                Meteor.subscribe('dispatchers', Meteor.userId());
            }
            if(Roles.userIsInRole(Meteor.userId(), ['accountant', 'dispatcher'])) {
                Meteor.subscribe('dispatchers', Meteor.user().invitedBy);
                Meteor.subscribe('accountants', Meteor.user().invitedBy);
            }
            return Meteor.subscribe('dispatcherUsers');
        }
    });

    this.route('dispatcher', {
        path: '/dispatchers/:_id/:slug?',
        title: function() {
            if(this.data())
                return "UTL - " + this.data().displayName() + " - " + this.data().title;
        },
        data: function() {
            return Dispatchers.findOne({
                _id: this.params._id
            });
        },
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                Meteor.subscribe('jobs');
            }
            Meteor.subscribe('reviews');
            Meteor.subscribe('dispatcherPotedJobs', this.params._id);
            return subs.subscribe('dispatcher', this.params._id);
        },
        onBeforeAction: function() {
            var expectedSlug = this.data().slug();
            if(this.params.slug !== expectedSlug) {
                this.redirect("dispatcher", {
                    _id: this.params._id,
                    slug: expectedSlug
                },{replaceState: true});
            } else {
                this.next();
            }
        }
    });
    
    this.route('dispatcherNew', {
        path: '/dispatcherNew',
        title: 'UTL - Create Dispatcher Profile',
        onBeforeAction: function() {
            if(Meteor.user().isDispatcher) {
                Router.go('dispatcher', Dispatchers.findOne({
                    userId: Meteor.userId()
                }));
            } else {
                this.next();
            }
        }
    });

    this.route('dispatcherEdit', {
        path: 'dispatchers/:_id/:slug/edit',
        title: "UTL - Edit My Buyer Profile",
        data: function() {
            return {
                dispatcherProfile: Dispatchers.findOne({
                    _id: this.params._id
                })
            }
        },
        waitOn: function() {
            return Meteor.subscribe('dispatcher', this.params._id);
        },
        onBeforeAction: function() {
            var userID = Dispatchers.findOne({_id: this.params._id}).userId;
            if(Meteor.userId()==userID || Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                this.next();
            } else {
                Router.go('notFound');
            }
        }
    });

    this.route('buyerJobs', {
        path: '/buyer/:_id/jobs',
        title: 'UTL - Buyer Jobs',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                Meteor.subscribe('jobs');
            }
            Meteor.subscribe('buyer', this.params._id);
            return Meteor.subscribe('reviews');
        }
    });

    this.route('dispatcherJobs', {
        path: '/dispatchers/:_id/:slug/jobs',
        title: 'UTL - Dispatcher Jobs',
        waitOn: function() {
            Meteor.subscribe('dispatcher', this.params._id);
            Meteor.subscribe('reviews');
            return Meteor.subscribe('dispatcherPostedJobs', this.params._id);
        }
    })

    this.route('buyerNotifications', {
        path: '/buyers/:_id/:slug/notifications',
        title: 'UTL - Notifications',
        waitOn: function() {
            Meteor.subscribe('my_jobs');
        }
    });

    this.route('dispatcherNotifications', {
        path: '/dispatchers/:_id/:slug/notifications',
        title: 'UTL - Notifications',
        waitOn: function() {
            Meteor.subscribe('my_jobs');
        }
    });

    this.route('providerNotifications', {
        path: '/profiles/:_id/:slug/notifications',
        title: 'UTL - Notifications',
        waitOn: function() {
            Meteor.subscribe('jobs');
        }
    });

    this.route('adminNotifications', {
        path: '/admin/notifications',
        title: 'UTL - Notifications',
        waitOn: function() {
            Meteor.subscribe('allJobs');
        }
    });

    this.route('addTeam', {
        path: '/addTeam',
        title: "UTL - Invite Your Team Members",
        waitOn: function() {
            Meteor.subscribe("userList");
            Meteor.subscribe('my_jobs');
            return Meteor.subscribe("tempInvitation");
        }
    });

    this.route('aboutUs', {
        path: '/about',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                return Meteor.subscribe('my_jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                return Meteor.subscribe('jobs');
            }
        }
    })

    this.route('howItWorks', {
        path: '/howitworks',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                return Meteor.subscribe('my_jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                return Meteor.subscribe('jobs');
            }
        }
    });
    this.route('buyerBenefits', {
        path: '/buyer-benefits',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                return Meteor.subscribe('my_jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                return Meteor.subscribe('jobs');
            }
        }
    });
    this.route('providerBenefits', {
        path: '/provider-benefits',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                return Meteor.subscribe('my_jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                return Meteor.subscribe('jobs');
            }
        }
    });
    this.route('privacyPolicy', {
        path: '/privacy-policy',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                return Meteor.subscribe('my_jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                return Meteor.subscribe('jobs');
            }
        }
    });
    this.route('payments', {
        path: '/payments',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                return Meteor.subscribe('my_jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                return Meteor.subscribe('jobs');
            }
        }
    });

    this.route('faq', {
        path: '/faq',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                return Meteor.subscribe('my_jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                return Meteor.subscribe('jobs');
            }
        }
    });

    this.route('contactUs', {
        path: '/contact-us',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                return Meteor.subscribe('my_jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                return Meteor.subscribe('jobs');
            }
        }
    });

    this.route('terms', {
        path: '/terms',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
                return Meteor.subscribe('my_jobs');
            }
            if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
                return Meteor.subscribe('jobs');
            }
        }
    })

    this.route('experts', function() {
        this.redirect("profiles");
    });
    this.route('experts/:_id', function() {
        this.redirect("profile", {
            _id: this.params._id
        });
    });

    this.route('clients', function() {
        this.redirect("buyers");
    });
    this.route('client/:_id', function() {
        _id: this.params._id
    });

    this.route('signUp', {
        layoutTemplate: 'layout',
        path: '/SignUp',
        progress: true
    });


    this.route('inviteeSignUp', {
        path: '/inviteeSignUp/:id',
        title: "SignUp",
        waitOn: function() {
            Meteor.logout();
            return Meteor.subscribe("tempInvitation");
        },
        data: function() {
            return TempInvitation.findOne({'_id':this.params.id});
        }
    });

    this.route('task', {
        path: '/task/:jobID/:taskID',
        title: 'UTL - All Corporates | Task',
        waitOn: function() {
            Meteor.subscribe("tasks",this.params.taskID);
            return Meteor.subscribe("job",this.params.jobID);
        }
    });
    this.route('notFound', {
        path: '/notFound'
    });

    this.route('payment',{
    });

    this.route('oauth_return',{
        where: 'server',
        onBeforeAction: function () {
            var userId = this.request.query.id;
            var code = this.request.query.code;
            Meteor.call("finishAuth", code, userId);
            this.response.writeHead(302, {
                'Location': '/dashboard'
            });
            this.response.end();
        }
    });

    this.route('dwollaCustomers', {
        path: '/admin/dwolla-customers',
        waitOn: function() {
            return Meteor.subscribe('allJobs');
        }
    });

    this.route('dwollaTransfers', {
        path: '/admin/dwolla-transfers',
        waitOn: function() {
            return Meteor.subscribe('allJobs');
        }
    });

    this.route('receipt',{
        where: 'server',
        onBeforeAction: function () {
            var data = {};
            var res = this.request.body;
            data.trans_id = res.x_trans_id;
            data.dollarAmount = res.DollarAmount;
            data.email = res.x_email;
            data.cardNumber = res.Card_Number;
            data.transactionTag = res.Transaction_Tag;
            data.authorizationNum = res.Authorization_Num;
            data.cardHoldersName = res.CardHoldersName;
            data.bankMessage = res.Bank_Message;
            data.retrievalRefNo = res.Retrieval_Ref_No;
            data.transactionCardType = res.TransactionCardType;
            data.merchantName = res.MerchantName;
            data.exact_ctr = res.exact_ctr;
            var id = Meteor.call("saveReceipt",data);
            this.response.writeHead(302, {
                'Location': URL + '/paymentStatus?id='+id
            });
            this.response.end();
        }
    });

    this.route('paymentStatus', {
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
                Meteor.subscribe('userWallet', Meteor.user().invitedBy);
                return Meteor.subscribe('transactions', Meteor.user().invitedBy);
            }
            return Meteor.subscribe("transactions",Meteor.userId());
        }
    });

    this.route('transactionDetails', {
        path: '/wallet/deposit/transaction/:_id',
        title: 'UTL - Transaction Details',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
                Meteor.subscribe('transactionDetails', this.params._id)
                return Meteor.subscribe('userWallet', Meteor.user().invitedBy);
            }
            return Meteor.subscribe('transactionDetails', this.params._id);
        }
    });

    this.route('transferDetails', {
        path: '/withdraw/transfer/:id',
        title: 'UTL - Transfer Details'
    })

    this.route('invoice', {
        path: '/wallet/invoices/:invoiceId',
        title: 'Invoice',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher']))
                Meteor.subscribe('buyerInvoices', Meteor.userId());
            if(Roles.userIsInRole(Meteor.userId(), ['provider']))
                Meteor.subscribe('providerInvoices', Meteor.userId());
            var invoice = Invoices.findOne({invoiceId: parseInt(this.params.invoiceId)});
            var jobId;
            if(invoice) {
                jobId = invoice.jobId
            }
            Meteor.subscribe('jobBonusRequest', jobId);
            Meteor.subscribe('job', jobId);
            return Meteor.subscribe('timeSheet', jobId);
        }
    })

    this.route('invoiceDetails', {
        path: '/allInvoices/:invoiceId',
        title: 'Invoice',
        waitOn: function() {
            Meteor.subscribe('allJobs');
            return Meteor.subscribe('invoices', Meteor.userId());
        }
    })
});

Router.route('/posts/:_id', function () {
  this.render('Post');
}, {
  name: 'post.show'
});

Router.plugin('ensureSignedIn', {
    only: ['profileEdit', 'profileNew', 'jobEdit', 'jobNew', 'buyerEdit', 'buyerNew']
});

Router.plugin('dataNotFound', {
    notFoundTemplate: 'notFound'
});
