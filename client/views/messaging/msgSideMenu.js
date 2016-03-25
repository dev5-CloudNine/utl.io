Template.msgSideMenu.helpers({
  inboxCount: function() {
    return Messages.find({
    	$and:[{recipient: Meteor.userId()},{ "parent" : { "$exists" : false }}]
    }).fetch().length;
  }
});