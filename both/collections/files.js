Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
});

Images.allow({
	insert: function (userId, doc) {
		console.log(Meteor.users.find().fetch());
		return true;
	},
	update: function (userId, doc, fieldNames, modifier) {
		return true;
	},
	remove: function () {
		return true;
	},
	download: function() {
		return true;
	},
	fetch: null
});
