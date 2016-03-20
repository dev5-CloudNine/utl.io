Template.mails.events({
  'click tr.msg': function(event, template) {
  	var obj = $(event.currentTarget);
  	Router.go("/buyerDashboard/msg+id");
    console.log(obj.find('td')[3]);
  }
 });


Template.mails.helpers({
  msgList: function() {
  	var msgList = [];

    Messages.find({
      sender: Meteor.userId()
    }).map(function(ele){
    	 ele.username = Meteor.users.findOne({'_id':ele.sender}).emails[0].address;

    	msgList.push(ele);
    });
    return msgList;
  }
});