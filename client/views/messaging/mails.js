Template.mails.events({
    'click tr.msg': function(event, template) {
        if ($(event.target).closest('.checker span').length > 0) {
            return;
        } else {
            var obj = $(event.currentTarget);
            var id = obj.data('id');
            Meteor.call("markMessageRead",id);
            Router.go("/mailbox/msg" + id);
        }
        event.stopPropagation();
    }
});

var msgList = function() {
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
            ele.date = moment(new Date(ele.date)).format('LLLL');
            msgList.push(ele);
        });
    } else {
        Messages.find({$and:[{recipient: Meteor.userId()}]}, {sort: { date: -1 }}).map(function(ele) {
            ele.username = Meteor.users.findOne({ '_id': ele.sender }).emails[0].address;
            ele.date = moment(new Date(ele.date)).format('LLLL');
            msgList.push(ele);
        });
    }
    return msgList;
}

var msgListOptionsObject = {
    columns: [
        {
            title: 'From',
            data: function(mail) {
                var userName;
                if(Roles.userIsInRole(mail.sender, ['provider'])) {
                    var profile = Profiles.findOne({userId: mail.sender});
                    userName = profile.firstName + ' ' + profile.lastName;
                }
                if(Roles.userIsInRole(mail.sender, ['buyer', 'dispatcher'])) {
                    var profile = Buyers.findOne({userId: mail.sender});
                    userName = profile.firstName + ' ' + profile.lastName;
                }
                if(Roles.userIsInRole(mail.sender, ['admin'])) {
                    userName = 'Administrator'
                }
                return userName;
            }
        },
        {
            title: 'To',
            data: function(mail) {
                var userName;
                if(Roles.userIsInRole(mail.recipient, ['provider'])) {
                    var profile = Profiles.findOne({userId: mail.recipient});
                    userName = profile.firstName + ' ' + profile.lastName;
                }
                if(Roles.userIsInRole(mail.recipient, ['buyer', 'dispatcher'])) {
                    var profile = Buyers.findOne({userId: mail.recipient});
                    userName = profile.firstName + ' ' + profile.lastName;
                }
                if(Roles.userIsInRole(mail.recipient, ['admin'])) {
                    userName = 'Administrator'
                }
                return userName;
            }
        },
        {
            title: 'Subject',
            data: function(mail) {
                return mail.subject;
            }
        },
        {
            title: 'Date/Time',
            data: function(mail) {
                return mail.date;
            }
        }
    ],
    createdRow: function(row, data, dataIndex) {
        $(row).addClass('msg');
        $(row).attr('data-id', data._id);
        if(data.read) {
            $(row).addClass('unread');
        } else {
            $(row).addClass('read');
        }
    }
}


Template.mails.helpers({
    type : function() {
        return Router.current().params.tab.substr(6);
    },
    msgList: function() {
        return msgList;
    },
    msgListOptionsObject: msgListOptionsObject
});

Template.mails.onRendered(function() {
    this.autorun(function() {
        return Meteor.subscribe('messages', Meteor.userId());
    })
})
