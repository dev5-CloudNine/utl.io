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
  splitInterestedIn: function() {
    if (interestedIn)
      return interestedIn.split(",");
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
  customImageUrl: function(){
    var avatarID = Buyers.findOne({userId: this.userId}).avatar;
    if(!avatarID)
      return;
    var imgURL = Meteor.absoluteUrl()+"cfs/files/images/" + avatarID +"/"+Images.findOne({_id:avatarID}).original.name;
    return imgURL;
  }
});