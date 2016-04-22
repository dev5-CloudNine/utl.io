Template.corpTeam.helpers({
	corpProviders: function() {
		console.log(this)
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