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
  }
});