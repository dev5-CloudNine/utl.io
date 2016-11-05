Template.dashboard.helpers({
	jobs: function() {
		return Jobs.find({
			userId: Meteor.userId()
		}, {
			sort: {
				createdAt: -1
			}
		});
	},
	// recommendedJobsCount: function() {
	// 	var jobCategories = Profiles.findOne({userId: Meteor.userId()}).industryTypes;
	// 	Meteor.subscribe('recommendedJobs', jobCategories);
	// 	return Jobs.find({$and: [{applicationStatus: 'open'}, {jobSubCategory: {$in: jobCategories}}]}).count()
	// },
	buyerCompletedJobsCount: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}]}).count();
	},
	ongoingBuyerJobs: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}]}).fetch();
	},
	buyerProfile: function() {
		return Buyers.find({
			userId: Meteor.userId()
		});
	},
	providerProfile: function() {
		return Profiles.findOne({userId: Meteor.userId()});
	},
	buyerDetails: function() {
		return Buyers.findOne({userId: Meteor.userId()});
	},
	favJobs: function() {
		var favJobsIds = [];
		var favJobsArray = [];
		var userDetails = Meteor.user();
		userDetails.favoriteJobs.forEach(function (favjobs) {
			favJobsIds.push(favjobs);
		});
		return Jobs.find({_id: {$in:favJobsIds}},{sort: {createdAt: -1}});
	},
	appliedJobs: function() {
		var appliedJobIds = [];
		var appliedJobsArray = [];
		Profiles.findOne({userId: Meteor.userId()}).appliedJobs.forEach(function(jobId) {
			appliedJobIds.push(jobId);
		});
		return Jobs.find({_id: {$in:appliedJobIds}},{sort: {createdAt: -1}});
	},
	ongoingJobs: function() {
		return Jobs.find({$and: [{assignedProvider: Meteor.userId()}, {applicationStatus: 'assigned'}]}).fetch();
	},
	providerRoutedJobs: function() {
		return Jobs.find({$and: [{"selectedProvider": Meteor.userId()}, {"routed": true}, {"applicationStatus": "frozen"}]}).fetch()
	},
	buyerRoutedJobs: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {routed: true}]}, {sort: {createdAt: -1}});
	},
	favUsers: function() {
		var favUserIds = [];
		var favUserArray = [];
		var userDetails = Meteor.user();
		userDetails.favoriteUsers.forEach(function(favusers) {
			favUserIds.push(favusers);
		});
		favUserIds.forEach(function(id) {
			favUserArray.push(Profiles.findOne({
				_id: id
			}));
		});
		return favUserArray;
	},
	favBuyers: function() {
		var favBuyerIds = [];
		var favBuyerArray = [];
		var userDetails = Meteor.user();
		userDetails.favoriteBuyers.forEach(function(favBuyer) {
			favBuyerIds.push(favBuyer);
		});
		favBuyerIds.forEach(function(id) {
			favBuyerArray.push(Buyers.findOne({
				_id: id
			}));
		});
		return favBuyerArray;
	},
	buyerJobsCount: function() {
		return Jobs.find({userId: Meteor.userId()}).count();
	},
	providerJobsCount: function() {
		var count = 0;
		var jobCount = Profiles.findOne({userId: Meteor.userId()}).appliedJobs;
		if(jobCount) {
			for(var i = 0; i < jobCount.length; i++)
				count++;
			return count;
		}
		return count;
	},
	providerCompletedJobs: function() {
		return Jobs.find({$and: [{assignedProvider: Meteor.userId()}, {applicationStatus: 'done'}, {assignmentStatus: 'approved'}]}).fetch();
	},
	buyerCompletedJobs: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'done'}]}).fetch();
	},
	providerCompletedJobsCount: function() {
		var paidJobs = Profiles.findOne({userId: Meteor.userId()}).paidJobs;
		if(paidJobs)
			return paidJobs.length;
		return 0;
	},
	accountBalance: function() {
		return Wallet.findOne({userId: Meteor.userId()}).accountBalance;
	},
	amountSpent: function() {
		return Wallet.findOne({userId: Meteor.userId()}).amountSpent;
	},
	amountEarned: function() {
		return Wallet.findOne({userId: Meteor.userId()}).amountEarned;
	},
	providerRatingPoints: function() {
		var totalPoints = 0;
		var count = 0;
		var reviews = Reviews.find({$and: [{'providerId': Meteor.userId()}, {'reviewedBy': 'buyer'}]}).fetch();
		if(reviews) {
			for(var i = 0; i < reviews.length; i++) {
				totalPoints += reviews[i].pointsRated;
				count++;
			}
			return totalPoints/count;
		}
		return 0;
	},
	providerReviewCount: function() {
		var reviews = Reviews.find({$and: [{'providerId': Meteor.userId()}, {'reviewedBy': 'buyer'}]});
		if(reviews)
			return reviews.count();
		return 0;
	},
	buyerRatingPoints: function () {
		var totalPoints = 0;
		var count = 0;
		var reviews = Reviews.find({$and: [{'buyerId': Meteor.userId()}, {'reviewedBy': 'provider'}]}).fetch();
		if(reviews) {
			for(var i = 0; i < reviews.length; i++) {
				totalPoints += reviews[i].pointsRated;
				count++;
			}
			return totalPoints/count;
		}
		return 0;
	},
	buyerReviewCount: function() {
		var reviews = Reviews.find({$and: [{'buyerId': Meteor.userId()}, {'reviewedBy': 'provider'}]});
		if(reviews)
			return reviews.count();
		return 0;
	},
	myProfile: function() {
		if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'corporate-manager'])) {
			return Buyers.findOne({userId: Meteor.userId()});
		}
		if(Roles.userIsInRole(Meteor.userId(), ['provider', 'corporate-provider'])) {
			return Profiles.findOne({userId: Meteor.userId()});
		}
	}
});

