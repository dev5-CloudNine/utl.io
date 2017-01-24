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
  dispatcher: function() {
    return Dispatchers.findOne({userId: Meteor.userId()});
  },
  accountant: function() {
    return Accountants.findOne({userId: Meteor.userId()});
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
    return Meteor.users.findOne({_id: Meteor.userId()}).imgURL;
  },
  unreadMessageCount: function() {
    return Messages.find({recepient: Meteor.userId()}).count();
  },
  initials: function() {
    if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
      var userDetails = Buyers.findOne({userId: Meteor.userId()});
      return userDetails.firstName.charAt(0) + userDetails.lastName.charAt(0);
    }
    if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
      var userDetails = Profiles.findOne({userId: Meteor.userId()});
      return userDetails.firstName.charAt(0) + userDetails.lastName.charAt(0);
    }
    if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
      var userDetails = Accountants.findOne({userId: Meteor.userId()});
      return userDetails.firstName.charAt(0) + userDetails.lastName.charAt(0);
    }
    if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
      var userDetails = Dispatchers.findOne({userId: Meteor.userId()});
      return userDetails.firstName.charAt(0) + userDetails.lastName.charAt(0);
    }
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
  'click #notification_link': function(event, template) {
    console.log(event);
    $("#notification_container").fadeToggle(300);
    return false;
  }
});

Template.header.rendered = function() {
  return this.$('.dropdown-toggle').dropdown();
}

Template.headerUserMenu.rendered = function() {
  this.$('.dropdown-toggle').dropdown();
  Meteor.subscribe('notifications', Meteor.userId());
  return Meteor.subscribe('notificationsJobs', Meteor.userId());
}