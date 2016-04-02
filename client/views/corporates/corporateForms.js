AutoForm.addHooks(['corporateNew', 'corporateEdit'], {
  after: {
    insert: function(error, result) {
      if (error) {
        console.log("Insert Error:", error);
      } else {
        analytics.track("Corporate Account Created");
        Router.go('corporate', {
          _id: result
        });
      }
    },
    update: function(error, result) {
      if (error) {
        console.log("Update Error:", error);
      } else {
        analytics.track("Corporate Account Edited");
        Router.go('corporate', {
          _id: Router.current().params._id
        });
      }
    }
  }
});

Template.corporateEdit.events({
  'click #cancel': function(event, template) {
    event.preventDefault();
    Router.go("corporate", {
      _id: this.corporateProfile._id
    });
  }
});

var customImagePreviewUrl = new ReactiveVar();

Template.corporateFields.rendered = function() {
  var interval;
  var template = this;
  interval = Meteor.setInterval(function() {
    if (typeof uploadcare !== "undefined") {
      Meteor.clearInterval(interval);
      var widget = uploadcare.SingleWidget('#custom-image');
      
      if(template.data && template.data.corporate && template.data.corporate.customImageUrl){
        var customImage = template.data.corporate.customImageUrl;
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

Template.corporateFields.helpers({
  "customImagePreviewUrl": function(event, template) {
    if(customImagePreviewUrl.get())
      return customImagePreviewUrl.get();
  },
  companyName: function() {
    var corpInfo = Meteor.user();
    return corpInfo.companyName;
  }
});