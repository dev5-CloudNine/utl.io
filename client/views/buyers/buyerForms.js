AutoForm.addHooks(['buyerNew', 'buyerEdit'], {
  after: {
    insert: function(error, result) {
      if (error) {
        toastr.error(error);
      } else {
        analytics.track("Buyer Created");
        Router.go('buyer', {
          _id: result
        });
      }
    },
    update: function(error, result) {
      if (error) {
        toastr.error(error);
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
  'keyup input[name="socialSecurityNumber"], keydown input[name="socialSecurityNumber"]': function(event, template) {
    if (!((event.keyCode == 46 || 
      event.keyCode == 8  || 
      event.keyCode == 37 || 
      event.keyCode == 39 || 
      event.keyCode == 9) || 
      $(event.currentTarget).val().length < 4 &&
      ((event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105)))) {
      event.preventDefault();
      return false;
    }
  },
  'change .file_bag': function(event, template) {
    event.preventDefault();
    var files = $(event.currentTarget)[0].files;
    var buyerId;
    if(Router.current().route.getName() == 'profileNew') {
      buyerId = Meteor.userId();
    } else if(Router.current().route.getName() == 'profileEdit') {
      buyerId = this.buyerProfile.userId;
    }
    Resizer.resize(files[0], {width: 200, height: 200, cropSquare: true}, function(err, file) {
      var uploader = new Slingshot.Upload('userImages');
      uploader.send(file, function(err, imgUrl) {
        $('.progress').hide();
        if(err)
          console.log(err);
        else {
          Meteor.call('updateImgURL', buyerId, imgUrl, function(error, result) {
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
  $('#dateOfBirth').datepicker({format: 'yyyy-mm-dd'});
  $('#spinner').hide();
  $('.progress').hide();
  Meteor.typeahead.inject('.typeahead');
  $('.note-editor .note-toolbar .note-insert').remove();
};

var locLoaded=false;

Template.buyerFields.helpers({
  "customImagePreviewUrl": function() {
    if(Router.current().route.getName() == 'profileNew') {
      var user = Meteor.user();
      if(user.imgURL)
        return user.imgURL;
    } else {
      return Meteor.users.findOne({_id: this.buyerProfile.userId}).imgURL;
    }
  },
  locationData : function(){
    locLoaded = true;
    if(Router.current().route.getName() == 'profileNew')
      return;
    else
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

Template.buyerLocationMap.onRendered(function() {
  this.autorun(() => {
    if(GoogleMaps.loaded()) {
      $('#loc').geocomplete({country: 'us', details: '#buyerLocationDetails'}).bind('geocode:result', function(event, result) {
        $('#buyerLocationDetails').show();
      })
    }
  })
});

Template.buyerLocationMap.helpers({
  locationData : function(){
    locLoaded = true;
    if(Router.current().route.getName() == 'profileNew')
      return;
    else
      return this.buyerProfile.location;
  }
})