Template.corpTeam.helpers({
	corpProviders: function() {
		return Profiles.find({
			companyName: this.companyName
		});
	},
	corpManagers: function() {
		return Buyers.find({
			companyName: this.companyName
		});
	}
})