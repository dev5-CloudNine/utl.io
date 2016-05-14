Profiles = new Mongo.Collection("experts"); //todo - rename underlying collection to reflect code refactor

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
    userName: {
      type: String,
      label: "User Name",
      autoValue: function() {
        if (this.isInsert) {
          return getUserName(Meteor.user());
        } else if (this.isUpsert) {
          return {
            $setOnInsert: getUserName(Meteor.user())
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
    name: {
      type: String,
      label: "Name *",
      max: 128
    },
    companyName: {
      type: String,
      label: "Company Name",
      optional: true
    },
    freelancerSkills: {
      type: String,
      label: "Skills",
      optional: true,
    },
    title: {
      type: String,
      label: "Designation *",
      max: 128
    },
    eintinNumber: {
      type: String,
      label: "EIN/TIN Number",
      max: 128,
      optional: true
    },
    socialSecurityNumber: {
      type: String,
      label: "Social Security Number",
      max: 128,
      optional: true
    },
    location: {
      type: String,
      label: "Location *",
      max: 256
    },
    description: {
      type: String,
      label: "Description *",
      // autoform: {
      //   afFieldInput: SUMMERNOTE_OPTIONS
      // }
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
          return SubCategories.find().map(function(category) {
            return {label: category.label, value: category.value}
          })
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
      label: "Personal URL",
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
    routedJobs: {
      type: Array,
      optional: true
    },
    'routedJobs.$': {
      type: String
    },
    ongoingJobs: {
      type: Array,
      optional: true
    },
    'ongoingJobs.$': {
      type: String
    },
    counteredJobs: {
      type: Array,
      optional: true
    },
    'counteredJobs.$': {
      type: String, 
      optional: true
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
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
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
    return this.name || this.userName;
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
