Template.buyerJobs.helpers({
	buyerJob: function () {
		return Jobs.find({
			userId: this.userId
		}, {
			sort: {
				createdAt: -1
			}
		});
	}
});