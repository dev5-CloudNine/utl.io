Template.providerRoutedJobs.helpers({
	providerRoutedJobs: function() {
		return Jobs.find({$and: [{"selectedProvider": Meteor.userId()}, {"routed": true}, {"applicationStatus": "frozen"}]}).fetch()
	}
})