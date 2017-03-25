
// Template.message.events({
//   'click a.delete-msg': function (event, template) {
//     var id = $(event.target).parent().closest('.message-options').data("id");
//     Meteor.call('deleteMsg',id,function(err,res){
//       if(err) {
//         toastr.error('Failed to delete the message');
//       } else {
//         toastr.success('Message has been deleted');
//       }
//     });
//   },
//   'click a.reply': function(event, template) {
//     event.preventDefault();
//     var id = $(event.target).parent().closest('.message-options').data("id");
//     Router.go("/mailbox/newrep" + id);
//     event.stopPropagation();
//   },
//   'click a.forward': function(event, template) {
//     event.preventDefault();
//     var id = $(event.target).parent().closest('.message-options').data("id");
//     Router.go("/mailbox/newfwd" + id);
//     event.stopPropagation();
//   }
// });

// Template.message.helpers({
//   message: function() {
//     var msgID = Router.current().params.tab.substr(3);
//     //return Messages.find({'_id':msgID});
//     var msgList = [];

//     Meteor.call("markRead",msgID);

//     var ids = [];
//     ids.push(msgID);
//     var msgObj = Messages.findOne({'_id':msgID});
//     if(msgObj) {
//       ids = ids.concat(msgObj.chain);
//     }

//     Messages.find({'_id':{$in:ids}}, 
//     {
//       sort: { date: -1 }
//     }).map(function(ele){
//       var fName, lName
//       if(Roles.userIsInRole(ele.sender, ['provider', 'corporate-provider'])) {
//         var profile = Profiles.findOne({userId: ele.sender});
//         fName = profile.firstName;
//         lName = profile.lastName;
//       }
//       if(Roles.userIsInRole(ele.sender, ['buyer', 'corporate-manager'])) {
//         var profile = Buyers.findOne({userId: ele.sender});
//         fName = profile.firstName;
//         lName = profile.lastName;      
//       }
//       if(Roles.userIsInRole(ele.sender, ['admin'])) {
//         fName = 'Support';
//         lName = 'desk';      
//       }
//       ele.firstName = fName;
//       ele.lastName = lName
//       ele.username = Meteor.users.findOne({'_id':ele.sender}).emails[0].address;
//       ele.date = moment(new Date(ele.date)).format('LLLL');
//       msgList.push(ele);
//     });
//     return msgList;
//   },
//   parentID: function() {
//     return Router.current().params.tab.substr(3);
//   }
// });

Template.message.helpers({
  userName: function(sender) {
    if(Roles.userIsInRole(sender, ['buyer'])) {
      var buyerDetails = Buyers.findOne({userId: sender});
      return buyerDetails.firstName + buyerDetails.lastName;
    }
    if(Roles.userIsInRole(sender, ['provider'])) {
      var providerDetails = Profiles.findOne({userId: sender});
      return providerDetails.firstName + providerDetails.lastName;
    }
    if(Roles.userIsInRole(sender, ['admin'])) {
      return 'Support Desk'
    }
  },
  messageTime: function(time) {
    return moment(time).fromNow();
  },
  senderImgUrl: function(userId) {
    var user = Users.findOne({_id: userId});
    if(user && user.imgURL)
      return user.imgURL;
    return false;
  }
})