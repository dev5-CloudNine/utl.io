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
    return Meteor.users.findOne({$and:[{_id:Meteor.userId()},{favoriteUsers: {$in: [this.userId]}}]})?true:false;
  },
  favCount: function() {
    return Meteor.users.findOne({_id: this.userId}).favCount;
  },
  providerCompletedJobs: function() {
    var completedJobs = [];
    if(this.completedJobs) {
      for(var i = 0; i < this.completedJobs.length; i++) {
        completedJobs.push(Jobs.findOne({_id: this.completedJobs[i]}));
      }
      return completedJobs;
    }
  },
  reviews: function() {
    return Reviews.findOne({$and: [{providerId: this.assignedProvider}, {reviewedBy: 'buyer'}, {reviewedJobId: this._id}]});
  },
  userRole: function() {
    return Users.findOne({_id: this.userId}).roles[0];
  },
  "customImageUrl": function() {
    return Meteor.users.findOne({_id: this.userId}).imgURL;
  },
  resumeUrl: function() {
    return Meteor.users.findOne({_id: this.userId}).resumeURL;
  }
});

Template.profile.rendered = function() {
  this.$('.rateit').rateit();
}

Template.profile.events({
  'click .favInactive': function(event, template) {
    event.preventDefault();
    Meteor.call('addToFav', this.userId, Meteor.user().roles[0], function(error) {
      if(error) {
        console.log('Failed to add to favorites');
      }
      else {
        $(event.currentTarget).removeClass('favInactive');
        $(event.currentTarget).addClass('favActive');
      }
    });
    event.stopPropagation();
  },
  'click .favActive': function(event, template) {
    event.preventDefault();
    Meteor.call('removeFromFav', this.userId, Meteor.user().roles[0], function(error) {
      if(error) {
        console.log('Failed to add to favorites');
      }
      else {
        $(event.currentTarget).removeClass('favActive');
        $(event.currentTarget).addClass('favInactive');
        console.log('Added to favorites');
      }
    });
    event.stopPropagation();
  }
})