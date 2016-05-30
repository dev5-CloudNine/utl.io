Messages = new Meteor.Collection("messages"); 
Tasks = new Meteor.Collection("tasks");
Categories = new Meteor.Collection("Categories");
SubCategories = new Meteor.Collection("subcategories");
TimeSheet = new Meteor.Collection("timeSheet");
Reviews = new Meteor.Collection("reviews");
Notifications = new Meteor.Collection("notifications");

Categories.attachSchema(
	new SimpleSchema({
		label: {
			type: String
		},
		value: {
			type: String,
			autoValue: function(doc) {
				return this.field('label').value;
			}
		}
	}));
Categories.allow({
	insert: function() {
		return true;
	},
	update: function() {
		return true;
	},
	remove: function() {
		return true;
	}
});

SubCategories.attachSchema(new SimpleSchema({
	parentId: {
		type: String,
		autoform: {
			type: "select",
			options: function() {
				return Categories.find().fetch();
			}
		}
	},
	label: {
		type: String
	},
	value: {
		type: String,
		optional: true,
		autoValue: function() {
			return this.field('label').value;
		}
	}
}));

SubCategories.allow({
	insert: function() {
		return true;
	},
	update: function() {
		return true;
	},
	remove: function() {
		return true;
	}
});