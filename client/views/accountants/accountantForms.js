AutoForm.addHooks(['accountantNew', 'accountantEdit'], {
  after: {
    insert: function(error, result) {
      if (error) {
        toastr.error("Insert Error:", error);
      } else {
        analytics.track("accountant Created");
        Router.go('accountant', {
          _id: result
        });
      }
    },
    update: function(error, result) {
      if (error) {
        toastr.error("Update Error:", error);
      } else {
        analytics.track("accountant Edited");
        Router.go('accountant', {
          _id: Router.current().params._id
        });
      }
    }
  }
});

Template.accountantFields.events({
  'change select[name="mobileCarrier"]': function(event, template) {
    var mobileNumber = $('input[name="contactNumber"]').val();
    var mobileCarrier = event.target.value;
    var smsEmail = "";
    smsEmail = mobileNumber + mobileCarrier;
    $('input[name="smsAddress"]').val(smsEmail);
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
            else {
              toastr.success('Successfully updated.');
            }
          })
        }
      })
    })
  }
})

Template.accountantEdit.events({
  'click #cancel': function(event, template) {
    event.preventDefault();
    Router.go("dispatcher", {
      _id: this.dispatcherProfile._id
    });
  }
});


Template.accountantFields.rendered = function() {
  $('#spinner').hide();
  $('.progress').hide();
  Meteor.typeahead.inject('.typeahead');
  $('.note-editor .note-toolbar .note-insert').remove();
};

var locLoaded=false;

Template.accountantFields.helpers({
  "customImagePreviewUrl": function() {
    return Meteor.users.findOne({_id: Meteor.userId()}).imgURL;
  },
  locationData : function(){
    locLoaded = true;
    return this.dispatcherProfile.location;
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
    var buyerInvited = Buyers.findOne({userId: Meteor.user().invitedBy});
    if(buyerInvited.companyName)
      return buyerInvited.companyName;
    return;
  },
  buyerCompanyUrl: function() {
    var buyerInvited = Buyers.findOne({userId: Meteor.user().invitedBy});
    if(buyerInvited.companyUrl)
      return buyerInvited.companyUrl;
    return;
  },
  "uploadedFiles": function(){
      return S3.collection.find();
  }
});

Template.accountantLocationMap.onRendered(function() {
  this.autorun(() => {
    if(GoogleMaps.loaded()) {
      $('#loc').geocomplete({country: 'us', details: '#accountantLocationDetails'}).bind('geocode:result', function(event, result) {
        $('#accountantLocationDetails').show();
      })
    }
  })
});

Template.accountantLocationMap.helpers({
  locationData : function(){
    locLoaded = true;
    if(this.dispatcherProfile)
      return this.accountantProfile.location;
    return;
  }
})