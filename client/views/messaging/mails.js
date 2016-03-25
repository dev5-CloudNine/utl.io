Template.mails.events({
    'click tr.msg': function(event, template) {
        if ($(event.target).closest('.checker span').length > 0) {
            return;
        } else {
            var obj = $(event.currentTarget);
            Router.go("/dashboard/msg" + obj.data('id'));
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
            }).map(function(ele) {
                ele.username = Meteor.users.findOne({ '_id': ele.sender }).emails[0].address;
                ele.date = moment(new Date(ele.date)).format('LL');
                msgList.push(ele);
            });
        } else {
            Messages.find({
            	$and:[{recipient: Meteor.userId()},{ "parent" : { "$exists" : false }}]
            }).map(function(ele) {
                ele.username = Meteor.users.findOne({ '_id': ele.sender }).emails[0].address;
                ele.date = moment(new Date(ele.date)).format('LL');
                msgList.push(ele);
            });
        }
        return msgList;
    }
});
