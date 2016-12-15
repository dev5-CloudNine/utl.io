Dispatchers = new Mongo.Collection("dispatchers");

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
    optional: true,
    regEx: /^[0-9]{5}$/
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

Dispatchers.attachSchema(
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
  invitedBy: {
    type: String,
    autoValue: function() {
      if(this.isInsert) {
        return Meteor.user().invitedBy;
      } else if(this.isUpsert) {
        return {
          $setOnInsert: Meteor.user().invitedBy
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
		label: "First Name *"
  },
  lastName: {
    type: String,
    label: 'Last Name *'
  },
	title: {
		type: String,
		label: "Designation *",
		max: 128
  },
  companyName: {
  	type: String,
  	label: "Company Name",
  	max: 128,
  	optional: true
  },
  companyUrl: {
    type: String,
    label: 'Company URL',
    optional: true
  },
  location: {
  	type: String,
  	label: "Location",
  	max: 256
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
  smsAddress: {
    type: String,
    label: "SMS Address",
    max: 256,
    optional: true
  },
  // ongoingJobs: {
  //   type: Array,
  //   optional: true
  // },
  // 'ongoingJobs.$': {
  //   type: String,
  // },
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
  status: {
    type: String,
    allowedValues: STATUSES,
    defaultValue: "active"
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
}));

Dispatchers.allow({
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

Dispatchers.deny({
  update: function(userId, doc, fieldNames, modifier) {
    if(Roles.userIsInRole(userId, ['admin']) || (!_.contains(fieldNames, 'randomSorter') && !_.contains(fieldNames, 'htmlDescription') && !_.contains(fieldNames, 'status') && userId && doc && userId === doc.userId)) {
      return false;
    } else {
      return true;
    }
  },
  fetch: ['userId']
})

Dispatchers.helpers({
  displayName: function() {
    return this.firstName + ' ' + this.lastName || this.userName;
  },
  path: function() {
    return 'dispatchers/' + this._id + '/' + this.slug();
  },
  slug: function() {
    return getSlug(this.displayName() + ' ' + this.title);
  }
});