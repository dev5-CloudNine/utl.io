Template.jobSmall.helpers({
	shortDesc: function() {
		var jobDetails = Jobs.findOne({
			_id: this._id
		});
		return jobDetails.htmlDescription.split('.')[0] + '.';
	},
	acceptedProvider: function() {
		var uId = Meteor.userId();
		var userId = Profiles.findOne({userId: uId})._id;
		if(this.display == false) {
			return;
		}
		if(Jobs.findOne({$and:[{'_id': this._id}, {'applications.userId':userId},{'applications.app_status':'accepted'}]})) {
			return true
		}
		else {
			return false
		}
	},
	assignedProfile: function() {
		return Profiles.findOne({userId: this.assignedProvider});
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
				console.log('Added to favorites');
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
				console.log('Added to favorites');
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
	}
})