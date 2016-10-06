Profiles = new Mongo.Collection("experts"); //todo - rename underlying collection to reflect code refactor

ProfilesIndex = new EasySearch.Index({
  collection: Profiles,
  fields: ['name', 'companyName', 'title', 'location', 'readableID'],
  engine: new EasySearch.Minimongo({
    sort: function (searchObject) {
        return {
          createdAt: -1
        };
    }
  })
})

AddressSchema = new SimpleSchema({
  street: {
    type: String
  },
  locality: {
    type: String
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
    regEx: /^[0-9]{5}$/
  },
  country: {
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

BankAccountSchema = new SimpleSchema({
  accountNumber: {
    type: String,
    label: 'Account Number *'
  },
  routingNumber: {
    type: String,
    label: 'Routing Number *'
  },
  bankAccountType: {
    type: String,
    label: 'Bank Account Type *',
    autoform: {
      type: 'select-radio-inline',
      options: function() {
        return [{
          label: 'Checking',
          value: 'checking'
        }, {
          label: 'Savings',
          value: 'savings'
        }];
      }
    }
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
      type: String,
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
      type: [String],
      label: "Select a Skill *",
      autoform: {
        type: "selectize",
        options: function() {
          return Skills.find().fetch()
        },
        selectizeOptions: {
          hideSelected: true
        },
        isReactiveOptions:true,
        multiple: true
      }
    },
    title: {
      type: String,
      label: "Designation *",
      max: 128
    },
    socialSecurityNumber: {
      type: String,
      label: "Social Security Number"
    },
    location: {
      type: String
    },
    fullLocation: {
      type: AddressSchema,
      optional: true
    },
    bankDetails: {
      type: BankAccountSchema
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
    dateOfBirth: {
      type: Date,
      label: 'Date of Birth *',
      autoform: {
        type: 'bootstrap-datepicker'
      }
    },
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
      label: "Educational Qualification"
    },
    // 'educationDetails.$': {
    //   type: Object,
    //   optional: true
    // },
    // 'educationDetails.$.qualification': {
    //   type: String,
    //   label: "Qualification",
    //   optional: true,
    //   max: 128
    // },
    // 'educationDetails.$.university': {
    //   type: String,
    //   label: "College or University",
    //   optional: true,
    //   max: 128
    // },
    // 'educationDetails.$.yearOfPassing': {
    //   type: String,
    //   label: "Year of Passing",
    //   optional: true,
    //   max: 128
    // },
    certifications: {
      type: String,
      optional: true,
      label: "Professional Certifications"
    },
    // 'certifications.$': {
    //   type: Object,
    //   optional: true
    // },
    // 'certifications.$.certificationName': {
    //   type: String,
    //   label: "Certification Name",
    //   optional: true,
    //   max: 128
    // },
    // 'certifications.$.certificationAuthority': {
    //   type: String,
    //   label: "Certification Authority",
    //   optional: true,
    //   max: 128
    // },
    // 'certifications.$.certificationStartDate': {
    //   type: Date,
    //   label: "Start Date",
    //   optional: true,
    //   autoform: {
    //     type: "bootstrap-datepicker"
    //   }
    // },
    // 'certifications.$.certificationEndDate': {
    //   type: Date,
    //   label: "End Date",
    //   optional: true,
    //   autoform: {
    //     type: "bootstrap-datepicker"
    //   }
    // },
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
    url: {
      type: String,
      label: "Personal URL (Website/Blog)",
      max: 1024,
      optional: true,
      regEx: SimpleSchema.RegEx.Url
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
    assignedJobs: {
      type: Array,
      optional: true
    },
    'assignedJobs.$': {
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
