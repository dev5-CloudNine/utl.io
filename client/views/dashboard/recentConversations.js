Template.recentConversations.helpers({
	messageNotifications: function() {
		var userChats = UserChats.find({participants: {$in: [Meteor.userId()]}}).fetch();
		var jobChannels = Channels.find({participants: {$in: [Meteor.userId()]}}).fetch();
		var allChats = [];
		for(var i = 0; i < userChats.length; i++) {
			allChats.push(userChats[i]);
		}
		for(var i = 0; i < jobChannels.length; i++) {
			allChats.push(jobChannels[i]);
		}
		return _.sortBy(allChats, function(chat) {return -chat.updatedAt});
	},
	channelJob: function(jobId) {
		return Jobs.findOne({_id: jobId});
	},
	assignedProviderDetails: function(jobId) {
		var assignedProvider = Jobs.findOne({_id: jobId}).assignedProvider;
		return Profiles.findOne({userId: assignedProvider});
	},
	unreadJobMessages: function(channelId) {
		var messages = Channels.findOne({_id: channelId}).messages;
		var unreadMessages = 0;
		for(var i = 0; i < messages.length; i++) {
			if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
				if(messages[i].buyerRead == false) {
					unreadMessages ++;
				}
			}
			if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
				if(messages[i].providerRead == false) {
					unreadMessages ++;
				}
			}
			if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
				if(messages[i].dispatcherRead == false) {
					unreadMessages ++;
				}
			}
			if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
				if(messages[i].accountantRead == false) {
					unreadMessages ++;
				}
			}
		}
		if(unreadMessages > 0)
			return unreadMessages;
		return false;
	},
	unreadMessages: function(chatId) {
		var messages = UserChats.findOne({_id: chatId}).messages;
		var unreadMessages = 0;
		for(var i = 0; i < messages.length; i++) {
			if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
				if(messages[i].buyerRead == false) {
					unreadMessages ++;
				}
			}
			if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
				if(messages[i].providerRead == false) {
					unreadMessages ++;
				}
			}
			if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
				if(messages[i].dispatcherRead == false) {
					unreadMessages ++;
				}
			}
			if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
				if(messages[i].accountantRead == false) {
					unreadMessages ++;
				}
			}
		}
		if(unreadMessages > 0)
			return unreadMessages;
		return false;
	},
	otherUser: function(participants) {
		var participant;
		for(var i = 0; i < participants.length; i++) {
			if(participants[i] !== Meteor.userId()) {
				participant = participants[i];
				break;
			}
		}
		if(Roles.userIsInRole(participant, ['provider']))
			return Profiles.findOne({userId: participant});
		if(Roles.userIsInRole(participant, ['dispatcher']))
			return Dispatchers.findOne({userId: participant});
		if(Roles.userIsInRole(participant, ['accountant']))
			return Accountants.findOne({userId: participant});
		if(Roles.userIsInRole(participant, ['buyer']))
			return Buyers.findOne({userId: participant});
	},
	userRole: function() {
		if(Roles.userIsInRole(this.userId, ['provider'])) {
			return 'provider'
		}
		if(Roles.userIsInRole(this.userId, ['dispatcher'])) {
			return 'dispatcher'
		}
		if(Roles.userIsInRole(this.userId, ['buyer'])) {
			return 'buyer'
		}
		if(Roles.userIsInRole(this.userId, ['accountant'])) {
			return 'accountant'
		}
		if(Roles.userIsInRole(this.userId, ['admin'])) {
			return 'admin'
		}
	},
	userImgUrl: function(userId) {
		var user = Users.findOne({_id: userId});
		if(user.imgURL)
			return user.imgURL;
		else
			return '/images/avatar.png';
	},
	jobPostedBuyer: function(buyerId) {
		if(Roles.userIsInRole(buyerId, ['buyer']))
			return Buyers.findOne({userId: buyerId});
		if(Roles.userIsInRole(buyerId, ['dispatcher']))
			return Dispatchers.findOne({userId: buyerId});
	}
})