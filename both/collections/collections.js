Messages = new Meteor.Collection("messages"); 
Tasks = new Meteor.Collection("tasks");
Categories = new Meteor.Collection("Categories");
SubCategories = new Meteor.Collection("subcategories");
TimeSheet = new Meteor.Collection("timeSheet");
Reviews = new Meteor.Collection("reviews");
Notifications = new Meteor.Collection("notifications");
Skills = new Meteor.Collection("skills");
Wallet = new Meteor.Collection("wallet");
Transactions = new Meteor.Collection("transactions");
Invoices = new Meteor.Collection("invoices");

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

Skills.attachSchema(
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
Skills.allow({
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

Wallet.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fields, modifier) {
		return false;
	},
	remove: function() {
		return false;
	}
});