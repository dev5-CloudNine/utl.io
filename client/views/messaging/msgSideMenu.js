Template.msgSideMenu.helpers({
  inboxCount: function() {
    return Messages.find({
    	$and:[{recipient: Meteor.userId()},{ "read" :false }]
    }).fetch().length;
  }
});