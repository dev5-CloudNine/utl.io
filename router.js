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
            return Meteor.subscribe('jobs');
        }
    });

    this.route('jobs', {
        path: '/jobs',
        title: "UTL - All Jobs",
        waitOn: function() {
            return Meteor.subscribe('jobs');
        },
        data: function() {
            return {
                jobs: Jobs.find({$and: [{status: 'active'}, {applicationStatus: 'open'}, {invited: false}]}).fetch()
            }
        }
    });

    this.route('allJobs', {
        path: '/allJobs',
        title: 'UTL - All Jobs',
        subscriptions: function() {
            return subs.subscribe('adminJobs');
        },
        data: function() {
            return {
                jobs: Jobs.find({}, {sort: {createdAt: -1}})
            }
        }
    });

    this.route('allAssignedJobs', {
        path: '/allAssignedJobs',
        title: 'UTL - All Assigned Jobs',
        subscriptions: function() {
            return subs.subscribe('adminJobs');
        },
        data: function() {
            return {
                jobs: Jobs.find({applicationStatus: 'assigned'}, {sort: {createdAt: -1}})
            }
        }
    });

    this.route('allCompletedJobs', {
        path: '/allCompletedJobs',
        title: 'UTL - All Completed Jobs',
        subscriptions: function() {
            return subs.subscribe('adminJobs');
        },
        data: function() {
            return {
                jobs: Jobs.find({applicationStatus: 'done'}, {sort: {createdAt: -1}})
            }
        }
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
            Meteor.subscribe('reviews');
            return subs.subscribe('my_jobs');
        }
    });

    this.route('appliedJobs', {
        path: '/appliedJobs',
        title: 'UTL - Applied Jobs',
        waitOn: function() {
            Meteor.subscribe('reviews');
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
            Meteor.subscribe("tasksOfaJob",this.params._id);
            Meteor.subscribe("timeSheet",this.params._id);
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
            return Meteor.subscribe('jobs');
        }
    });

    this.route('subCategoryJobs', {
        path: '/subcategory/:subcategory',
        title: function() {
            return "UTL - " + this.params.subcategory;
        },
        waitOn: function() {
            return Meteor.subscribe('jobs');
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
        }
    });

    this.route('assignJob', {
        path: '/job/:_id',
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

    this.route('profiles', {
        path: '/profiles',
        title: "UTL - All Service Providers",
        subscriptions: function() {
            return subs.subscribe('developerUsers');
        }
    });

    this.route('favoriteProfiles', {
        path: 'profiles/favorites',
        title: "UTL - My Favorite Providers"
    });

    this.route('favoriteBuyers', {
        path: 'buyers/favorites',
        title: "UTL - My Favorite Buyers"
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
            Meteor.subscribe('completedJobs');
            subs.subscribe('reviews');
            return subs.subscribe('profile', this.params._id);
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
            if(Meteor.userId()==userID) {
                this.next();
            } else {
                Router.go('notFound');
            }
        }
    });

    this.route('dashboard', {
        path: '/dashboard/:tab',
        title: "UTL - Dashboard",
        waitOn: function() {
            Meteor.subscribe("contacts",Meteor.userId());
            Meteor.subscribe('allJobs');
            Meteor.subscribe('reviews');
            subs.subscribe('notifications');
            return Meteor.subscribe("messages",Meteor.userId());
        },
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
            } else if(this.params.tab=='dashboard') {
                return {
                  active: 'dashboard',
                };
            }
        } 
    });

    this.route('buyers', {
        path: '/buyers',
        title: "UTL - All Buyers"
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
            Meteor.subscribe('images');
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
            if(Meteor.userId()==userID) {
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
    })

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
        path: '/corporates/:_id/:slug/team',
        title: function() {
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
                });
            } else {
                this.next();
            }
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


});




// Router.route('/job', {
//     name: 'jobNew',
//     action: function() {
//         if (Meteor.user() &&
//             Meteor.user().roles &&
//             (Meteor.user().roles.indexOf("employer")) != -1) {
//             this.render('job');
//         } 
//     }
// });





Router.route('/posts/:_id', function () {
  this.render('Post');
}, {
  name: 'post.show'
});

// Router.route('/signup', {
//     name: 'sign.up', 
//     action: function(){
//         this.render("SignUp");
//     }
// });


Router.plugin('ensureSignedIn', {
    only: ['profileEdit', 'profileNew', 'jobEdit', 'jobNew', 'buyerEdit', 'buyerNew']
});



Router.plugin('dataNotFound', {
    notFoundTemplate: 'notFound'
});