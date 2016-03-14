Buyers = new Mongo.Collection("buyers");
Buyers.attachSchema(new SimpleSchema({
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
			options: function() {
			return [
				{
					label: "IT/Networking",
					value: "IT/Networking"
				},
				{
					label: "Wiring Installment",
					value: "Wiring Installment"
				}
			]
			}
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
}))