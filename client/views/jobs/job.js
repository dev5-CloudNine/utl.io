Template.job.events({
  'click #job-deactivate': function(event, template) {
    event.preventDefault();
    Modal.show('jobDeactivate',template.data);
  },
  'click .applyJob': function(event, template) {
  	var jobId = this._id;
  	Meteor.call('applyForThisJob', jobId, function(error) {
  		if(error) {
  			toastr.error(error.message, 'Error');
  		}
  		else {
  			toastr.success("You've successfully applied for this job!");
  		}
  	})
  }
});

Template.job.helpers({
  'hasLabel': function() {
    return this.jobType || this.featured;
  },
  'appliedByCount': function() {
  	var count = 0;
  	Jobs.findOne(this._id).appliedBy.forEach(function(uId) {
  		count++;
  	});
  	return count;
  },
  'counterOfferCount': function() {
    var count = 0;
    return count;
  },
  'appliedProviders': function() {
    var providersApplied = [];
    var providerIds = [];
    Jobs.findOne(this._id).appliedBy.forEach(function(providerId) {
      providerIds.push(providerId);
    });
    providerIds.forEach(function(pId) {
      providersApplied.push(Profiles.findOne({userId: pId}));
    });
    return providersApplied;
  },
  'jobPostedBuyer': function() {
    var jobDetails = Jobs.findOne(this._id);
    if(jobDetails.userId == Meteor.userId())
      return true;
    else
      return false;
  }
});

