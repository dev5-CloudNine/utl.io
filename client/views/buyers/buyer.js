Template.buyer.helpers({
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
  buyer: function() {
    return Buyers.findOne({userId: this.userId});
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
  userRole: function() {
    return Meteor.users.findOne({_id: this.userId}).roles[0];
  },
  buyerCompletedJobs: function() {
    return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'done'}, {assignmentStatus: 'paid'}]});
  },
  reviews: function() {
    return Reviews.findOne({$and: [{buyerId: this.userId}, {reviewedBy: 'provider'}, {reviewedJobId: this._id}]});
  }
});

Template.buyer.rendered = function() {
  this.$('.rateit').rateit();
}

Template.buyer.events({
  'click .favInactive': function(event, template) {
    event.preventDefault();
    Meteor.call('addToFav', this.userId, "", function(error) {
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
    Meteor.call('removeFromFav', this.userId, "", function(error) {
      if(error) {
        console.log('Failed to add to favorites');
      }
      else {
        $(event.currentTarget).removeClass('favActive');
        $(event.currentTarget).addClass('favInactive');
      }
    });
    event.stopPropagation();
  }
})