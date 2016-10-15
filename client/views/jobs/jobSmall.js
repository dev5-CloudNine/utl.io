Template.jobSmall.helpers({
	shortDesc: function() {
		var jobDetails = Jobs.findOne({
			_id: this._id
		});
		return jobDetails.htmlDescription.split('.')[0] + '.';
	},
	acceptedProvider: function() {
		var uId = Meteor.userId();
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
		if(this.applications) {
			return this.applications.length;
		}
		return 0;
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
	},
	reviewedProvider: function() {
		return Reviews.findOne({$and: [{reviewedJobId: this._id}, {buyerId: Meteor.userId()}, {reviewedBy: 'buyer'}]})? true : false;
	},
	reviewedBuyer: function() {
		return Reviews.findOne({$and: [{reviewedJobId: this._id}, {providerId: Meteor.userId()}, {reviewedBy: 'provider'}]})? true: false;
	},
	appStatusLabel: function() {
		if(this.applicationStatus == 'assigned') 
			return 'label-assigned';
		else if(this.applicationStatus == 'deactivated')
			return 'label-deactivated';
		else if(this.applicationStatus == 'frozen')
			return 'label-frozen';
		else if(this.applicationStatus == 'open')
			return 'label-open';
		else if(this.applicationStatus == 'pending_payment')
			return 'label-pending';
		else if(this.applicationStatus == 'completed') 
			return 'label-completed';
		else if(this.applicationStatus == 'paid')
			return 'label-paid';
	},
	postedTime: function() {
		return moment(this.createdAt).fromNow();
	},
	approvePaymentTime: function() {
		var approvePaymentTime = Notifications.findOne({$and: [{jobId: this._id}, {notificationType: 'approvePayment'}]}).timeStamp;
		return moment(approvePaymentTime).format('LLLL');
	},
	providerReviewDetails: function() {		
    	return Reviews.findOne({$and: [{reviewedJobId: this._id}, {buyerId: Meteor.userId()}, {reviewedBy: 'buyer'}]});
	},
	buyerReviewDetails: function() {
		return Reviews.findOne({$and: [{reviewedJobId: this._id}, {providerId: Meteor.userId()}, {reviewedBy: 'provider'}]});
	}
});

Template.jobSmall.rendered = function() {
	this.$('.rateit').rateit();
	this.ratingPoints = new ReactiveVar(null);
}

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
		//check for task status
		var tasksClosed = Tasks.find({$and:[{jobID:jobId},{state:{$ne:'Completed'}}]}).count();
		if(tasksClosed) {
			toastr.error('Please close all the tasks before submitting the assignment');
			return;
		}
		
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
	},
	'click button.requestPayment': function(event, template) {
		var jobId = this._id;
		Meteor.call('requestPayment', jobId, function(error) {
			if(error) {
				toastr.error('Failed to request paymet. Pleast try again.');
			} else {
				toastr.success('Payment requested successfully.');
			}
		})
	},
	'click button.approvePayment': function(event, template) {
		var jobId = this._id;
		Meteor.call('approvePayment', jobId, function(error) {
			if(error) {
				toastr.error('Failed to approve payment. Please try again.');
			} else {
				toastr.success('Payment approved successfully.');
			}
		})
	},
	'rated .rateit': function(event, instance) {
		var rating = $(event.target).rateit('value');
		instance.ratingPoints.set(rating);
	},
	'submit #reviewProvider': function(event, template) {
		event.preventDefault();
		var providerId = this.assignedProvider;
		var buyerId = this.userId;
		var jobId = this._id;
		var timeReviewed = new Date();
		var ratedPoints = Template.instance().ratingPoints.get();
		var reviewMessage = "";
		$('textarea[name="reviewMessage"]').each(function() {
			reviewMessage += $(this).val();
		})
		Meteor.call('reviewProvider', providerId, buyerId, jobId, timeReviewed, ratedPoints, reviewMessage, function(error) {
			if(error) {
				toastr.error('Failed to submit review. Please try again.');
			} else {
				toastr.success('Submitted the review successfully.');
			}
		})
	},
	'submit #reviewBuyer': function(event, template) {
		event.preventDefault();
		var providerId = this.assignedProvider;
		var buyerId = this.userId;
		var jobId = this._id;
		var timeReviewed = new Date();
		var ratedPoints = Template.instance().ratingPoints.get();
		var reviewMessage = "";
		$('textarea[name="reviewMessage"]').each(function() {
			reviewMessage += $(this).val();
		})
		Meteor.call('reviewBuyer', providerId, buyerId, jobId, timeReviewed, ratedPoints, reviewMessage, function(error) {
			if(error) {
				toastr.error('Failed to submit review. Please try again.');
			} else {
				toastr.success('Submitted the review successfully.');
			}
		})
	}
})