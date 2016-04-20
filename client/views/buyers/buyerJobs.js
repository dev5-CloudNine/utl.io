Template.buyerJobs.helpers({
	buyerJob: function () {
		var buyerId = Buyers.findOne({
			_id: Router.current().params._id
		}).userId;
		return Jobs.find({
			userId: buyerId
		}, {
			sort: {
				createdAt: -1
			}
		});
	}
});