Template.dashboard.rendered = function () {
	this.$('.rateit').rateit({'readonly': true});	
};

Template.providerCalendar.onRendered(function() {
	$('#provider-jobs-calendar').fullCalendar({
		events(start, end, timezone, callback) {
			var jobsData = Jobs.find({$and: [{assignedProvider: Meteor.userId(), applicationStatus: 'assigned'}]}).fetch();
			jobsData.map(function(job) {
				if(job.serviceschedule == 'exactdate') {
					job.start = job.exactdate
				} else if(job.serviceschedule == 'betweendates') {
					job.start = job.startdate;
					job.end = job.enddate + 1;
				}
			})
			if(jobsData) {
				callback(jobsData)
			}
		},
		displayEventTime: false,
		eventRender(event, element) {
			if(event.serviceschedule == 'exactdate') {
				element.find('.fc-content').html(
					'<p>' + event.readableID + '</p>' + '<strong><a href="/jobs/' + event._id + '">'  + event.title + '</a></strong>' + '<p>' + event.exacttime + '</p>'
				)
			} else if(event.serviceschedule == 'betweendates') {
				element.find('.fc-content').html(
					'<p>' + event.readableID + '</p>' + '<strong><a href="/jobs/' + event._id + '">'  + event.title + '</a></strong>' + '<p>' + event.starttime + ' to ' + event.endtime + '</p>'
				)
			}
		}
	});
	Tracker.autorun(function() {
		Jobs.find({$and: [{assignedProvider: Meteor.userId(), applicationStatus: 'assigned'}]}).fetch();
		$('#provider-jobs-calendar').fullCalendar('refetchEvents');
	})
})

Template.buyerCalendar.onRendered(function() {
	$('#buyer-jobs-calendar').fullCalendar({
		events(start, end, timezone, callback) {
			var jobsData = Jobs.find({$and: [{userId: Meteor.userId(), applicationStatus: 'assigned'}]}).fetch();
			jobsData.map(function(job) {
				if(job.serviceschedule == 'exactdate') {
					job.start = job.exactdate
				} else if(job.serviceschedule == 'betweendates') {
					job.start = job.startdate;
					job.end = job.enddate + 1;
				}
			})
			if(jobsData) {
				callback(jobsData)
			}
		},
		displayEventTime: false,
		eventRender(event, element) {
			if(event.serviceschedule == 'exactdate') {
				element.find('.fc-content').html(
					'<p>' + event.readableID + '</p>' + '<strong><a href="/jobs/' + event._id + '">'  + event.title + '</a></strong>' + '<p>' + event.exacttime + '</p>'
				)
			} else if(event.serviceschedule == 'betweendates') {
				element.find('.fc-content').html(
					'<p>' + event.readableID + '</p>' + '<strong><a href="/jobs/' + event._id + '">'  + event.title + '</a></strong>' + '<p>' + event.starttime + ' to ' + event.endtime + '</p>'
				)
			}
		}
	});
	Tracker.autorun(function() {
		Jobs.find({$and: [{userId: Meteor.userId(), applicationStatus: 'assigned'}]}).fetch();
		$('#buyer-jobs-calendar').fullCalendar('refetchEvents');
	})
})

var isPast = function(date) {
	var today = moment().format();
	return moment(today).isAfter(date);
}

Template.myGoogleMap.onRendered(function() {
	this.autorun(() => {
		if(GoogleMaps.loaded()) {
			$('#place1').geocomplete({
				country: 'us',
				map: $('#myMap'),
				mapOptions: {
					center: {lat: 40.7128, lng: -100.0059}, 
					scrollwheel: true,
					zoom: 4
				},
				markerOptions: {
					draggable: true
				}
			})
		}
	})
})