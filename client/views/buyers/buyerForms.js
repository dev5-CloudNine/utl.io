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

Template.buyerFields.events({
  'change select[name="mobileCarrier"]': function(event, template) {
    var mobileNumber = $('input[name="contactNumber"]').val();
    var mobileCarrier = event.target.value;
    console.log(mobileCarrier);
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
  },
  "change .file_bag": function(event,template) {
    event.preventDefault();
    var files = $(event.currentTarget)[0].files

    if (!files) return;
    S3.upload({
        files: files,
        path: S3_FILEUPLOADS
    }, function(err, res) {
        $('.progress').hide();
        if (err) toastr.error("Failed to upload image");
        else {
          Meteor.call('updateImgURL', Meteor.userId(),res.url, function (error, result) {
            if(error){
              toastr.error('Failed to update');
            }
          });
        }
    });
  },
  "click .remove-img" : function(event) {
    event.preventDefault();
    $('#spinner').show();
    var url = Profiles.findOne({_id:Router.current().params._id}).customImageUrl;
    var index = url.indexOf(S3_FILEUPLOADS)-1;
    var path = url.substr(index);
    S3.delete(path, function(err, res) {
        $('#spinner').hide();
        if (err) {
            toastr.error("Operation failed");
        } else {
          Meteor.call('updateImgURL', Meteor.userId(), function (error, result) {
            if(error){
              toastr.error('Failed to update');
            }
          });
        }
    });
  }
})

Template.buyerEdit.events({
  'click #cancel': function(event, template) {
    event.preventDefault();
    Router.go("buyer", {
      _id: this.buyerProfile._id
    });
  }
});


Template.buyerFields.rendered = function() {
  $('#spinner').hide();
  $('.progress').hide();
  Meteor.typeahead.inject('.typeahead');
  $('.note-editor .note-toolbar .note-insert').remove();
};

var locLoaded=false;

Template.buyerFields.helpers({
  "customImagePreviewUrl": function() {
    return Meteor.users.findOne().imgURL;
  },
  locationData : function(){
    locLoaded = true;
    return this.buyerProfile.location;
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
        return { value: v.city + ", " + v.state + ", " + v.zip}; 
      }));
    });
  },
  companyInvited: function() {
    var corpInfo = Meteor.user();
    return corpInfo.companyName;
  },
  "uploadedFiles": function(){
      return S3.collection.find();
  }
});