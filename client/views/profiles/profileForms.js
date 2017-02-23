AutoForm.addHooks(['profileNew', 'profileEdit'], {
  after: {
    insert: function(error, result) {
      if (error) {
        toastr.error(error);
      } else {
        analytics.track("Profile Created");
        Router.go('profile', {
          _id: result
        });
      }
    },
    update: function(error, result) {
      if (error) {
        console.log(error)
        toastr.error(error);
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
    var smsEmail = mobileNumber + mobileCarrier;    
    $('input[name="smsAddress"]').val(smsEmail);
  },
  "change .resume_bag": function(event, template) {
    event.preventDefault();
    $('#resumespinner').show();
    var files = $(event.currentTarget)[0].files;
    if(!files) return;
    S3.upload({
      files: files,
      path: S3_FILEUPLOADS
    }, function(err, res) {
      $('.profileImgProgress').hide();
      if(err) toastr.error("Failed to upload resume");
      else {
        var fileDetails = {
          file_url: res.secure_url,
          file_name: res.file.original_name
        }
        Meteor.call('updateResumeURL', Meteor.userId(), fileDetails, function(error, result) {
          if(error) {
            toastr.error('Failed to update');
            $('#resumespinner').hide();
          } else {
            $('#resumespinner').hide();
          }
        })
      }
    });
  },
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
          })
        }
      })
    })
  },
  "click .remove-resume" : function(event) {
    event.preventDefault();
    $('#resumespinner').show();
    var url = $(event.currentTarget).data('url');
    var index = url.indexOf(S3_FILEUPLOADS)-1;
    var path = url.substr(index);
    S3.delete(path, function(err, res) {
      $('#resumespinner').hide();
      if (err) {
          toastr.error("Operation failed");
      } else {
        Meteor.call('removeResumeURL', Meteor.userId(), url, function (error, result) {
          if(error){
            toastr.error('Failed to update');
          }
        });
      }
    });
  }
});

Template.profileEdit.events({
  'click #cancel': function(event, template) {
    event.preventDefault();
    Router.go("profile", {
      _id: this.profile._id
    });
  }
});

Template.profileFields.rendered = function() {
  $('#dateOfBirth').datepicker({format: 'yyyy-mm-dd'});
  $('#resumespinner').hide();
  $('#imgspinner').hide();
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

Template.providerLocationMap.onRendered(function() {
  console.log(this);
  this.autorun(() => {
    if(GoogleMaps.loaded()) {
      $('#loc').geocomplete({country: 'us', details: '#locationDetails'}).bind('geocode:result', function(event, result) {
        $('#locationDetails').show();
      });
    }
  })
});

Template.providerLocationMap.helpers({
  locationData : function(){
    locLoaded = true;
    return this.profile.location;
  }
})