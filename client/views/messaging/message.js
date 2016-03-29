
Template.message.events({
  'click a.delete-msg': function (event, template) {
    var id = $(event.target).parent().closest('.message-options').data("id");
    Meteor.call('deleteMsg',id,function(err,res){
      if(err) {
        toastr.error('Failed to delete the message');
      } else {
        toastr.success('Message has been deleted');
      }
    });
  },
  'click a.reply': function(event, template) {
    event.preventDefault();
    var id = $(event.target).parent().closest('.message-options').data("id");
    Router.go("/dashboard/newrep" + id);
    event.stopPropagation();
  },
  'click a.forward': function(event, template) {
    event.preventDefault();
    var id = $(event.target).parent().closest('.message-options').data("id");
    Router.go("/dashboard/newfwd" + id);
    event.stopPropagation();
  }
});

Template.message.helpers({
  message: function() {
    var msgID = Router.current().params.tab.substr(3);
    //return Messages.find({'_id':msgID});
    var msgList = [];

    Meteor.call("markRead",msgID);

    var ids = [];
    ids.push(msgID);
    ids = ids.concat(Messages.findOne({'_id':msgID}).chain);

    Messages.find({'_id':{$in:ids}}, 
    {
      sort: { date: -1 }
    }).map(function(ele){
       ele.username = Meteor.users.findOne({'_id':ele.sender}).emails[0].address;
       ele.date = moment(new Date(ele.date)).format('LLLL');
       msgList.push(ele);
    });
    return msgList;

  },
  parentID: function() {
    return Router.current().params.tab.substr(3);
  }
});