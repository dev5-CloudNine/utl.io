UploadedDocuments = new FS.Collection("uploadedDocuments", {
	stores: [new FS.Store.GridFS("uploadedDocuments")]
});

UploadedDocuments.allow({
	insert: function (userId, doc) {
		return true;
	},
	update: function (userId, doc, fieldNames, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	},
	download: function() {
		return true;
	},
	fetch: null
});