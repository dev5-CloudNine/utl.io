Buyers = new Mongo.Collection("clients");

Buyers.attachSchema(
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
		label: "Name",
		max: 128
    },
	title: {
		type: String,
		label: "Title",
		max: 128
    },
  companyName: {
  	type: String,
  	label: "Company Name",
  	max: 128,
  	optional: true
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
  insuranceNumber: {
  	type: String,
  	label: "Insurance Number",
  	max: 128,
  	optional: true
    },
  location: {
  	type: String,
  	label: "Location",
  	max: 256
  },
  description: {
  	type: String,
  	label: "Description",
  	max: 10000,
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
		label: "Interested In",
		optional: true,
		autoform: {
			type: "select-multiple",
			options: INDUSTRY_TYPES
		}
    },
    contactNumber: {
      type: String,
      label: "Telephone Number",
      max: 128,
    },
    contactEmail: {
      type: String,
      label: "Email",
      max: 128
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

Buyers.allow({
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

Buyers.helpers({
  displayName: function() {
    return this.name || this.userName;
  },
  path: function() {
    return 'buyers/' + this._id + '/' + this.slug();
  },
  slug: function() {
    return getSlug(this.displayName() + ' ' + this.title);
  }
});