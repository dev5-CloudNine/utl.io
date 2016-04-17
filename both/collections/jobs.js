Jobs = new Mongo.Collection("jobs");
JobsIndex = new EasySearch.Index({
  collection: Jobs,
  fields: ['title', 'skillsrequired', 'location', 'jobtype'],
  engine: new EasySearch.Minimongo()
});
Jobs.attachSchema(
  new SimpleSchema({
    title: {
      type: String,
      label: "Job Title *",
      max: 128
    },
    skillsrequired: {
      type: String,
      label: "Required Skills *",
      max: 128,
    },
    location: {
      type: String,
      label: "Location",
      max: 128
    },
    jobtype: {
      type: String,
      label: "Select your Industry *",
      autoform: {
        type: "selectize",
        options: INDUSTRY_TYPES
      }
    },
    ratebasis: {
      type: String,
      label: "Pay Rate Basis *",
      autoform: {
        type: 'select',
        options: function() {
          return [
            {
              label: "Fixed Pay",
              value: "Fixed Pay",
            },
            {
              label: "Per Hour",
              value: "Per Hour"
            },
            {
              label: "Per Device",
              value: "Per Device"
            },
            {
              label: "Blended",
              value: "Blended"
            }
          ]
        }
      }
    },
    fixedamount: {
      type: Number,
      min: 1,
      label: "Fixed Budget",
      optional: true,
      decimal: true
    },
    hourlyrate: {
      type: Number,
      min: 1,
      label: "Hourly Rate (USD)",
      optional: true,
      decimal: true
    },
    maxhours: {
      type: Number,
      min: 1,
      label: "Maximum Hours",
      optional: true,
      decimal: true
    },
    rateperdevice: {
      type: Number,
      min: 1,
      label: "Rate per Device (USD)",
      optional: true,
      decimal: true
    },
    maxdevices: {
      type: Number,
      min: 1,
      label: "Maximum Devices",
      optional: true
    },
    payforfirsthours: {
      type: Number,
      min: 1,
      label: "Pay (USD)",
      optional: true,
      decimal: true
    },
    firsthours: {
      type: Number,
      min: 1,
      label: "total for the first",
      optional: true
    },
    payfornexthours: {
      type: Number,
      min: 1,
      label: "hour(s) and then USD",
      optional: true,
      decimal: true
    },
    nexthours: {
      type: Number,
      min: 1,
      label: "per hour for up to",
      optional: true
    },
    totalfromclient: {
      type: Number,
      min: 1,
      label: "Total Amount",
      optional: true,
      decimal: true
    },
    your_cost: {
      type:  Number,
      label: "Your Cost",
      min: 1,
      optional: true,
      decimal: true
    },
    freelancer_nets: {
      type: Number,
      label: "Freelancer Nets",
      min: 1,
      optional: true,
      decimal: true
    },
    paidby: {
      type: String,
      label: "Paid By",
      defaultValue: "Provider",
      optional: true,
      autoform: {
        type: 'select-radio-inline',
        options: function() {
          return [
            {
              label: "Provider",
              value: "Provider"
            },
            {
              label: "You",
              value: "You"
            }
          ]
        }
      }
    },
    servicelocation: {
    optional: true,
    label: "Service Location *",
    type: String,
    autoform: {
      type: "select-radio-inline",
      options: function() {
          return [
            {
              label: "Remote Job",
              value: "Remote Job",
            },
            {
              label: "Field Job",
              value: "Field Job"
            }
          ];
        }
      }
    },
    serviceschedule: {
    optional: true,
    label: "Service Schedule *",
    type: String,
    autoform: {
        type: "select-radio-inline",
        options: function() {
            return [{
                label: "Exactly on",
                value: "exactdate"
            }, {
                label: "Between Dates",
                value: "betweendates",

            }];
          }
        }
    },
    // fileId: {
    //   type: String,
    //   label: "Upload File",
    //   optional: true,
    //   autoform: {
    //     afFieldInput: {
    //       type: 'file',
    //       collection: "UploadedDocuments",
    //       label: "Uploaded Documents"
    //     }
    //   }
    // },
    applications: {
      type: Array,
      optional: true
    },
    'applications.$': {
      type: Object,
    },
    'applications.$.userId': {
      type: String,
      optional: true
    },
    'applications.$.applied_at': {
      type: Date,
      optional: true
    },
    counterOffers: {
      type: Array,
      optional: true
    },
    'counterOffers.$': {
      type: Object
    },
    'counterOffers.$.userId': {
      type: String,
      optional: true,
    },
    'counterOffers.$.fixed_amount': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.hourly_rate': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.max_hours': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.device_rate': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.max_devices': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.first_hours': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.first_max_hours': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.next_hours': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.next_max_hours': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.total_amount': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.buyer_cost': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.freelancer_nets': {
      type: Number,
      decimal: true,
      optional: true
    },
    'counterOffers.$.countered_at': {
      type: Date,
      optional: true,
    },
    contactperson: {
      type: String,
      label: "Contact Name",
      max: 128,
      optional: true
    },
    contactemail: {
      type: String,
      label: "Contact Email",
      max: 128,
      optional: true
    },
    contactphone: {
      type: String,
      label: "Phone",
      max: 128,
      optional: true
    },
    exactdate: {
      type: Date,
      optional: true,
      label: "Exactly on date and time",
      autoform: {
        type: "bootstrap-datetimepicker"
      }
    },
    betweendates: {
      type: [Date],
      label: "Between dates",
      optional: true,
      autoform: {
        type: "bootstrap-daterangepicker",
        dateRangePickerValue: moment().add(0, 'days').format("MM/DD/YYYY") + " - " + moment().add(1, 'days').format("MM/DD/YYYY"),
        dateRangePickerOptions: {
          // minDate: moment().add(-150, 'days'),
          // maxDate:moment().add(6, 'months'),
          // startDate: moment().add(1, 'days'),
          // endDate: moment().add(3, 'days'),
          timePicker: false,
          format: 'MM/DD/YYYY',
          timePickerIncrement: 30,
          timePicker12Hour: false,
          timePickerSeconds: false
        }
      }
    },
    shipment: {
      type: Array,
      optional: true,
    },
    'shipment.$': {
      type: Object,
      optional: true
    },
    'shipment.$.itembeingshipped': {
      type: String,
      label: "Shipped Item",
      max: 128,
      optional: true
    },
    'shipment.$.shipmentcarrier': {
      type: String,
      label: "Shipped via",
      optional: true,
      autoform: {
        type: 'select',
        options: function() {
          return [
            {
              label: "UPS",
              value: "UPS",
            },
            {
              label: "DHL",
              value: "DHL"
            },
            {
              label: "Fedex",
              value: "Fedex"
            },
            {
              label: "Other",
              value: "Other"
            }
          ]
        }
      }
    },
    'shipment.$.shipmentcarriername': {
      type: String,
      label: "Name",
      max: 128,
      optional: true
    },
    'shipment.$.shipmenttracking': {
      type: String,
      label: "Tracking Number",
      max: 128,
      optional: true
    },
    tasks: {
      type: Array,
      optional: true
    },
    'tasks.$': {
      type: Object,
      optional: true
    },
    'tasks.$.taskname': {
      type: String,
      label: "Freelancer must",
      optional: true,
      autoform: {
        type: 'select',
        options: function() {
          return [
            {
              label: "Check In",
              value: "Check in"
            },
            {
              label: "Check Out",
              value: "Check Out"
            },
            {
              label: "Confirm assigment",
              value: "Confirm assigment"
            },
            {
              label: "Enter shipment tracking",
              value: "Enter shipment tracking"
            },
            {
              label: "Collect a signature",
              value: "Collect a signature"
            },
            {
              label: "Send an email",
              value: "Send an email"
            },
            {
              label: "Call phone number",
              value: "Call phone number"
            },
            {
              label: "Upload/take a picture",
              value: "Upload/take a picture"
            },
            {
              label: "Upload a file",
              value: "Upload a file"
            },
            {
              label: "Enter close out notes",
              value: "Enter close out notes"
            },
            {
              label: "Unique task",
              value: "Unique task"
            }
          ]
        }
      }
    },
    'tasks.$.taskdescription': {
      type: String,
      max: 256,
      optional: true
    },
    userId: {
      type: String,
      label: "User Id",
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
    description: {
      type: String,
      label: "Job Description",
      autoform: {
        afFieldInput: SUMMERNOTE_OPTIONS
      }
    },
    confidentialDescription: {
      type: String,
      label: "Confidential Information",
      autoform: {
        afFieldInput: SUMMERNOTE_OPTIONS
      }
    },
    status: {
      type: String,
      allowedValues: STATUSES,
      autoValue: function() {
        if (this.isInsert) {
          return 'active';
        } else if (this.isUpsert) {
          return {
            $setOnInsert: 'active'
          };
        }
      },
    },
    applicationStatus: {
      type: String,
      allowedValues: APPLICATION_STATUSES,
      autoValue: function() {
        if(this.isInsert) {
          return 'open';
        } else if(this.isUpsert) {
          return {
            $setOnInsert: 'open'
          };
        }
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
    htmlConfdentialDesc: {
      type: String,
      optional: true,
      autoValue: function(doc) {
        var htmlContent = this.field("confidentialDescription");
        if(Meteor.isServer && htmlContent.isSet) {
          return cleanHTML(htmlContent.value);
        }
      }
    },
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
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

Jobs.helpers({
  path: function() {
    return 'jobs/' + this._id + '/' + this.slug();
  },
  slug: function() {
    return getSlug(this.title);
  },
  featured: function() {
    return this.featuredThrough && moment().isBefore(this.featuredThrough);
  }
});

Jobs.allow({
  insert: function(userId, doc) {
    return userId && doc && userId === doc.userId;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['admin']) || 
    (!_.contains(fieldNames, 'htmlDescription') 
      && !_.contains(fieldNames, 'status') 
        && !_.contains(fieldNames, 'featuredThrough') 
          && !_.contains(fieldNames, 'featuredChargeHistory') 
          && userId && doc && userId === doc.userId);
  },
  remove: function(userId, doc) {
    return false;
  },
  fetch: ['userId']
});
