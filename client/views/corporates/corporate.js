Template.corporate.helpers({
  beforeRemove: function() {
    return function(collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.title + '"?')) {
        this.remove();
        analytics.track("Corporate Account Removed");
        Router.go('corporates');
      }
    };
  },
  splitInterestedIn: function() {
    if (interestedIn)
      return interestedIn.split(",");
  },
  readableId: function() {
    return Meteor.users.findOne({_id: this.userId}).readableID;
  },
  userRole: function() {
    return Meteor.users.findOne({_id: this.userId}).roles[0];
  }
});
