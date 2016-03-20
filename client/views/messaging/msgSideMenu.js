Template.msgSideMenu.helpers({
  msgCount: function() {
    return Messages.find({
      sender: Meteor.userId()
    }).fetch().length;
  }
});