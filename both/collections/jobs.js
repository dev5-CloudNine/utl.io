Jobs = new Mongo.Collection("jobs");
AddressSchema = new SimpleSchema({
  street: {
    type: String,
    optional: true
  },
  locality: {
    type: String,
    optional: true
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
})

Jobs.attachSchema(new SimpleSchema({
    title: {
      type: String,
      label: "Job Title *"
    },
    skillsrequired: {
      type: String,
      label: "Required Skills *"
    },
    fullLocation: {
      type: AddressSchema,
      optional: true,
      custom: function() {
        var shouldBeRequired = this.field('servicelocation').value == 'Field Job';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    location: {
      type: String,
      label: "Location",
      optional: true,
      custom: function() {
        var shouldBeRequired = this.field('servicelocation').value == 'Field Job';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    invitedproviders: {
      type: [String],
      optional: true,
      label: 'Choose one or more providers',
      autoform: {
        type: "selectize",
        options: function() {
          return Profiles.find().fetch().map(function(profile) {
            var providerDetails = {
              label: profile.firstName + ' ' + profile.lastName,
              value: profile.userId
            }
            return providerDetails;
          })
        },
        multiple: true
      }
    },
    individualProvider: {
      type: String,
      optional: true,
      label: 'Choose one provider',
      autoform: {
        type: 'selectize',
        options: function() {
          return Profiles.find().fetch().map(function(profile) {
            var providerDetails = {
              label: profile.firstName + ' ' + profile.lastName,
              value: profile.userId
            }
            return providerDetails;
          })
        }
      }
    },
    jobtype: {
      type: String,
      label: "Select Job Category *"
    },
    jobSubCategory: {
      type: String,
      label: "Select Job Sub Category *",
      autoform: {
        type: "selectize",
        options: function() {
          var parId = this.field('jobtype');
          return SubCategories.find({parentId: parId});
        }
      }
    },
    routed: {
      type: Boolean,
      defaultValue: false
    },
    invited: {
      type: Boolean,
      defaultValue: false
    },
    favoriteProviders: {
      type: [String],
      optional: true
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
      decimal: true,
      optional: true,
      custom: function() {
        var shouldBeRequired = this.field('ratebasis').value == 'Fixed Pay';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    hourlyrate: {
      type: Number,
      min: 1,
      label: "Hourly Rate (USD)",
      optional: true,
      decimal: true,
      custom: function() {
        var shouldBeRequired = this.field('ratebasis').value == 'Per Hour';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    maxhours: {
      type: Number,
      min: 1,
      label: "Maximum Hours",
      optional: true,
      custom: function() {
        var shouldBeRequired = this.field('ratebasis').value == 'Per Hour';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    rateperdevice: {
      type: Number,
      min: 1,
      label: "Rate per Device (USD)",
      optional: true,
      decimal: true,
      custom: function() {
        var shouldBeRequired = this.field('ratebasis').value == 'Per Device';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    maxdevices: {
      type: Number,
      min: 1,
      label: "Maximum Devices",
      optional: true,
      custom: function() {
        var shouldBeRequired = this.field('ratebasis').value == 'Per Device';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    estimatedDevices: {
      type: Number,
      optional: true
    },
    devicescompleted: {
      type: Number,
      optional: true
    },
    payforfirsthours: {
      type: Number,
      min: 1,
      label: "Pay (USD)",
      optional: true,
      decimal: true,
      custom: function() {
        var shouldBeRequired = this.field('ratebasis').value == 'Blended';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    firsthours: {
      type: Number,
      min: 1,
      label: "total for the first",
      optional: true,
      custom: function() {
        var shouldBeRequired = this.field('ratebasis').value == 'Blended';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    payfornexthours: {
      type: Number,
      min: 1,
      label: "hour(s) and then USD",
      optional: true,
      decimal: true,
      custom: function() {
        var shouldBeRequired = this.field('ratebasis').value == 'Blended';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    nexthours: {
      type: Number,
      min: 1,
      label: "per hour for up to",
      optional: true,
      custom: function() {
        var shouldBeRequired = this.field('ratebasis').value == 'Blended';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    totalfromclient: {
      type: Number,
      min: 1,
      label: "Total Amount",
      decimal: true
    },
    your_cost: {
      type:  Number,
      label: "Your Cost",
      min: 1,
      decimal: true
    },
    freelancer_nets: {
      type: Number,
      label: "Freelancer Nets",
      min: 1,
      decimal: true
    },
    paidby: {
      type: String,
      label: "Paid By",
      autoform: {
        type: 'select-radio-inline',
        defaultValue: "buyer",
        options: function() {
          return [
            {
              label: "Buyer",
              value: "buyer"
            },
            {
              label: "Provider",
              value: "provider"
            }
          ]
        }
      }
    },
    servicelocation: {
    label: "Job Location *",
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
    label: "Job Schedule (Local Time)*",
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
    files: {
      type: Array,
      optional: true
    },
    'files.$': {
      type: Object,
    },
    'files.$.file_url': {
      type: String,
    },
    'files.$.file_name': {
      type: String
    },
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
    'applications.$.app_type': {
      type: String,
      optional: true,
      allowedValues: ['application', 'counteroffer']
    },
    'applications.$.app_status': {
      type: String,
      allowedValues: ['accepted', 'declined', 'rejected'],
      optional: true
    },
    'applications.$.counterType': {
      type: String,
      optional: true
    },
    'applications.$.fixed_amount': {
      type: Number,
      decimal: true,
      optional: true
    },
    'applications.$.hourly_rate': {
      type: Number,
      decimal: true,
      optional: true
    },
    'applications.$.max_hours': {
      type: Number,
      optional: true
    },
    'applications.$.device_rate': {
      type: Number,
      decimal: true,
      optional: true
    },
    'applications.$.max_devices': {
      type: Number,
      optional: true
    },
    'applications.$.first_hours': {
      type: Number,
      decimal: true,
      optional: true
    },
    'applications.$.first_max_hours': {
      type: Number,
      optional: true
    },
    'applications.$.next_hours': {
      type: Number,
      decimal: true,
      optional: true
    },
    'applications.$.next_max_hours': {
      type: Number,
      optional: true
    },
    'applications.$.total_amount': {
      type: Number,
      decimal: true,
      optional: true
    },
    'applications.$.buyer_cost': {
      type: Number,
      decimal: true,
      optional: true
    },
    'applications.$.freelancer_nets': {
      type: Number,
      decimal: true,
      optional: true
    },
    'applications.$.counter_description': {
      type: String,
      optional: true
    },
    expenses: {
      type: Array,
      optional: true
    },
    'expenses.$': {
      type: Object
    },
    'expenses.$.expense_id': {
      type: Number
    },
    'expenses.$.expense_amount': {
      type: Number,
      decimal: true
    },
    'expenses.$.buyer_cost': {
      type: Number,
      decimal: true
    },
    'expenses.$.expense_description': {
      type: String
    },
    'expenses.$.timeStamp': {
      type: Date
    },
    'expenses.$.request_status': {
      type: String,
      allowedValues: ['pending', 'accepted', 'rejected']
    },
    budgetIncreases: {
      type: Array,
      optional: true
    },
    'budgetIncreases.$': {
      type: Object
    },
    'budgetIncreases.$.request_id': {
      type: Number,
      optional: true
    },
    'budgetIncreases.$.request_type': {
      type: String,
      optional: true
    },
    'budgetIncreases.$.fixed_amount': {
      type: Number,
      decimal: true,
      optional: true
    },
    'budgetIncreases.$.hourly_rate': {
      type: Number,
      decimal: true,
      optional: true
    },
    'budgetIncreases.$.max_hours': {
      type: Number,
      optional: true
    },
    'budgetIncreases.$.device_rate': {
      type: Number,
      decimal: true,
      optional: true
    },
    'budgetIncreases.$.max_devices': {
      type: Number,
      optional: true
    },
    'budgetIncreases.$.first_hours': {
      type: Number,
      decimal: true,
      optional: true
    },
    'budgetIncreases.$.first_max_hours': {
      type: Number,
      optional: true
    },
    'budgetIncreases.$.next_hours': {
      type: Number,
      decimal: true,
      optional: true
    },
    'budgetIncreases.$.next_max_hours': {
      type: Number,
      optional: true
    },
    'budgetIncreases.$.total_amount': {
      type: Number,
      decimal: true,
      optional: true
    },
    'budgetIncreases.$.buyer_cost': {
      type: Number,
      decimal: true,
      optional: true
    },
    'budgetIncreases.$.provider_nets': {
      type: Number,
      decimal: true,
      optional: true
    },
    'budgetIncreases.$.timeStamp': {
      type: Date,
      optional: true
    },
    'budgetIncreases.$.request_status': {
      type: String,
      allowedValues: ['pending', 'accepted', 'rejected']
    },
    proposedBudget: {
      type: Number,
      decimal: true,
      optional: true
    },
    acceptedBudget: {
      type: Number,
      decimal: true,
      optional: true
    },
    projectBudget: {
      type: Number,
      decimal: true,
      optional: true
    },
    buyerCost: {
      type: Number,
      decimal: true,
      autoValue: function() {
        if (this.isInsert) {
          return this.field('your_cost').value;
        } else if(this.isUpdate) {
          return this.field('your_cost').value;
        }
      }
    },
    buyerInitialBudget: {
      type: Number,
      decimal: true,
      autoValue: function() {
        if (this.isInsert) {
          return this.field('your_cost').value;
        } else if(this.isUpdate) {
          return this.field('your_cost').value;
        }
      }
    },
    estimatedProviderEarnings: {
      type: Number,
      decimal: true,
      optional: true
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
      label: "Exactly on date",
      autoform: {
        type: "bootstrap-datepicker"
      },
      custom: function() {
        var shouldBeRequired = this.field('serviceschedule').value == 'exactdate';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    exacttime: {
      type: String,
      optional: true,
      label: "Time",
      autoform: {
        type: "bootstrap-timepicker"
      }
    },
    startdate: {
      type: Date,
      optional: true,
      label: "Starting from",
      autoform: {
        type: 'bootstrap-datepicker'
      },
      custom: function() {
        var shouldBeRequired = this.field('serviceschedule').value == 'betweendates';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    enddate: {
      type: Date,
      optional: true,
      label: "Ending on",
      autoform: {
        type: 'bootstrap-datepicker'
      },
      custom: function() {
        var shouldBeRequired = this.field('serviceschedule').value == 'betweendates';
        if(shouldBeRequired) {
          if(!this.operator) {
            if(!this.isSet || this.value === null || this.value === '')
              return 'required';
          }
          else if(this.isSet) {
            if(this.operator === '$set' && this.value === null || this.value === '')
              return 'required';
            if(this.operator === '$unset')
              return 'required';
            if(this.operator === '$rename')
              return 'required';
          }
        }
      }
    },
    starttime: {
      type: String,
      optional: true,
      label: "Starting time",
      autoform: {
        type: "bootstrap-timepicker"
      }
    },
    endtime: {
      type: String,
      optional: true,
      label: "Ending time",
      autoform: {
        type: "bootstrap-timepicker"
      }
    },
    shipment: {
      type: Array,
      optional: true
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
      label: "Shipment Courier Name",
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
              label: "Enter shipment tracking",
              value: "Enter shipment tracking"
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
      label: 'Task Description',
      optional: true
    },
    assignedProvider: {
      type: String, 
      optional: true
    },
    selectedProvider: {
      type: String,
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
        type: 'tinyMCE',
        data: {
          menubar: false,
          statusbar: false,
          height: 400
        }
      }
    },
    confidentialDescription: {
      type: String,
      label: 'Visible to assigned provider only',
      optional: true,
      autoform: {
        rows: 8
      }
    },
    status: {
      type: String,
      allowedValues: STATUSES,
      defaultValue: 'active'
    },
    paid30Usd: {
      type: Boolean,
      defaultValue: false
    },
    denied30Usd: {
      type: Boolean,
      defaultValue: false
    },
    applicationStatus: {
      type: String,
      allowedValues: APPLICATION_STATUSES,
      defaultValue: 'open'
    },
    buyerArchived: {
      type: Boolean,
      defaultValue: false
    },
    providerArchived: {
      type: Boolean,
      defaultValue: false
    },
    assignmentStatus: {
      type: String,
      allowedValues: ['not_confirmed', 'confirmed', 'submitted', 'approved', 'rejected', 'pending_payment', 'paid'],
      optional: true
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
  }));

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

if (Meteor.isServer) {
  Jobs._ensureIndex({
    "title": "text",
    "description": "text",
    "location": "text"
  });
}

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
