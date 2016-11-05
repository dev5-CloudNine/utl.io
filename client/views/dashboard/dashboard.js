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
	},
	buyersCount: function() {
		return Buyers.find().count();
	},
	providersCount: function() {
		return Profiles.find().count();
	},
	createChart: function() {
		var highCharts = require('highcharts/highstock');
		console.log(highCharts);
		var providers = Profiles.find().count();
		var buyers = Buyers.find().count();
		var usersData = [{
			y: buyers,
			name: "Buyers"
		}, {
			y: providers,
			name: "Providers"
		}]
		Meteor.defer(function() {
			highCharts.chart('adminChart', {
				chart: {
					type: 'column'
				},
				title: {
		            text: 'Monthly Activity Report'
		        },
				xAxis: {
					categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
					crosshair: true
				},
				plotOptions: {
					column: {
						pointPadding: 0.2,
						borderWidth: 0
					}
				},
				tooltip: {
		            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		                '<td style="padding:0"><b>{point.y} </b></td></tr>',
		            footerFormat: '</table>',
		            shared: true,
		            useHTML: true
		        },
				series: [{
					name: 'Buyers',
					data: [25, 15, 32, 24, 56, 12, 18, 62, 15, 25, 46, 38]
				}, {
					name: 'Providers',
					data: [32, 89, 26, 84, 27, 58, 92, 128, 82, 98, 57, 64]
				}, {
					name: 'Jobs Posted',
					data: [58, 25, 68, 24, 84, 18, 52, 68, 32, 84, 59, 81]
				}, {
					name: 'Jobs Completed',
					data: [54, 21, 65, 20, 80, 18, 50, 65, 30, 80, 55, 80]
				}]
			})
		})
	},
	sampleChart: function() {
		var highCharts = require('highcharts/highstock');
		Meteor.defer(function() {
			highCharts.chart('sampleChart', {
		        chart: {
		            type: 'area',
		            inverted: true
		        },
		        title: {
		            text: 'Average user registration during this week.'
		        },
		        subtitle: {
		            style: {
		                position: 'absolute',
		                right: '0px',
		                bottom: '10px'
		            }
		        },
		        legend: {
		            layout: 'vertical',
		            align: 'right',
		            verticalAlign: 'top',
		            x: -150,
		            y: 100,
		            floating: true,
		            borderWidth: 1,
		            backgroundColor: (highCharts.theme && highCharts.theme.legendBackgroundColor) || '#FFFFFF'
		        },
		        xAxis: {
		            categories: [
		                'Monday',
		                'Tuesday',
		                'Wednesday',
		                'Thursday',
		                'Friday',
		                'Saturday',
		                'Sunday'
		            ]
		        },
		        yAxis: {
		            title: {
		                text: 'Number of users'
		            },
		            labels: {
		                formatter: function () {
		                    return this.value;
		                }
		            },
		            min: 0
		        },
		        plotOptions: {
		            area: {
		                fillOpacity: 0.5
		            }
		        },
		        series: [{
		            name: 'Buyers',
		            data: [3, 4, 3, 5, 4, 10, 12]
		        }, {
		            name: 'Providers',
		            data: [1, 3, 4, 3, 3, 5, 4]
		        }]
		    });
		})
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