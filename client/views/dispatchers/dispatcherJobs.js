Template.dispatcherJobs.helpers({
	dispatcherJob: function () {
		var dispatcherId = Dispatchers.findOne({
			_id: Router.current().params._id
		}).userId;
		return Jobs.find({
			userId: dispatcherId
		},
		{
			sort: {
				createdAt: -1
			}
		})
	}
});