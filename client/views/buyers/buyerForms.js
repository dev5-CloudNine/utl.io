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
    var smsEmail = "";
    smsEmail = mobileNumber + mobileCarrier;
    $('input[name="smsAddress"]').val(smsEmail);
  },
  // "change .file_bag": function(event,template) {
  //   event.preventDefault();
  //   var files = $(event.currentTarget)[0].files

  //   if (!files) return;
  //   S3.upload({
  //       files: files,
  //       path: S3_FILEUPLOADS
  //   }, function(err, res) {
  //       $('.progress').hide();
  //       if (err) toastr.error("Failed to upload image");
  //       else {
  //         Meteor.call('updateImgURL', Meteor.userId(),res.url, function (error, result) {
  //           if(error){
  //             toastr.error('Failed to update');
  //           }
  //         });
  //       }
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
  }
  // "click .remove-img" : function(event) {
  //   event.preventDefault();
  //   $('#spinner').show();
  //   var url = Meteor.users.findOne({_id:Meteor.userId()}).imgURL;
  //   var index = url.indexOf(S3_FILEUPLOADS)-1;
  //   var path = url.substr(index);
  //   S3.delete(path, function(err, res) {
  //       $('#spinner').hide();
  //       if (err) {
  //           toastr.error("Operation failed");
  //       } else {
  //         Meteor.call('updateImgURL', Meteor.userId(), function (error, result) {
  //           if(error){
  //             toastr.error('Failed to update');
  //           }
  //         });
  //       }
  //   });
  // }
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
    return Meteor.users.findOne({_id: Meteor.userId()}).imgURL;
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