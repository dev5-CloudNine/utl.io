Corporates = new Mongo.Collection('corporates');

Corporates.attachSchema(
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
		label: "Full Name",
		max: 128
    },
	title: {
		type: String,
		label: "Designation",
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
    label: "Company URL",
    max: 1024,
    optional: true,
    regEx: SimpleSchema.RegEx.Url
  },
  eintinNumber: {
  	type: String,
  	label: "EIN/TIN Number",
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
    label: "Mobile Number",
    max: 128,
  },
  mobileCarrier: {
    type: String,
    label: "Mobile Provider",
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

Corporates.allow({
	insert: function (userId, doc) {
		return userId && doc && userId === doc.userId;
	},
	update: function (userId, doc, fieldNames, modifier) {
		return Roles.userIsInRole(userId, ['admin']) || (!_.contains(fieldNames, 'randomSorter') && !_.contains(fieldNames, 'htmlDescription') && !_.contains(fieldNames, 'status') && userId && doc && userId === doc.userId);
	},
	remove: function (userId, doc) {
		return Roles.userIsInRole(userId, ['admin']) || (userId && doc && userId === doc.userId);
	},
	fetch: ['userId']
});

Corporates.helpers({
  displayName: function() {
    return this.name || this.userName;
  },
  path: function() {
    return 'corporates/' + this._id + '/' + this.slug();
  },
  slug: function() {
    return getSlug(this.displayName() + ' ' + this.title);
  }
});

TempInvitation = new Mongo.Collection('tempInvitation');
