Template.dashboard.helpers({
	jobs: function() {
		return Jobs.find({
			userId: Meteor.userId()
		}, {
			sort: {
				createdAt: -1
			}
		});
	},
	buyerProfile: function() {
		return Buyers.find({
			userId: Meteor.userId()
		});
		console.log(buyerProfile);
	}
});