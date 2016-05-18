Template.jobSmall.helpers({
	shortDesc: function() {
		var jobDetails = Jobs.findOne({
			_id: this._id
		});
		return jobDetails.htmlDescription.split('.')[0] + '.';
	},
	acceptedProvider: function() {
		var uId = Meteor.userId();
		// if(this.display == false) {
		// 	return;
		// }
		var jobs=Jobs.findOne({_id: this._id}).applications;

		for(var i=0;i<jobs.length;i++){
			if(jobs[i].userId == uId && jobs[i].app_status == 'accepted') {
				return true;
			}
		}
		return false;
	},
	assignedProfile: function() {
		return Profiles.findOne({userId: this.assignedProvider});
	},
	routedProvider: function() {
		return Profiles.findOne({userId: this.selectedProvider});
	},
	'buyerData': function() {
	    return Buyers.findOne({userId: this.userId});
	},
	applicationsCount: function() {
		var count = 0;
		if(!this.applications) {
			return 0
		}
		else {
			this.applications.forEach(function(app) {
				count++
			});
			return count;
		}
	},
	fav : function() {
		return Meteor.users.findOne({$and:[{_id:Meteor.userId()},{favoriteJobs: {$in: [this._id]}}]})?true:false;
	},
	'jobPostedBuyer': function() {
	    var jobDetails = Jobs.findOne(this._id);
	    if(jobDetails.userId == Meteor.userId())
	      return true;
	    else
	      return false;
	}
})
Template.jobSmall.events({
	'click .favInactive': function(event, template) {
		var jobId = this._id;
		Meteor.call('addToFav', jobId, "job", function(error) {
			if(error) {
				console.log('Failed to add to favorites');
			}
			else {
				$(event.target).removeClass('favInactive');
				$(event.target).addClass('favActive');
			}
		});
	},
	'click .favActive': function(event, template) {
		var jobId = this._id;
		Meteor.call('removeFromFav', jobId, "job", function(error) {
			if(error) {
				console.log('Failed to add to favorites');
			}
			else {
				$(event.target).removeClass('favActive');
				$(event.target).addClass('favInactive');
			}
		});
	},
	'click button.confirmAssignment': function(event, template) {
		event.preventDefault();
		var buyerId = this.userId;
		var jobId = this._id;
		Meteor.call('confirmAssignment', jobId, buyerId, function(error) {
			if(error) {
				toastr.error('Failed to confirm assignment.');
			}
			else {
				toastr.success('The assignment has been confirmed.');
			}
		})
	},
	'click button.declineAssignment': function(event, template) {
		console.log(this);
		var jobId = this._id;
		var userId = Meteor.userId();
		Meteor.call('declineAssignment', jobId, userId, function(error) {
			if(error) {
				toastr.error('Failed to decline the assignment.');
			} else {
				toastr.success('Successfully declined the assignment.');
			}
		});
	},
	'click button.submitAssignment': function(event, template) {
		event.preventDefault();
		var jobId = this._id;
		Meteor.call('submitAssignment', jobId, function(error) {
			if(error) {
				toastr.error('Failed to submit assignment. Please try again.');
			} else {
				toastr.success('Successfully submitted the assignment.');
			}
		});
	},
	'click button.approveAssignment': function(event, template) {
		event.preventDefault();
		var jobId = this._id;
		var providerId = this.assignedProvider;
		console.log(providerId);
		Meteor.call('approveAssignment', jobId, providerId, function(error) {
			if(error) {
				toastr.error('Failed to approve assignment. Please try again.');
			} else {
				toastr.success('Approved assignment Successfully');
			}
		});
	},
	'click button.rejectAssignment': function(event, template) {
		var jobId = this._id;
		Meteor.call('rejectAssignment', jobId, function(error) {
			if(error) {
				toastr.error('Failed to reject assignment. Please try again.');
			} else {
				toastr.success('Rejected assignment successfully');
			}
		});
	}
})