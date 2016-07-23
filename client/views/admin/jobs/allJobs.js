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
				var buyerDetails = Buyers.findOne({userId: jobDetails.userId});
				var buyerUrl = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.name + '</a>';
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