Template.mails.events({
    'click tr.msg': function(event, template) {
        if ($(event.target).closest('.checker span').length > 0) {
            return;
        } else {
            var obj = $(event.currentTarget);
            var id = obj.data('id');
            Meteor.call("markRead",id);
            Router.go("/dashboard/msg" + id);
        }
        event.stopPropagation();
    }
});


Template.mails.helpers({
    msgList: function() {

        var msgList = [];
        var type = Router.current().params.tab.substr(6);
        if (type == 'sent') {
            Messages.find({
            	$and:[{sender: Meteor.userId()},{ "parent" : { "$exists" : false }}]
            }, 
            {
              sort: { date: -1 }
            }).map(function(ele) {
                ele.username = Meteor.users.findOne({ '_id': ele.recipient }).emails[0].address;
                ele.date = moment(new Date(ele.date)).format('LL');
                msgList.push(ele);
            });
        } else {
            Messages.find({
            	$and:[{recipient: Meteor.userId()}]
            }, 
            {
              sort: { date: -1 }
            }).map(function(ele) {
                ele.username = Meteor.users.findOne({ '_id': ele.sender }).emails[0].address;
                ele.date = moment(new Date(ele.date)).format('LLLL');
                msgList.push(ele);
            });
        }
        return msgList;
    },
    type : function() {
        return Router.current().params.tab.substr(6);
    }

});
