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
    var count = 0;
    var providerDetails = Profiles.findOne({userId: Meteor.userId()})
    var appliedJobs = providerDetails.appliedJobs;
    var routedJobs = providerDetails.routedJobs;
    var assignedJobs = providerDetails.assignedJobs;
    var completedJobs = providerDetails.completedJobs;
    var paymentPendingJobs = providerDetails.paymentPendingJobs;
    var paidJobs = providerDetails.paidJobs;
    var archivedJobs = providerDetails.archivedJobs;
    if(appliedJobs)
      count += appliedJobs.length;
    if (routedJobs)
      count += routedJobs.length;
    if (assignedJobs)
      count += assignedJobs.length;
    if (completedJobs)
      count += completedJobs.length;
    if(paymentPendingJobs)
      count += paymentPendingJobs.length;
    if(paidJobs)
      count += paidJobs.length;
    if(archivedJobs)
      count += archivedJobs.length;
    return count;
  },
  appliedJobsCount: function() {
    var count = 0;
    var appliedJobs = Profiles.findOne({userId: Meteor.userId()}).appliedJobs;
    if(appliedJobs) {
      for(var i = 0; i < appliedJobs.length; i++)
        count++;
      return count;
    }
    return count;
  },
  routedJobsCount: function() {
    var routedJobs = Profiles.findOne({userId: Meteor.userId()}).routedJobs;
    var count = 0;
    if(routedJobs) {
      for(var i = 0; i < routedJobs.length; i++)
        count++;
      return count;
    }
    return count;
  },
  assignedJobsCount: function() {
    var count = 0;
    var assignedJobs = Profiles.findOne({userId: Meteor.userId()}).assignedJobs;
    if(assignedJobs) {
      for(var i = 0; i < assignedJobs.length; i++)
        count++;
      return count;
    }
    return count;
  },
  completedJobsCount: function() {
    var count = 0;
    var completedJobs = Profiles.findOne({userId: Meteor.userId()}).completedJobs;
    if(completedJobs) {
      for(var i = 0; i < completedJobs.length; i++)
        count++;
      return count;
    }
    return count;
  },
  proPaymentJobsCount: function() {
    var count = 0;
    var paymentPendingJobs = Profiles.findOne({userId: Meteor.userId()}).paymentPendingJobs;
    if(paymentPendingJobs) {
      for(var i = 0; i < paymentPendingJobs.length; i++)
        count++;
      return count;
    }
    return count;
  },
  proPaidJobsCount: function() {
    var paidJobs = Profiles.findOne({userId: Meteor.userId()}).paidJobs;
    if(paidJobs) {
      return paidJobs.length;
    }
    return 0;
  },
  postedJobCount: function() {
    return Jobs.find({userId: Meteor.userId()}).count();
  },
  buyerRoutedCount: function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {routed: true}]}).count();
  },
  buyerAssignedCount: function() {
    return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}]}).count();
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

Template.headerUserMenu.onRendered(function(){
  this.$('.dropdown-toggle').dropdown();
  Meteor.subscribe('allJobs')
  var jobCategories = Profiles.findOne({userId: Meteor.userId()}).industryTypes;
  Meteor.subscribe('recommendedJobs', jobCategories);
  Meteor.subscribe('notifications', Meteor.userId());
  Meteor.subscribe('notificationsJobs', Meteor.userId());
});