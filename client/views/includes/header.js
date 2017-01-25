Template.headerUserMenu.helpers({
  profile: function() {
    if(Roles.userIsInRole(Meteor.userId(), ['provider']))
      return Profiles.findOne({userId: Meteor.userId()});
    if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
      return Buyers.findOne({userId: Meteor.userId()});
    if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
      return Dispatchers.findOne({userId: Meteor.userId()});
    if(Roles.userIsInRole(Meteor.userId(), ['accountant']))
      return Accountants.findOne({userId: Meteor.userId()});
    if(Roles.userIsInRole(Meteor.userId(), ['admin']))
      return;
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
    Meteor.logout(function(err) {
      Router.go("/");
    });
  },
  'click #notification_link': function(event, template) {
    $("#notification_container").fadeToggle(300);
    return false;
  },
  'click .authUrl' : function(){
    Meteor.call('authUrl', Meteor.userId(), function (error, result) {
      if(error){
        console.log(error);
        return;
      }
      window.location = result;
    });
  }
});

Template.header.rendered = function() {
  $('.dropdown-toggle').dropdown();
}

Template.headerUserMenu.rendered = function() {
  $('.dropdown-toggle').dropdown();
  Meteor.subscribe('notifications', Meteor.userId());
  return Meteor.subscribe('notificationsJobs', Meteor.userId());
}