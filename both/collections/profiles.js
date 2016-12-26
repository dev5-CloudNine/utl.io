Profiles = new Mongo.Collection("experts"); //todo - rename underlying collection to reflect code refactor

AddressSchema = new SimpleSchema({
  street: {
    type: String,
    optional: true
  },
  locality: {
    type: String,
    optional: true,
  },
  sublocality: {
    type: String,
    optional: true
  },
  state: {
    type: String,
    optional: true
  },
  zip: {
    type: String,
    regEx: /^[0-9]{5}$/,
    optional: true
  },
  country: {
    type: String,
    optional: true
  },
  formatted_address: {
    type: String,
    optional: true
  },
  mapLink: {
    type: String,
    optional: true
  },
  latitude: {
    type: Number,
    optional: true,
    decimal: true
  },
  longitude: {
    type: Number,
    optional: true,
    decimal: true
  }
});

Profiles.attachSchema(
  new SimpleSchema({
    userId: {
      type: String,
      autoValue: function() {
        if (this.isInsert) {
          return Meteor.userId();
        } else if (this.isUpsert) {
          return {
            $setOnInsert: Meteor.userId()
          };
        } else {
          this.unset();
        }
      },
      denyUpdate: true
    },
    readableID: {
      type: Number,
      autoValue: function() {
        if(this.isInsert) {
          return Meteor.user().readableID;
        } else if(this.isUpsert) {
          return {
            $setOnInsert: Meteor.user().readableID
          }
        }
      }
    },
    userName: {
      type: String,
      label: "User Name",
      autoValue: function() {
        if (this.isInsert) {
          return getUserEmail(Meteor.user());
        } else if (this.isUpsert) {
          return {
            $setOnInsert: getUserEmail(Meteor.user())
          };
        } else {
          this.unset();
        }
      }
    },
    customImageUrl: {
      type: String,
      optional: true
    },
    firstName: {
      type: String,
      label: "First Name *",
    },
    lastName: {
      type: String,
      label: 'Last Name *'
    },
    companyName: {
      type: String,
      label: "Company Name",
      optional: true
    },
    freelancerSkills: {
      type: String,
      label: "Mention Skillset *",
    },
    title: {
      type: String,
      label: "Designation *",
      max: 128
    },
    // socialSecurityNumber: {
    //   type: String,
    //   label: "Social Security Number *"
    // },
    location: {
      type: String
    },
    fullLocation: {
      type: AddressSchema,
      optional: true
    },
    description: {
      type: String,
      label: "Description *",
      autoform: {
        afFieldInput: SUMMERNOTE_OPTIONS
      }
    },
    htmlDescription: {
      type: String,
      optional: true,
      autoValue: function(doc) {
        var htmlContent = this.field("description");
        if (Meteor.isServer && htmlContent.isSet) {
          return cleanHtml(htmlContent.value);
        }
      }
    },
    industryTypes: {
      type: [String],
      label: "Select Job Categories *",
      autoform: {
        type: "selectize",
        options: function() {
          return SubCategories.find().fetch()
        },
        multiple: true
      }
    },
    contactNumber: {
      type: String,
      label: "Mobile Number *",
      max: 128,
    },
    mobileCarrier: {
      type: String,
      label: "Mobile Provider *",
      max: 128,
      autoform: {
        type: "select",
        options: MOBILE_CARRIERS
      }
    },
    // dateOfBirth: {
    //   type: Date,
    //   label: 'Date of Birth *',
    //   autoform: {
    //     type: 'bootstrap-datepicker'
    //   }
    // },
    avgRatesPerHour: {
      type: Number,
      label: "Average Rates Per Hour (USD) *",
    },
    smsAddress: {
      type: String,
      label: "SMS Address",
      optional: true
    },
    educationDetails: {
      type: String,
      optional: true,
      autoform: {
        afFieldInput: SUMMERNOTE_OPTIONS,
        label: false
      }
    },
    htmlEducationDetails: {
      type: String,
      optional: true,
      autoValue: function(doc) {
        var htmlContent = this.field("educationDetails");
        if (Meteor.isServer && htmlContent.isSet) {
          return cleanHtml(htmlContent.value);
        }
      }
    },
    certifications: {
      type: String,
      optional: true,
      autoform: {
        afFieldInput: SUMMERNOTE_OPTIONS,
        label: false
      }
    },
    htmlCertifications: {
      type: String,
      optional: true,
      autoValue: function(doc) {
        var htmlContent = this.field("certifications");
        if (Meteor.isServer && htmlContent.isSet) {
          return cleanHtml(htmlContent.value);
        }
      }
    },
    languages: {
      type: Array,
      optional: true
    },
    'languages.$': {
      type: Object,
      optional: true
    },
    'languages.$.language': {
      type: String,
      optional: true,
      label: "Language",
      max: 128
    },
    'languages.$.level': {
      type: String,
      optional: true,
      label: "Level",
      autoform: {
        type: 'select',
        options: function() {
          return [
            {
              label: "Beginner",
              value: "Beginner"
            },
            {
              label: "Proficient",
              value: "Proficient"
            },
            {
              label: "Expert",
              value: "Expert"
            }
          ]
        }
      }
    },
    'languages.$.abilities': {
      type: [String],
      optional: true,
      autoform: {
        type: "select-checkbox-inline",
        options: function() {
          return [
            {
              label: "Read",
              value: "Read"
            },
            {
              label: "Write",
              value: "Write"
            },
            {
              label: "Speak",
              value: "Speak"
            }
          ]
        }
      }
    },
    distancePreference: {
      type: Number,
      label: 'Distance Preferences:',
      optional: true,
      autoform: {
        type: 'select-radio-inline',
        options: function() {
          return [
            {
              label: '< 40 miles',
              value: 40
            },
            {
              label: '< 80 miles',
              value: 80,
            },
            {
              label: '< 120 miles',
              value: 120,
            },
            {
              label: '< 160 miles',
              value: 160
            },
            {
              label: 'Doesn\'t matter',
              value: 0
            }
          ]
        }
      }
    },
    url: {
      type: String,
      label: "Personal URL (Website/Blog)",
      max: 1024,
      optional: true
    },
    resumeUrl: {
      type: String,
      label: "Resume URL",
      max: 1024,
      optional: true,
      regEx: SimpleSchema.RegEx.Url
    },
    appliedJobs: {
      type: Array,
      optional: true
    },
    'appliedJobs.$': {
      type: String
    },
    declinedJobs: {
      type: Array,
      optional: true
    },
    'declinedJobs.$': {
      type: String
    },
    deactivatedJobs: {
      type: Array,
      optional: true
    },
    'deactivatedJobs.$': {
      type: String
    },
    assignedJobs: {
      type: Array,
      optional: true
    },
    'assignedJobs.$': {
      type: String
    },
    pendingApproval: {
      type: Array,
      optional: true
    },
    'pendingApproval.$': {
      type: String
    },
    routedJobs: {
      type: Array,
      optional: true
    },
    'routedJobs.$': {
      type: String
    },
    invitedJobs: {
      type: [String],
      optional: true
    },
    paymentPendingJobs: {
      type: Array,
      optional: true
    },
    'paymentPendingJobs.$': {
      type: String
    },
    completedJobs: {
      type: Array,
      optional: true
    },
    'completedJobs.$': {
      type: String
    },
    paidJobs: {
      type: Array,
      optional: true
    },
    'paidJobs.$': {
      type: String
    },
    allJobs: {
      type: Array,
      optional: true
    },
    'allJobs.$': {
      type: String
    },
    status: {
      type: String,
      allowedValues: STATUSES,
      defaultValue:"active"
    },
    createdAt: {
      type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return {
            $setOnInsert: new Date()
          };
        } else {
          this.unset();
        }
      },
      denyUpdate: true
    },
    updatedAt: {
      type: Date,
      autoValue: function() {
        if (this.isUpdate) {
          return new Date();
        }
      },
      denyInsert: true,
      optional: true
    }
  })
);

if(Meteor.isServer) {
  Profiles._ensureIndex({
    'firstName': 'text',
    'lastName': 'text',
    'title': 'text',
    'location': 'text',
    'readableID': 'text'
  })
}

Profiles.helpers({
  displayName: function() {
    return this.firstName + ' ' + this.lastName || this.userName;
  },
  path: function() {
    return 'profiles/' + this._id + '/' + this.slug();
  },
  slug: function() {
    return getSlug(this.displayName() + ' ' + this.title);
  }
});

Profiles.allow({
  insert: function(userId, doc) {
    return userId && doc && userId === doc.userId;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['admin']) || (!_.contains(fieldNames, 'randomSorter') && !_.contains(fieldNames, 'htmlDescription') && !_.contains(fieldNames, 'status') && userId && doc && userId === doc.userId);
  },
  remove: function(userId, doc) {
    return Roles.userIsInRole(userId, ['admin']) || (userId && doc && userId === doc.userId);
  },
  fetch: ['userId']
});
