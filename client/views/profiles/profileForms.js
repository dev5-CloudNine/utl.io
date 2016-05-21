AutoForm.addHooks(['profileNew', 'profileEdit'], {
  after: {
    insert: function(error, result) {
      if (error) {
        console.log("Insert Error:", error);
      } else {
        analytics.track("Profile Created");
        Router.go('profile', {
          _id: result
        });
      }
    },
    update: function(error, result) {
      if (error) {
        console.log("Update Error:", error);
      } else {
        analytics.track("Profile Edited");
        Router.go('profile', {
          _id: Router.current().params._id
        });
      }
    }
  }
});

Template.profileFields.events({
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
  },
  'change .file_bag': function(event, template){
    event.preventDefault();
    $('#spinner').show();
    var files = $(event.currentTarget)[0].files;
    if(!files)
      return;
    S3.upload({
      files: files,
      path: S3_FILEUPLOADS
    }, function(error, result) {
      $('#spinner').hide();
      if(error) {
        toastr.error('Failed to upload documents.');
      }
      else {
        var files = [];
        var fileListItem = '<li data-url='+result.url+' style="list-style: none;"><i class="fa fa-times-circle remove-file" aria-hidden="true" title="Remove" style="cursor: pointer;" onclick="removeFile(\''+result.url+'\')"></i> <a href='+result.url+' target="_blank">'+result.url+'</a></li>'
        $('.fileList').append(fileListItem);
        $('ul.fileList li').each(function(li) {
          files.push($(this).data('url'));
        })
        Profiles.before.insert(function(userId, doc) {
          doc.files = [];
          doc.files.pushArray(files);
        })        
        toastr.success('Uploaded documents successfully');
      }
    })
  }
})

Template.profileEdit.events({
  'click #cancel': function(event, template) {
    event.preventDefault();
    Router.go("profile", {
      _id: this.profile._id
    });
  }
})

var customImagePreviewUrl = new ReactiveVar();

Template.profileFields.rendered = function() {
  var interval;
  var template = this;
  interval = Meteor.setInterval(function() {
    if (typeof uploadcare !== "undefined") {
      Meteor.clearInterval(interval);
      var widget = uploadcare.SingleWidget('#custom-image');
      
      if(template.data && template.data.profile && template.data.profile.customImageUrl){
        var customImage = template.data.profile.customImageUrl;
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
};

var locLoaded=false;

Template.profileFields.helpers({
  "customImagePreviewUrl": function(event, template) {
    if(customImagePreviewUrl.get())
    	return customImagePreviewUrl.get();
  },
  companyInvited: function() {
    var corpInfo = Meteor.user();
    return corpInfo.companyName;
  },
  locationData : function(){
    locLoaded = true;
    return this.profile.location;
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
  parentCategories: function() {
    return Categories.find().fetch();
  },
  childCategories: function(parentId) {
    return SubCategories.find({parentId: parentId}).map(function(c) {
      return {label: c.value, value: c._id}
    });
  },
  parentId: function() {
    return Categories.findOne({value: this.parentId})._id;
  }
});