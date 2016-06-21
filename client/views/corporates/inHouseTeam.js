Template.corpTeam.helpers({
	corpProviders: function() {
		var corpProIds = [];
		var corporateProviders = [];
		var corpProviderUsers = Meteor.users.find({$and: [{companyName: this.companyName}, {roles: 'corporate-provider'}]}).fetch();
		corpProviderUsers.forEach(function(corpProvider) {
			corpProIds.push(corpProvider._id);
		});
		for(var i = 0; i < corpProIds.length; i++) {
			corporateProviders.push(Profiles.findOne({userId: corpProIds[i]}));
		}
		return (corporateProviders);
	},
	corpManagers: function() {
		var corpManagerIds = [];
		var corporateManagers = [];
		var corpManagerUsers = Meteor.users.find({$and: [{companyName: this.companyName}, {roles: 'corporate-manager'}]}).fetch();
		corpManagerUsers.forEach(function(corpManager) {
			corpManagerIds.push(corpManager._id);
		});
		for(var i = 0; i < corpManagerIds.length; i++) {
			corporateManagers.push(Buyers.findOne({userId: corpManagerIds[i]}));
		}
		return (corporateManagers);
	}
})