var allJobs = function() {
	return Jobs.find().fetch();
}

var allJobsObject = {
	lengthMenu: [40, 80, 160, 320],
	pageLength: 40,
	order: [[0, 'desc']],
	columns: [
		{
			title: 'ID',
			data: function(jobDetails) {
				return jobDetails.readableID;
			},
			width: '10%'
		},
		{
			title: 'Job Name',
			data: function(jobDetails) {
				var jobUrl = '<a href="/jobs/' + jobDetails._id + '">' + jobDetails.title + '</a><br><small><i>' + moment(jobDetails.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a") + '</i></small>';
				return jobUrl;
			}
		},
		{
			title: 'Budget (USD)',
			data: function(jobDetails) {
				return jobDetails.your_cost;
			},
			width: '12%'
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
			},
			width: '20%'
		},
		{
			title: 'Service Location',
			data: function(jobDetails) {
				if(jobDetails.servicelocation == 'Remote Job')
					return 'Remote Job';
				else
					return jobDetails.fullLocation.locality + ', ' + jobDetails.fullLocation.state + ', ' + jobDetails.fullLocation.zip;
			},
			width: '20%'
		},
		{
			title: 'Job Status',
			data: function(jobDetails) {
				if(jobDetails.status == 'deactivated') {
					return 'Deactivated';
				}
				return jobDetails.applicationStatus;
			},
			width: '10%'
		}
	]
}

Template.allJobs.helpers({
	allJobs: function() {
		return allJobs;
	},
	adminOptionsObject: allJobsObject
})