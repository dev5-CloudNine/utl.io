Template.profile.helpers({
  beforeRemove: function() {
    return function(collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.title + '"?')) {
        this.remove();
        analytics.track("Profile Removed");
        Router.go('profiles');
      }
    };
  },
  splitInterestedIn: function() {
    if (interestedIn)
      return interestedIn.split(",");
  }
});

Template.profile.events({
  'click a.addToFavorites': function(event, template) {
    var uId = this._id;
    Meteor.call('addUserToFav', uId, function(err) {
      if(err) {
        toastr.error('Failed to add user to favorites');
      }
      else {
        toastr.success('Added user to favorites');
      }
    });
  }
})