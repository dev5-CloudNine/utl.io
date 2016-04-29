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
            return [subs.subscribe('jobs'), subs.subscribe('providers')];
        }
    });

    this.route('jobs', {
        path: '/jobs',
        title: "UTL - All Jobs",
        waitOn: function() {
            return subs.subscribe("jobs");
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
        },
        subscriptions: function() {
            return subs.subscribe("userData");
        }
    });

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
        title: "UTL - Assign job to a provider",
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
        },
        // onBeforeAction: function() {
        //     var currentUserId = Profiles.findOne({userId: Meteor.userId()})._id || Buyers.findOne({userId: Meteor.userId()})._id;
        //     if(currentUserId !== this.params._id) {
        //         this.redirect("profile", {
        //             _id: this.params._id
        //         });
        //         toastr.error("You cannot edit this profile");
        //     }
        //     else {
        //         this.next();
        //     }
        // }
    });

    this.route('providerDashboard', {
        path: '/providerDashboard',
        title: "UTL - Provider Dashboard"
    });


    this.route('dashboard', {
        path: '/dashboard/:tab',
        title: "UTL - Dashboard",
        waitOn: function() {
            Meteor.subscribe("userList");
            Meteor.subscribe('allJobs');
            return Meteor.subscribe("messages");
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
            }
        },
        waitOn: function() {
            return subs.subscribe('buyer', this.params._id);
        },
        // onBeforeAction: function() {
        //     var currentUserId = Buyers.findOne({usrId: Meteor.userId()})._id || Profiles.findOne({userId: Meteor.userId()})._id;
        //     if(currentUserId !== this.params._id) {
        //         this.redirect("buyer", {
        //             _id: this.params._id
        //         });
        //         toastr.error("You cannot edit this profile");
        //     }
        //     else {
        //         this.next();
        //     }
        // }
    });

    this.route('buyerJobs', {
        path: '/buyers/:_id/:slug/jobs',
        title: 'UTL - Buyer Jobs',
        waitOn: function() {
            Meteor.subscribe('buyer', this.params._id);
            return subs.subscribe('buyerPostedJobs', this.params._id);
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
                });
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
    })

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