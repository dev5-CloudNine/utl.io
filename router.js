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
                jobs: Jobs.find({
                    featuredThrough: {
                        $exists: false
                    },
                    status: "active"
                }, {
                    sort: {
                        createdAt: -1
                    },
                    limit: 10
                }),
                featuredJobs: Jobs.find({
                    featuredThrough: {
                        $gte: new Date()
                    },
                    status: "active"
                }, {
                    sort: {
                        featuredThrough: -1
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
        subscriptions: function() {
            return [subs.subscribe('homeJobs'), subs.subscribe('featuredJobs'), subs.subscribe('homeDevelopers')];
        }
    });

    this.route('jobs', {
        path: '/jobs',
        title: "UTL - All Jobs"
    });

    this.route('myJobs', {
        path: '/myjobs',
        title: "UTL - My Jobs",
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
            return subs.subscribe('my_jobs');
        }
    });

    this.route('appliedJobs', {
        path: '/myAppliedJobs',
        title: "UTL - My Applied Jobs",
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
            return subs.subscribe("job", this.params._id);
        },
        onBeforeAction: function() {
            var expectedSlug = this.data().slug();
            if (this.params.slug !== expectedSlug) {
                this.redirect("job", {
                    _id: this.params._id,
                    slug: expectedSlug
                });
            } else {
                this.next();
            }
        }
    });


    this.route('jobNew', {
        path: '/job',
        title: "UTL - Post a Job",
        onBeforeAction: function () {
            if (Meteor.user() &&
                Meteor.user().roles &&
                ((Meteor.user().roles.indexOf("employer")) != -1 || (Meteor.user().roles.indexOf("company-employee")) != -1 )
                ) {
                this.next();
            } else {
                this.render('notFound');
            }
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
            return subs.subscribe("job", this.params._id);
        }
    });

    this.route('profiles', {
        path: '/profiles',
        title: "UTL - All Service Providers",
        subscriptions: function() {
            return subs.subscribe('developerUsers');
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
            return subs.subscribe('profile', this.params._id);
        },
        onBeforeAction: function() {
            var expectedSlug = this.data().slug();
            if (this.params.slug !== expectedSlug) {
                this.redirect("profile", {
                    _id: this.params._id,
                    slug: expectedSlug
                });
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
        }
    });

    this.route('providerDashboard', {
        path: '/providerDashboard',
        title: "UTL - Provider Dashboard"
    });


    this.route('buyerDashboard', {
        path: '/buyerDashboard/:tab',
        title: "UTL - Buyer Dashboard",
        waitOn: function() {
            return Meteor.subscribe("messages");
        },
        data: function() {
            if(this.params.tab=='mails') {
                return {
                  layout: {mails: true},
                  active: 'messaging'
                };
            } else if(this.params.tab=='compose') {
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
            return subs.subscribe('buyer', this.params._id);
        },
        onBeforeAction: function() {
            var expectedSlug = this.data().slug();
            if(this.params.slug !== expectedSlug) {
                this.redirect("buyer", {
                    _id: this.params._id,
                    slug: expectedSlug
                });
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
            };
        },
        waitOn: function() {
            return subs.subscribe('buyer', this.params._id);
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
        path: 'privacy-policy'
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
        path: '/SignUp'
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


Router.onBeforeAction(function() {
    loadUploadcare();
    this.next();
}, {
    only: ['profileEdit', 'profileNew', 'jobEdit', 'jobNew', 'buyerEdit', 'buyerNew']
});

Router.plugin('dataNotFound', {
    notFoundTemplate: 'notFound'
});