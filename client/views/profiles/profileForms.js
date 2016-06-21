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
  'keyup .skills input' : function(event) {
    var newSkill = $('.skills input').val();
    if (event.which === 13) {
         var exists = Skills.findOne({value:newSkill});
         if(!exists) {
            new Confirmation({
              message: "Do you want to add '"+newSkill+ "' to skills?",
              title: "Confirmation",
              cancelText: "Cancel",
              okText: "Ok",
              success: true, // whether the button should be green or red
              focus: "cancel" // which button to autofocus, "cancel" (default) or "ok", or "none"
            }, function (ok) {
              if(ok) {                
                Meteor.call('addNewSkill',newSkill);
                toastr.info("'"+newSkill + "' has been added. Please select it");
                $('.skills input').val('');
              }
            });
         }
         event.stopPropagation();
         return false;
    }
  },
  "change .resume_bag": function(event, template) {
    event.preventDefault();
    var files = $(event.currentTarget)[0].files;
    if(!files) return;
    S3.upload({
      files: files,
      path: S3_FILEUPLOADS
    }, function(err, res) {
      $('.resumeProgress').hide();
      $('.profileImgProgress').hide();
      if(err) toastr.error("Failed to upload resume");
      else {
        Meteor.call('updateResumeURL', Meteor.userId(), res.url, function(error, result) {
          if(error) {
            toastr.error('Failed to update');
          }
        })
      }
    });
  },
  // "change .file_bag": function(event,template) {
  //   event.preventDefault();
  //   var files = $(event.currentTarget)[0].files;
  //   if (!files) return;
  //   S3.upload({
  //     files: files,
  //     path: S3_FILEUPLOADS
  //   }, function(err, res) {
  //     $('.profileImgProgress').hide();
  //     $('.resumeProgress').hide();
  //     if (err) toastr.error("Failed to upload image");
  //     else {
  //       Meteor.call('updateImgURL', Meteor.userId(),res.url, function (error, result) {
  //         if(error){
  //           toastr.error('Failed to update');
  //         }
  //       });
  //     }
  //   });
  // },
  'change .file_bag': function(event, template) {
    event.preventDefault();
    var files = $(event.currentTarget)[0].files;
    Resizer.resize(files[0], {width: 200, height: 200, cropSquare: true}, function(err, file) {
      var uploader = new Slingshot.Upload('userImages');
      uploader.send(file, function(err, imgUrl) {
        $('.progress').hide();
        if(err)
          console.log(err);
        else {
          Meteor.call('updateImgURL', Meteor.userId(), imgUrl, function(error, result) {
            if(error)
              toastr.error("Failed to update.");
            else {
              toastr.success('Successfully updated.');
            }
          })
        }
      })
    })
  },
  "click .remove-resume" : function(event) {
    event.preventDefault();
    $('#spinner').show();
    var url = Meteor.users.findOne({_id: Meteor.userId()}).resumeURL;
    var index = url.indexOf(S3_FILEUPLOADS)-1;
    var path = url.substr(index);
    S3.delete(path, function(err, res) {
      $('#spinner').hide();
      if (err) {
          toastr.error("Operation failed");
      } else {
        Meteor.call('updateResumeURL', Meteor.userId(), function (error, result) {
          if(error){
            toastr.error('Failed to update');
          }
        });
      }
    });
  },
  // "click .remove-img" : function(event) {
  //   event.preventDefault();
  //   $('#spinner').show();
  //   var url = Meteor.users.findOne({_id: Meteor.userId()}).imgURL;
  //   var index = url.indexOf(S3_FILEUPLOADS)-1;
  //   var path = url.substr(index);
  //   S3.delete(path, function(err, res) {
  //     $('#spinner').hide();
  //     if (err) {
  //         toastr.error("Operation failed");
  //     } else {
  //       Meteor.call('updateImgURL', Meteor.userId(), function (error, result) {
  //         if(error){
  //           toastr.error('Failed to update');
  //         }
  //       });
  //     }
  //   });
  // }
});
// var customImagePreviewUrl = new ReactiveVar();

Template.profileEdit.events({
  'click #cancel': function(event, template) {
    event.preventDefault();
    Router.go("profile", {
      _id: this.profile._id
    });
  }
});

Template.profileFields.rendered = function() {
  $('#spinner').hide();
  $('.profileImgProgress').hide();
  $('.resumeProgress').hide();
  Meteor.typeahead.inject('.typeahead');
  $('.note-editor .note-toolbar .note-insert').remove();
};

var locLoaded=false;

Template.profileFields.helpers({
  "customImagePreviewUrl": function() {
    return Meteor.users.findOne({_id: Meteor.userId()}).imgURL;
  },
  resumeUrl: function() {
    return Meteor.users.findOne({_id: Meteor.userId()}).resumeURL;
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
          return { value: v.city + ", " + v.state + ", " + v.zip}; 
        }));
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
  },
  "uploadedFiles": function(){
    return S3.collection.find();
  }
});