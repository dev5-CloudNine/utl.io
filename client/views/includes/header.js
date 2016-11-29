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
  },
  providerAllCount: function() {
    var allJobs = Profiles.findOne({userId: Meteor.userId()}).allJobs;
    if(allJobs)
      return allJobs.length;
    return 0;
  },
  appliedJobsCount: function() {
    var appliedJobs = Profiles.findOne({userId: Meteor.userId()}).appliedJobs;
    if(appliedJobs) {
      return appliedJobs.length;
    }
    return 0;
  },
  buyerRoutedCount: function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {routed: true}, {applicationStatus: 'frozen'}, {status: 'active'}]}).count();
  },
  routedJobsCount: function() {
    var routedJobs = Profiles.findOne({userId: Meteor.userId()}).routedJobs;
    if(routedJobs) {
      return routedJobs.length;
    }
    return 0;
  },
  assignedJobsCount: function() {
    var assignedJobs = Profiles.findOne({userId: Meteor.userId()}).assignedJobs;
    if(assignedJobs) {
      return assignedJobs.length;
    }
    return 0;
  },
  proPaidJobsCount: function() {
    var paidJobs = Profiles.findOne({userId: Meteor.userId()}).paidJobs;
    if(paidJobs) {
      return paidJobs.length;
    }
    return 0;
  },
  proDeactivatedCount: function() {
    var deactivatedJobs = Profiles.findOne({userId: Meteor.userId()}).deactivatedJobs;
    if(deactivatedJobs) {
      return deactivatedJobs.length;
    }
    return 0;
  },
  postedJobCount: function() {
    return Jobs.find({userId: Meteor.userId()}).count();
  },
  buyerInvitedCount: function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {invited: true}]}).count();
  },
  buyerAssignedCount: function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}, {status: 'active'}]}).count();
  },
  buyerCompletedCount: function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'completed'}]}).count();
  },
  buyerPaymentPendingCount: function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'pending_payment'}]}).count();
  },
  buyerPaidCount: function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}]}).count();
  },
  deactivatedCount: function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {status: 'deactivated'}]}).count();
  },
  buyerOpenCount: function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'}]}).count();
  },
  dwollaId: function() {
    var dwollaId = Wallet.findOne({userId: Meteor.userId()}) && Wallet.findOne({userId: Meteor.userId()}).dwollaId;
    if(dwollaId)
      return true;
    return false;
  },
  invitedJobsCount: function() {
    var invJobIds = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
    if(invJobIds) {
      return invJobIds.length;
    }
    return 0;
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

Template.headerUserMenu.rendered = function() {
  this.$('.dropdown-toggle').dropdown();
  Meteor.subscribe('allJobs')
  if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
    var jobCategories = Profiles.findOne({userId: Meteor.userId()}).industryTypes;
    Meteor.subscribe('recommendedJobs', jobCategories);
  }
  Meteor.subscribe('notifications', Meteor.userId());
  Meteor.subscribe('notificationsJobs', Meteor.userId());
}