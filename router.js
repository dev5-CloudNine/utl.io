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
        layoutTemplate: 'layoutNoContainer',
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
            return Meteor.subscribe('jobs');
        }
    });

    this.route('jobs', {
        path: '/jobs',
        title: "UTL - All Jobs",
        waitOn: function() {
            return Meteor.subscribe('jobs');
        }
    });

    this.route('allUsers', {
        path: '/allusers',
        waitOn: function() {
            if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                Meteor.subscribe('allJobs');
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
            Meteor.subscribe('reviews');
            return subs.subscribe('my_jobs');
        }
    });

    this.route('buyerOpenJobs', {
        path: '/myJobs/open',
        title: 'UTL - Open Jobs',
        waitOn: function() {
            return Meteor.subscribe('my_jobs');
        }
    });

    this.route('providerAllJobs', {
        path: '/allProviderJobs',
        title: 'UTL - All Provider Jobs',
        waitOn: function() {
            Meteor.subscribe('reviews');
            Meteor.subscribe('usersTasks');
            return Meteor.subscribe('allJobs');
        }
    })

    this.route('appliedJobs', {
        path: '/appliedJobs',
        title: 'UTL - Applied Jobs',
        waitOn: function() {
            Meteor.subscribe('usersTasks');
            return Meteor.subscribe('allJobs')
        }
    })

    this.route('buyerRoutedJobs', {
        path: '/myJobs/routed',
        title: 'UTL - Routed Jobs',
        waitOn: function() {
            Meteor.subscribe('reviews');
            return Meteor.subscribe('my_jobs');
        }
    });

    this.route('providerRoutedJobs', {
        path: '/routedJobs',
        title: 'UTL - Routed Jobs',
        waitOn: function() {
            return Meteor.subscribe('providerRoutedJobs');
        }
    });

    this.route('buyerAssignedJobs', {
        path: '/myJobs/assigned',
        title: 'UTL - Assigned Jobs',
        waitOn: function() {
            return Meteor.subscribe('my_jobs');
        }
    });

    this.route('buyerPaymentPendingJobs', {
        path: '/myJobs/paymentPending',
        title: 'UTL - Payment Pending Jobs',
        waitOn: function() {
            return Meteor.subscribe('my_jobs');
        }
    });

    this.route('providerAssignedJobs', {
        path: '/assignedJobs',
        title: 'UTL - Assigned Jobs',
        waitOn: function() {
            Meteor.subscribe('usersTasks');
            return Meteor.subscribe('providerAssignedJobs');
        }
    });

    this.route('buyerCompletedJobs', {
        path: 'myJobs/completed',
        title: 'UTL - Completed Jobs',
        waitOn: function() {
            Meteor.subscribe('reviews');
            return Meteor.subscribe('my_jobs');
        }
    });

    this.route('buyerPaidJobs', {
        path: 'myJobs/paid',
        title: 'UTL - Paid Jobs',
        waitOn: function() {
            Meteor.subscribe('reviews');
            return Meteor.subscribe('my_jobs');
        }
    });

    this.route('deactivatedJobs', {
        path: 'myJobs/deactivatedJobs',
        title: 'UTL - Deactivated Jobs',
        waitOn: function() {
            return Meteor.subscribe('my_jobs');
        }
    })

    this.route('providerPaymentPendingJobs', {
        path: '/paymentPendingJobs',
        title: 'UTL - Payment Pending Jobs',
        waitOn: function() {
            return Meteor.subscribe('providerPaymentPending');
        }
    })

    this.route('providerCompletedJobs', {
        path: '/completedJobs',
        title: 'UTL - Completed Jobs',
        waitOn: function() {
            Meteor.subscribe('reviews');
            return Meteor.subscribe('providerCompletedJobs');
        }
    });

    this.route('providerPaidJobs', {
        path: '/paidJobs',
        title: 'UTL - Paid Jobs',
        waitOn: function() {
            Meteor.subscribe('reviews');
            return Meteor.subscribe('providerPaidJobs');
        }
    })

    this.route('recommendedJobs', {
        path: '/recommendedjobs',
        title: 'UTL - Recommended Jobs'
    });

    this.route('invitedJobs', {
        path: '/invitedJobs',
        title: 'UTL - Invited Jobs',
        waitOn: function() {
            return Meteor.subscribe('invitedJobs');
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
                ((Meteor.user().roles.indexOf("buyer")) != -1 || (Meteor.user().roles.indexOf("corporate-admin")) != -1 || (Meteor.user().roles.indexOf("corporate-manager")) != -1 )
                ) {
                this.next();
            } else {
                this.render('notFound');
            }
        },
        waitOn: function() {
            return Meteor.subscribe('userWallet', Meteor.userId());
        }
    });

    this.route('assignJob', {
        path: '/job/:userId',
        title: "UTL - Route job to a provider",
        onBeforeAction: function () {
            if (Meteor.user() &&
                Meteor.user().roles &&
                ((Meteor.user().roles.indexOf("buyer")) != -1 || (Meteor.user().roles.indexOf("corporate-admin")) != -1 || (Meteor.user().roles.indexOf("corporate-manager")) != -1 )
                ) {
                this.next();
            } else {
                this.render('notFound');
            }
        },
        waitOn: function() {
            return Meteor.subscribe('userWallet', Meteor.userId());
        }
    });

    this.route('jobForFavs', {
        path: '/job/new/favorites',
        title: "UTL - Route job to favorite providers",
        onBeforeAction: function () {
            if (Meteor.user() &&
                Meteor.user().roles &&
                ((Meteor.user().roles.indexOf("buyer")) != -1 || (Meteor.user().roles.indexOf("corporate-admin")) != -1 || (Meteor.user().roles.indexOf("corporate-manager")) != -1 )
                ) {
                this.next();
            } else {
                this.render('notFound');
            }
        }
    })

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
            Meteor.subscribe("userWallet", Meteor.userId());
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
            Meteor.subscribe('userWallet', Meteor.userId());
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
        subscriptions: function() {
            Meteor.subscribe('reviews');
            return subs.subscribe('developerUsers');
        }
    });

    this.route('favoriteProfiles', {
        path: 'profiles/favorites',
        title: "UTL - My Favorite Providers",
        waitOn: function() {
            return Meteor.subscribe('favorite_users');
        }
    });

    this.route('favoriteBuyers', {
        path: 'buyers/favorites',
        title: "UTL - My Favorite Buyers",
        waitOn: function() {
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
            // Meteor.subscribe('completedJobs');
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
        onBeforeAction: function() {
            if (Meteor.user().isDeveloper) {
                Router.go('profile', Profiles.findOne({
                    userId: Meteor.userId()
                }));
            } else {
                this.next();
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
            Meteor.subscribe("contacts",Meteor.userId());
            Meteor.subscribe('allJobs');
            Meteor.subscribe('reviews');
            Meteor.subscribe('userWallet', Meteor.userId());
            return Meteor.subscribe("messages",Meteor.userId());
        },
        // data: function() {
        //     else if(this.params.tab=='dashboard') {
        //         return {
        //           active: 'dashboard',
        //         };
        //     } else if(this.params.tab == 'deposits') {
        //         return {
        //             active: 'piggyBank'
        //         };
        //     }
        // }
    });

    this.route('mailBox', {
        path: '/mailbox/:tab',
        title: 'Messages',
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
            if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                Meteor.subscribe('allJobs');
            }
            return Meteor.subscribe('messages', Meteor.userId());
        }
    });

    this.route('deposit', {
        path: '/wallet/deposit',
        title: 'Deposit Funds',
        waitOn: function() {
            Meteor.subscribe('userTransactions', Meteor.userId());
            return Meteor.subscribe('userWallet', Meteor.userId());
        }
    });

    this.route('withdraw', {
        path: '/wallet/withdraw',
        title: 'Withdraw Funds',
        waitOn: function() {
            return Meteor.subscribe('userWallet', Meteor.userId());
        }
    });

    this.route('invoices', {
        path: '/wallet/invoices',
        title: 'Invoices',
        waitOn: function() {
            Meteor.subscribe('providerInvoices', Meteor.userId());
            Meteor.subscribe('buyerInvoices', Meteor.userId());
            return Meteor.subscribe('allJobs');
        }
    });

    this.route('jobTransactions', {
        path: '/jobTransactions',
        title: 'Job Transactions',
        waitOn: function() {
            Meteor.subscribe('my_jobs');
            Meteor.subscribe('providerCompletedJobs');
            return Meteor.subscribe('buyerJobTransactions', Meteor.userId());
        }
    });

    this.route('allJobTransactions', {
        path: '/allJobTransactions',
        title: 'All Job Transactions',
        waitOn: function() {
            Meteor.subscribe('allJobs');
            return Meteor.subscribe('allJobTransactions');
        }
    })

    this.route('buyers', {
        path: '/buyers',
        title: "UTL - All Buyers",
        waitOn: function() {
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
            Meteor.subscribe('reviews');
            Meteor.subscribe('buyerPostedJobs', this.params._id);
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

    this.route('buyerJobs', {
        path: '/buyers/:_id/:slug/jobs',
        title: 'UTL - Buyer Jobs',
        waitOn: function() {
            Meteor.subscribe('buyer', this.params._id);
            Meteor.subscribe('reviews');
            return Meteor.subscribe('buyerPostedJobs', this.params._id);
        }
    });

    this.route('buyerNotifications', {
        path: '/buyers/:_id/:slug/notifications',
        title: 'UTL - Notifications',
        waitOn: function() {
            Meteor.subscribe('userList');
            return Meteor.subscribe('buyerPostedJobs', this.params._id);
        }
    });

    this.route('providerNotifications', {
        path: '/profiles/:_id/:slug/notifications',
        title: 'UTL - Notifications',
        waitOn: function() {
            Meteor.subscribe('userList');
            Meteor.subscribe('providerAssignedJobs');
            Meteor.subscribe('providerPaymentPending');
            Meteor.subscribe('providerRoutedJobs');
            return Meteor.subscribe('providerCompletedJobs');
        }
    });

    this.route('adminNotifications', {
        path: '/admin/notifications',
        title: 'UTL - Notifications',
        waitOn: function() {
            Meteor.subscribe('userList');
            return Meteor.subscribe('allJobs');
        }
    });

    this.route('corporates', {
        path: '/corporates',
        title: 'UTL - All Corporates'
    });

    this.route('corporate', {
        path: '/corporates/:_id/:slug?',
        title: function() {
            if(this.data())
                return "UTL - " + this.data().displayName() + " - " + this.data().title;
        },
        data: function() {
            return Corporates.findOne({
                _id: this.params._id
            });
        },
        waitOn: function() {
            return subs.subscribe('corporate', this.params._id);
        },
        onBeforeAction: function() {
            var expectedSlug = this.data().slug();
            if(this.params.slug !== expectedSlug) {
                this.redirect("corporate", {
                    _id: this.params._id,
                    slug: expectedSlug
                },{replaceState: true});
            } else {
                this.next();
            }
        }
    });

    this.route('corporateNew', {
        path: '/corporateNew',
        title: 'UTL - Create Corporate Profile',
        onBeforeAction: function() {
            if(Meteor.user().isCorporate) {
                Router.go('corporate', Corporates.findOne({
                    userId: Meteor.userId()
                }));
            } else {
                this.next();
            }
        }
    });

    this.route('corporateEdit', {
        path: 'corporates/:_id/:slug/edit',
        title: "UTL - Edit My Corporate Profile",
        data: function() {
            return {
                corporateProfile: Corporates.findOne({
                    _id: this.params._id
                })
            };
        },
        waitOn: function() {
            return subs.subscribe('corporate', this.params._id);
        },
        onBeforeAction: function() {
            var id = this.params._id;
            var userID = Corporates.findOne({_id: id}).userId;
            if(Meteor.userId()==userID) {
                this.next();
            } else {
                Router.go('notFound');
            }
        }
    });

    this.route('addTeam', {
        path: '/addTeam',
        title: "UTL - Invite Your Team Members",
        waitOn: function() {
            Meteor.subscribe("userList");
            return Meteor.subscribe("tempInvitation");
        }
    });

    this.route('corpTeam', {
        path: '/corporates/:_id/:slug/team/:tab',
        title: function() {
            return "UTL - In house team"
        },
        data: function() {
            return Corporates.findOne({
                _id: this.params._id
            });
        },
        waitOn: function() {
            return subs.subscribe('corporate', this.params._id);
        },
        onBeforeAction: function() {
            var expectedSlug = this.data().slug();
            if(this.params.slug !== expectedSlug) {
                this.redirect("corporate", {
                    _id: this.params._id,
                    slug: expectedSlug
                });
            }
            this.next();
        }
    });

    this.route('aboutUs', {
        path: '/about'
    })

    this.route('howItWorks', {
        path: '/howitworks'
    });
    this.route('buyerBenefits', {
        path: '/buyer-benefits'
    });
    this.route('providerBenefits', {
        path: '/provider-benefits'
    });
    this.route('corporateAccounts', {
        path: '/corporate-acconts'
    });
    this.route('privacyPolicy', {
        path: '/privacy-policy'
    });
    this.route('payments', {
        path: '/payments'
    });

    this.route('faq', {
        path: '/faq'
    })

    //legacy url redirects
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
            console.log(this.request);
            var userId = this.request.query.id;
            var code = this.request.query.code;
            Meteor.call("finishAuth", code, userId);
            this.response.writeHead(302, {
                'Location': '/payment'
            });
            this.response.end();
        }
    });

    this.route('receipt',{
        where: 'server',
        onBeforeAction: function () {
            // console.log(this.request.body.exact_ctr);
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
                'Location': 'http://localhost:3000/paymentStatus?id='+id
            });
            this.response.end();
        }
    });

    this.route('paymentStatus', {
        waitOn: function() {
            return Meteor.subscribe("transactions",Meteor.userId());
        }
    });

    this.route('transactionDetails', {
        path: '/wallet/deposit/transaction/:_id',
        title: 'UTL - Transaction Details',
        waitOn: function() {
            return Meteor.subscribe('transactionDetails', this.params._id);
        }
    })

    this.route('invoice', {
        path: '/invoices/:invoiceId',
        title: 'Invoice',
        waitOn: function() {
            Meteor.subscribe('providerInvoices', Meteor.userId());
            return Meteor.subscribe('buyerInvoices', Meteor.userId());
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
