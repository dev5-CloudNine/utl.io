var allJobs = function() {
	return Jobs.find().fetch();
}

var adminOptionsObject = {
	columns: [
		{
			title: 'Readable ID',
			data: function(jobDetails) {
				return jobDetails.readableID;
			}
		},
		{
			title: 'Job Name',
			data: function(jobDetails) {
				var jobUrl = '<a href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a>';
				return jobUrl;
			}
		},
		{
			title: 'Posted By',
			data: function(jobDetails) {
				var buyerDetails;
				var buyerUrl;
				if(Roles.userIsInRole(jobDetails.userId, ['dispatcher'])) {
					buyerDetails = Dispatchers.findOne({userId: jobDetails.userId});
					buyerUrl = '<a href="/dispatchers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a>';
				} else {
					buyerDetails = Buyers.findOne({userId: jobDetails.userId});
					buyerUrl = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a>';
				}
				return buyerUrl;
			}
		},
		{
			title: 'Posted On',
			data: function(jobDetails) {
				return moment(jobDetails.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a");
			}
		},
		{
			title: 'Job Status',
			data: function(jobDetails) {
				return jobDetails.applicationStatus;
			}
		}
	]
}

Template.allJobs.helpers({
	allJobs: function() {
		return allJobs;
	},
	adminOptionsObject: adminOptionsObject
})