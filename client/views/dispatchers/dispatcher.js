Template.dispatcher.helpers({
  beforeRemove: function() {
    return function(collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.title + '"?')) {
        this.remove();
        analytics.track("Buyer Removed");
        Router.go('buyers');
      }
    };
  },
  splitIndustryTypes: function() {
    console.log(this.industryTypes);
  },
  dispatcher: function() {
    return Dispatchers.findOne({userId: this.userId});
  },
  jobs: function() {
    return Jobs.find({
      userId: this.userId
    }, {
      sort: {
        createdAt: -1
      }
    });
  },
  readableId: function() {
    return (Users.findOne({_id: this.userId}).readableID);
  },
  customImageUrl: function(){
    return Meteor.users.findOne({_id: this.userId}).imgURL;
  },
  fav : function() {
    return Meteor.users.findOne({$and:[{_id:Meteor.userId()},{favoriteUsers: {$in: [this.userId]}}]})?true:false;
  },
  favCount: function() {
    return Users.findOne({_id: this.userId}).favCount;
  },
  userRole: function() {
    return Meteor.users.findOne({_id: this.userId}).roles[0];
  },
  buyerCompletedJobs: function() {
    return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'paid'}, {assignmentStatus: 'paid'}]});
  },
  reviews: function() {
    return Reviews.findOne({$and: [{buyerId: this.userId}, {reviewedBy: 'provider'}, {reviewedJobId: this._id}]});
  },
  itypes: function() {
    var itypes = [];
    var industryTypes = this.industryTypes;
    for(var i  = 0; i < industryTypes.length; i++) {
      itypes.push({
        encodedType: encodeURIComponent(industryTypes[i]),
        decodedType: industryTypes[i]
      });
    }
    return itypes;
  },
  adminOrDispatcher: function() {
    if(Roles.userIsInRole(Meteor.userId(), ['admin']) || this.userId == Meteor.userId())
      return true;
    return false;
  }
});

Template.dispatcher.rendered = function() {
  this.$('.rateit').rateit();
}

Template.dispatcher.events({
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
      }
    });
    event.stopPropagation();
  },
  'click .deactivateProfile': function(event, template) {
    event.preventDefault();
    Meteor.call('deactivateDispatcherProfile', this.userId, function(error) {
      if(error) {
        toastr.error('Failed to deactivate profile');
      }
    })
  },
  'click .activateProfile': function(event, template) {
    event.preventDefault();
    Meteor.call('activateDispatcherProfile', this.userId, function(error) {
      if(error) {
        toastr.error('Failed to activate profile');
      }
    })
  }
});

Template.dispatcher.rendered = function() {
  var points = 0;
  var reviews = Reviews.find({$and: [{buyerId: this.data.userId}, {reviewedBy: 'provider'}]}).fetch();
  if(reviews) {
    for(var i = 0; i < reviews.length; i++) {
      points += reviews[i].pointsRated;
    }
  }
  var ratingPoints = points/reviews.length;
  this.$('.rateit').rateit({readonly: true, value: ratingPoints});
}