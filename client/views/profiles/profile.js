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
  },
  readableId: function() {
    return (Users.findOne({_id: this.userId}).readableID);
  },
  fav : function() {
    return Meteor.users.findOne({$and:[{_id:Meteor.userId()},{favoriteUsers: {$in: [this._id]}}]})?true:false;
  }
});

Template.profile.events({
  'click .favInactive': function(event, template) {
    event.preventDefault();
    Meteor.call('addToFav', this._id, "", function(error) {
      if(error) {
        console.log('Failed to add to favorites');
      }
      else {
        $(event.currentTarget).find('i').html('Lik\'d');
        $(event.currentTarget).removeClass('favInactive');
        $(event.currentTarget).addClass('favActive');
      }
    });
    event.stopPropagation();
  },
  'click .favActive': function(event, template) {
    event.preventDefault();
    Meteor.call('removeFromFav', this._id, "", function(error) {
      if(error) {
        console.log('Failed to add to favorites');
      }
      else {
        $(event.currentTarget).find('i').html('Like');
        $(event.currentTarget).removeClass('favActive');
        $(event.currentTarget).addClass('favInactive');
        console.log('Added to favorites');
      }
    });
    event.stopPropagation();
  }
})