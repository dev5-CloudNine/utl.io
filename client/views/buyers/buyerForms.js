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
  'change select[name="mobileCarrier"]': function(event, template) {
    var mobileNumber = $('input[name="contactNumber"]').val();
    var mobileCarrier = event.target.value;
    if(mobileCarrier == 'Appalachian Wireless') {
      $('input[name="smsEmail"]').val()
    }
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
            customImagePreviewUrl.set(info.cdnUrl);
            analytics.track("Profile Image Uploaded");      
          });
        } else if(customImagePreviewUrl.get()){
            customImagePreviewUrl.set(null);
        }
      });
    }
  }, 10);

  Meteor.typeahead.inject('.typeahead');
};

var locLoaded=false;

Template.buyerFields.helpers({
  "customImagePreviewUrl": function(event, template) {
    if(customImagePreviewUrl.get())
      return customImagePreviewUrl.get();
  },
  location: function(query, sync, callback) {
      if(!locLoaded) $('.typeahead').addClass('loadinggif');
      Meteor.call('location', query, {}, function(err, res) {
          if (err) {
              console.log(err);
              return;
          }
          callback(res.map(function(v) {
              locLoaded = true;
              $('.typeahead').removeClass('loadinggif');
              return { value: v.city + ", " + v.state + ", " + v.zip}; }));
      });
  },
  companyInvited: function() {
    var corpInfo = Meteor.user();
    return corpInfo.companyName;
  }
});