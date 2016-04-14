AutoForm.addHooks(['buyerNew', 'buyerEdit'], {
  after: {
    insert: function(error, result) {
      if (error) {
        console.log("Insert Error:", error);
      } else {
        analytics.track("Buyer Created");
        Router.go('buyer', {
          _id: result
        });
      }
    },
    update: function(error, result) {
      if (error) {
        console.log("Update Error:", error);
      } else {
        analytics.track("Buyer Edited");
        Router.go('buyer', {
          _id: Router.current().params._id
        });
      }
    }
  }
});

Template.buyerEdit.events({
  'click #cancel': function(event, template) {
    event.preventDefault();
    Router.go("buyer", {
      _id: this.buyerProfile._id
    });
  },
  'change $(select[name="mobileCarrier"]': function(event, template) {
    console.log(event.target.value);
  }
});

var customImagePreviewUrl = new ReactiveVar();

Template.buyerFields.rendered = function() {
  var interval;
  var template = this;
  interval = Meteor.setInterval(function() {
    if (typeof uploadcare !== "undefined") {
      Meteor.clearInterval(interval);
      var widget = uploadcare.SingleWidget('#custom-image');
      
      if(template.data && template.data.buyer && template.data.buyer.customImageUrl){
        var customImage = template.data.buyer.customImageUrl;
        if(customImage){
          widget.value(customImage);
          customImagePreviewUrl.set(customImage);
        }
      }

      widget.onChange(function(file) {
        if (file) {
          file.done(function(info) {
            console.log(info);
            customImagePreviewUrl.set(info.cdnUrl);
            analytics.track("Profile Image Uploaded");      
          });
        } else if(customImagePreviewUrl.get()){
            customImagePreviewUrl.set(null);
        }
      });
    }
  }, 10);
};

Template.buyerFields.helpers({
  "customImagePreviewUrl": function(event, template) {
    if(customImagePreviewUrl.get())
      return customImagePreviewUrl.get();
  }
});