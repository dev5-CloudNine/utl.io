Template.header.events({
  'click .navbar-nav a': function(event, template) {
    var targetButton = document.getElementsByClassName('navbar-toggle')[0];
    var _this = $(event.currentTarget); 

    if (window.innerWidth < 768) {
      if( !_this.hasClass('box-user-option') ){
         targetButton.click()
      }
    }
  }
});

Template.header.helpers({
  corpProfile: function() {
    return Corporates.findOne({
      companyName: Meteor.user().companyName
    })
  }
});

Template.headerUserMenu.helpers({
  profile: function() {
    return Profiles.findOne({
      userId: Meteor.userId()
    });
  },
  buyer: function() {
    return Buyers.findOne({
      userId: Meteor.userId()
    });
  },
  bNotificationCount: function() {
    return Notifications.find({$and: [{buyerId: Meteor.userId()}, {side: 'buyer'}, {read: false}]}).count();
  },
  pNotificationCount: function() {
    return Notifications.find({$and: [{providerId: Meteor.userId()}, {side: 'provider'}, {read: false}]}).count();
  },
  adminNotificationCount: function() {
    return Notifications.find({$and: [{adminSide: true}, {adminRead: false}]}).count();
  },
  msgs: function() {
    var count = Messages.find({
      $and:[{recipient: Meteor.userId()},{ "read" :false }]
    }).fetch().length;
    return count>0?true:false;
  },
  msgList: function() {
    return Messages.find({
      $and:[{recipient: Meteor.userId()},{ "read" :false }]
    }, {limit: 5,sort: { date: -1 }});   
  },
  corporate: function() {
    return Corporates.findOne({
      userId: Meteor.userId()
    });
  },
  customImageUrl: function(){
    var avatarID = Buyers.findOne({userId: this.userId}).avatar;
    if(!avatarID)
      return;
    var imgURL = Meteor.absoluteUrl()+"cfs/files/images/" + avatarID +"/"+Images.findOne({_id:avatarID}).original.name;
    console.log(imgURL);
    return imgURL;
  }
});

Template.headerUserMenu.events({
  'click #signOut': function(event, template) {
    //Meteor.logout();
    Meteor.logout(function(err) {
      Router.go("/");
    });
  },
  'click .navbar-nav a': function(event, template) {
    var targetButton = document.getElementsByClassName('navbar-toggle')[0];
    var _this = $(event.currentTarget); 

    if (window.innerWidth < 768) {
      if( !_this.hasClass('box-user-option') ){
         targetButton.click()
      }
    }
  },
  'click #userProfile': function(event, template) {
    event.preventDefault();
    Modal.show('userProfile');
  },
  'click #notification_link': function(event, template) {
    console.log(event);
    $("#notification_container").fadeToggle(300);
    return false;
  }
});

Template.headerUserMenu.onRendered(function(){
  this.$('.dropdown-toggle').dropdown();
  Meteor.subscribe("messages");
});
