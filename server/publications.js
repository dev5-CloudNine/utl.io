// Meteor.publish('images', function() {
//     return Images.find();
// })

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
            Corporates.find({
                userId: this.userId
            })
        ];
    }
    this.ready();
});

Meteor.publish("messages", function () {
    return Messages.find();
});

Meteor.publish("cities", function() {
    return Cities.find();
});

Meteor.publish("tempInvitation", function () {
    return TempInvitation.find();
});

Meteor.publish("citiesList", function() {
    return Cities.find();
})

Meteor.publish("userList", function () {
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});


Meteor.publish('developerCount', function() {
    Counts.publish(this, 'developers', Profiles.find({
        status: "active"
    }));
});

Meteor.publish('jobCount', function() {
    Counts.publish(this, 'jobs', Jobs.find({}));
})

Meteor.publish("homeJobs", function() {
    check(arguments, [Match.Any]);
    return [
        Jobs.find({
            featuredThrough: {
                $exists:false
            },
            createdAt: {
                $gte: daysUntilExpiration()
            },
            status: "active"
        }, {
            sort: {
                createdAt: -1
            },
            limit: 10,
            fields: {
                title: true,
                createdAt: true,
                updatedAt: true,
                jobtype: true,
                status: true,
                featuredThrough: true,
                servicelocation: true,
                ratebasis: true,
                htmlDescription: true,
                freelancer_nets: true,
                servicelocation: true,
                location: true
            }
        })
    ];
});

Meteor.publish("featuredJobs", function() {
    check(arguments, [Match.Any]);
    return [
        Jobs.find({
            featuredThrough: {
                $gte: new Date()
            },
            status: "active"
        }, {
            sort: {
                featuredThrough: -1
            },
            fields: {
                title: true,
                company: true,
                location: true,
                createdAt: true,
                updatedAt: true,
                remote: true,
                jobtype: true,
                status: true,
                featuredThrough: true
            }
        })
    ];
});

Meteor.publishComposite('homeDevelopers', {
    find: function() {
        return Profiles.find({
            status: "active"
        }, {
            sort: {
                availableForHire: -1,
                randomSorter: 1
            },
            limit: 8,
            fields: {
                userId: true,
                title: true,
                location: true,
                availableForHire: true,
                randomSorter: true,
                type: true,
                name: true,
                userName: true,
                status: true,
                customImageUrl: true
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

Meteor.publish("jobs", function(limit) {
    check(limit, Number);

    return Jobs.find({
        createdAt: {
            $gte: daysUntilExpiration()
        },
        status: "active"
    }, {
        fields: {
            title: true,
            company: true,
            location: true,
            createdAt: true,
            updatedAt: true,
            servicelocation: true,
            jobtype: true,
            status: true,
            ratebasis: true,
            featuredThrough: true,
            htmlDescription: true,
            freelancer_nets: true,
            appliedBy: true,
            counterOffers: true
        },
        sort: {
            featuredThrough:-1,
            createdAt: -1
        },
        limit: limit
    });
});

Meteor.publish("favorite_jobs", function() {
    check(arguments, [Match.Any]);
    return Jobs.find({status: "active"}, {
        fields: {
            title: true,
            company: true,
            location: true,
            createdAt: true,
            updatedAt: true,
            servicelocation: true,
            jobtype: true,
            status: true,
            ratebasis: true,
            featuredThrough: true,
            htmlDescription: true,
            freelancer_nets: true
        }
    })
});

Meteor.publish("favorite_users", function() {
    check(arguments,[Match.Any]);
    return Profiles.find({status: "active"}, {
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
            customImageUrl: true
        }
    })
});

Meteor.publish("applied_profiles", function() {
    check(arguments, [Match.Any]);
    return Profiles.find({status: "active"}, {
        fields: {
            userId: true,
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
            mobileCarrier: true
        }
    })
})

Meteor.publish("my_jobs", function() {
    check(arguments, [Match.Any]);
    if (this.userId) {
        return [
            Jobs.find({
                userId: this.userId
            })
        ];
    }
    this.ready();
});

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
})

Meteor.publish("developerUsers", function() {
    check(arguments, [Match.Any]);
    return [
        Users.find({ //this may publish users for not active status profiles
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
        Users.find({ //this may publish users for not active status profiles
            isBuyer: true
        }, {
            fields: {
                "emailHash": true,
            }
        })
    ];
});

Meteor.publish("corporateUsers", function() {
    check(arguments, [Match.Any]);
    return [
        Users.find({
            isCorporate: true
        }, {
            fields: {
                "emailHash": true,
            }
        })
    ]
})

Meteor.publish('profiles', function(limit) {
    var selector = {};
    check(limit, Number);

    return Profiles.find(selector, {
        limit: limit,
        sort: {
            randomSorter: 1
        }
    });
});

Meteor.publish('buyers', function(limit) {
    var selector = {};
    check(limit, Number);
    return Buyers.find(selector, {
        limit: limit,
        sort: {
            randomSorter: 1
        }
    });
});

Meteor.publish('corporates', function(limit) {
    var selector = {};
    check(limit, Number);
    return Corporates.find(selector, {
        limit: limit,
        sort: {
            randomSorter: 1
        }
    });
});
