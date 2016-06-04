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

Template.corporateFields.events({
  'change select[name="mobileCarrier"]': function(event, template) {
    var mobileNumber = $('input[name="contactNumber"]').val();
    var mobileCarrier = event.target.value;
    var smsEmail = "";
    if(mobileCarrier == 'Appalachian Wireless') {
      smsEmail = mobileNumber + '@awsms.com';
    }
    else if(mobileCarrier == 'AT & T') {
      smsEmail = mobileNumber + '@txt.att.net';
    }
    else if(mobileCarrier == 'Bluegrass Cellular') {
      smsEmail = mobileNumber + '@sms.bluecell.com'
    }
    else if(mobileCarrier == 'Boost Mobile') {
      smsEmail = mobileNumber + '@myboostmobile.com'
    }
    else if(mobileCarrier == 'Carolina West') {
      smsEmail = mobileNumber + '@cwwsms.com'
    }
    else if(mobileCarrier == 'Cellular South') {
      smsEmail = mobileNumber + '@south1.com'
    }
    else if(mobileCarrier == 'Centennial Wireless') {
      smsEmail = mobileNumber + '@cwemail.com'
    }
    else if(mobileCarrier == 'Cincinnati Bell Wireless') {
      smsEmail = mobileNumber + '@mobile.att.net'
    }
    else if(mobileCarrier == 'Inland Cellular') {
      smsEmail = mobileNumber + '@inlandlink.com'
    }
    else if(mobileCarrier == 'Metro PCS') {
      smsEmail = mobileNumber + '@metropcs.sms.us'
    }
    else if(mobileCarrier == 'Ntelos') {
      smsEmail = mobileNumber + 'pcs.ntelos.com'
    }
    else if(mobileCarrier == 'Southern LINC') {
      smsEmail = mobileNumber + '@page.southernlinc.com'
    }
    else if(mobileCarrier == 'Sprint PCS') {
      smsEmail = mobileNumber + '@messaging.sprintpcs.com'
    }
    else if(mobileCarrier == 'Sun Com') {
      smsEmail = mobileNumber + '@tms.suncom.com'
    }
    else if(mobileCarrier == 'T-Mobile') {
      smsEmail = mobileNumber + '@tmomail.net'
    }
    else if(mobileCarrier == 'USCellular') {
      smsEmail = mobileNumber + '@uscc.textmsg.com'
    }
    else if(mobileCarrier == 'Verizon') {
      smsEmail = mobileNumber + '@vtext.com'
    }
    else if(mobileCarrier == 'Virgin Mobile') {
      smsEmail = mobileNumber + '@vmobl.com'
    }
    else if(mobileCarrier == 'Voice stream') {
      smsEmail = mobileNumber + '@voicestream.net'
    }
    $('input[name="smsAddress"]').val(smsEmail);
  }
})

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

  Meteor.typeahead.inject('.typeahead');
  $('.note-editor .note-toolbar .note-insert').remove();
};

var locLoaded=false;

Template.corporateFields.helpers({
  "customImagePreviewUrl": function(event, template) {
    if(customImagePreviewUrl.get())
      return customImagePreviewUrl.get();
  },
  companyName: function() {
    var corpInfo = Meteor.user();
    return corpInfo.companyName;
  },
  corpAdminEmail: function() {
    return Meteor.user().emails[0].address;
  },
  pagerAddress: function() {
    return "some address";
  },
  locationData : function(){
    locLoaded = true;
    return Corporates.findOne({_id:this.corporateProfile._id}).location;
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
  }
});