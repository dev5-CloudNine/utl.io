Template.jobSmall.helpers({
	shortDesc: function() {
		var jobDetails = Jobs.findOne({
			_id: this._id
		});
		return jobDetails.htmlDescription.split('.')[0] + '.';
	},
	acceptedProvider: function() {
		var uId = Meteor.userId();
		var jobs=Jobs.findOne({_id: this._id});
		if(jobs && jobs.applications) {
			for(var i=0;i<jobs.applications.length;i++){
				if(jobs.applications[i].userId == uId && jobs.applications[i].app_status == 'accepted') {
					return true;
				}
			}
		}
		return false;
	},
	applied: function() {
		var applications = Jobs.findOne({_id: this._id}).applications;
	    if(applications) {
			for(var i = 0; i < applications.length; i++) {
			if(applications[i].userId == Meteor.userId())
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
	dispatcherData: function() {
		return Dispatchers.findOne({userId: this.userId});
	},
	postedByDispatcher: function() {
		return Roles.userIsInRole(this.userId, ['dispatcher']);
	},
	postedByBuyer: function() {
		return Roles.userIsInRole(this.userId, ['buyer']);
	},
	applicationsCount: function() {
		if(this.applications) {
			return this.applications.length;
		}
		return 0;
	},
	invoiceId: function() {
		Meteor.subscribe('jobInvoice', this._id)
		var invoiceDetails = Invoices.findOne({jobId: this._id});
		if(invoiceDetails)
			return invoiceDetails.invoiceId;
		return;
	},
	fav : function() {
		return Meteor.users.findOne({$and:[{_id:Meteor.userId()},{favoriteJobs: {$in: [this._id]}}]})?true:false;
	},
	'jobPostedBuyer': function() {
	    var jobDetails = Jobs.findOne({_id: this._id});
	    if(jobDetails && jobDetails.userId == Meteor.userId())
	      return true;
	    return false;
	},
	reviewedProvider: function() {
		return Reviews.findOne({$and: [{reviewedJobId: this._id}, {buyerId: Meteor.userId()}, {reviewedBy: 'buyer'}]})? true : false;
	},
	reviewedBuyer: function() {
		return Reviews.findOne({$and: [{reviewedJobId: this._id}, {providerId: Meteor.userId()}, {reviewedBy: 'provider'}]})? true: false;
	},
	appStatusLabel: function() {
		if(this.status == 'deactivated') {
			return 'label-deactivated'
		}
		if(this.applicationStatus == 'assigned') 
			return 'label-assigned';
		else if(this.applicationStatus == 'frozen')
			return 'label-frozen';
		else if(this.applicationStatus == 'open')
			return 'label-open';
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
	},
	tasksTSCompleted: function() {
		var jobId = this._id;
		Meteor.subscribe('timeSheet', this._id);
		var tasksClosed = Tasks.find({$and:[{jobID:jobId},{state:{$ne:'Completed'}}]}).count();
		if(tasksClosed) {
			return false;
		}
		var timeSheetsLogs = TimeSheet.findOne({jobID: jobId});
		if(!timeSheetsLogs || !timeSheetsLogs.logs) {
			return false
		}
		if(timeSheetsLogs && timeSheetsLogs.logs) {
			if(timeSheetsLogs.logs.length <= 0) {
				return false;
			}
		}
		return true;
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
		})
	},
	'click button.declineAssignment': function(event, template) {
		var jobId = this._id;
		var userId = Meteor.userId();
		Meteor.call('declineAssignment', jobId, userId, function(error) {
			if(error) {
				toastr.error('Failed to decline the assignment.');
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
			}
		});
	},
	'click button.rejectAssignment': function(event, template) {
		var jobId = this._id;
		Meteor.call('rejectAssignment', jobId, function(error) {
			if(error) {
				toastr.error('Failed to reject assignment. Please try again.');
			}
		});
	},
	'click button.archiveJob': function(event, template) {
		var jobId = this._id;
		Meteor.call('archiveJob', jobId, Meteor.userId(), function(error) {
			if(error) {
				toastr.error('Failed to archive the job. Please try again.');
			} else {
				toastr.success('Successfully archived the job.');
			}
		});
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
