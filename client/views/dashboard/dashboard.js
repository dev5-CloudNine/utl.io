var buyerAllUsers = function() {
	var allUsers = [];
	if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
		allUsers = allUsers.concat(Profiles.find({status: 'active'}).fetch());
		allUsers = allUsers.concat(Dispatchers.find({invitedBy: Meteor.userId()}).fetch());
		allUsers = allUsers.concat(Accountants.find({invitedBy: Meteor.userId()}).fetch());
	}
	if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
		allUsers = allUsers.push(Buyers.findOne({userId: Meteor.user().invitedBy}));
		allUsers = allUsers.concat(Profiles.find({status: 'active'}).fetch());
		allUsers = allUsers.concat(Dispatchers.find({$and: [{invitedBy: Meteor.userId()}, {userId: {$ne: Meteor.userId()}}]}).fetch());
		allUsers = allUsers.concat(Accountants.find({invitedBy: Meteor.userId()}).fetch());
	}
	return allUsers;
}

var buyerAllUserOptions = {
	order: [[0, 'desc']],
	paging: false,
	columns: [
		{
			title: 'ID',
			data: function(user) {
				return user.readableID;
			}
		},
		{
			title: 'Name',
			data: function(user) {
				var currentRoute = Router.current().route._path;
				var userLink = '<a href="' + currentRoute + '/?userId=' + user.userId + '">' + user.firstName + ' ' + user.lastName +'</a>'
				return userLink
			}
		}
	]
}

Template.dashboard.helpers({
	buyerAllUsers: function() {
		return buyerAllUsers;
	},
	buyerAllUserOptions: buyerAllUserOptions,
	buyerAssignedJobs: function() {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}, {$or: [{assignmentStatus: 'confirmed'}, {assignmentStatus: 'submitted'}, {assignmentStatus: 'rejected'}]}, {status: 'active'}]});
	},
	providerAssignedJobs: function() {
		var assigned = [];
		var assignedJobs = [];
		var providerDetails = Profiles.findOne({userId: Meteor.userId()});
		if((providerDetails.assignedJobs && providerDetails.assignedJobs.length > 0) && (providerDetails.pendingApproval && providerDetails.pendingApproval.length > 0))
			assigned = assigned.concat(providerDetails.assignedJobs, providerDetails.pendingApproval);
		if(!providerDetails.pendingApproval || providerDetails.pendingApproval.length <= 0)
			assigned = assigned.concat(providerDetails.assignedJobs);
		if((!providerDetails.assignedJobs || providerDetails.assignedJobs.length <=0) && (providerDetails.pendingApproval && providerDetails.pendingApproval.length > 0))
			assigned = assigned.concat(providerDetails.pendingApproval);
		for(var i = assigned.length - 1; i >= 0; i--) {
			assignedJobs.push(Jobs.findOne({_id: assigned[i]}));
		}
		return assignedJobs;
	},
	jobSelected: function() {
		var jobId = Router.current().params.query.jobId
		if(jobId)
			return true;
		return false;
	},
	userSelected: function() {
		var userId = Router.current().params.query.userId
		if(userId)
			return true;
		return false;
	},
	selectedJobDetails: function() {
		return Jobs.findOne({_id: Router.current().params.query.jobId});
	},
	createChart: function() {
		var highCharts = require('highcharts/highstock');
		var aDay = new Date().getUTCMonth();
		var lastYear = new Date();
		var monthsArray = [];
		lastYear.setUTCMonth(lastYear.getUTCMonth() - 12);
		var buyersLastYear = Buyers.find({createdAt: {$gte: lastYear}}).fetch();
		var providersLastYear = Profiles.find({createdAt: {$gte: lastYear}}).fetch();
		var jobsLastYear = Jobs.find({createdAt: {$gte: lastYear}}).fetch();
		var paidJobsLastYear = Jobs.find({$and: [{createdAt: {$gte: lastYear}}, {applicationStatus: 'paid'}]}).fetch();
		var monthsBuyerCount = function(diff) {
			var count = 0;
			var today = new Date().getUTCMonth();
			buyersLastYear.forEach(function(buyer) {
				if(buyer.createdAt.getUTCMonth() == today - diff) {
					count++;
				}
			});
			if(count == 0)
				return 0;
			else
				return count;
		}
		var monthsProviderCount = function(diff) {
			var count = 0;
			var today = new Date().getUTCMonth();
			providersLastYear.forEach(function(provider) {
				if(provider.createdAt.getUTCMonth() == today - diff) {
					count ++;
				}
			});
			if(count == 0)
				return 0;
			else
				return count;
		}
		var monthsPostedCount = function(diff) {
			var count = 0;
			var today = new Date().getUTCMonth();
			jobsLastYear.forEach(function(job) {
				if(job.createdAt.getUTCMonth() == today - diff) {
					count ++
				}
			});
			if(count == 0)
				return 0;
			else
				return count;
		}
		var monthsPaidCount = function(diff) {
			var count = 0;
			var today = new Date().getUTCMonth();
			paidJobsLastYear.forEach(function(paidJob) {
				var paidNotification = Notifications.findOne({$and: [{jobId: paidJob._id}, {notificationType: 'approveAssignment'}]});
				if(paidNotification && paidNotification.timeStamp.getUTCMonth() == today - diff) {
					count ++;
				}
			});
			if(count == 0)
				return 0;
			else
				return count;
		}
		var yearPostedCountArray = [];
		var yearBuyerCountArray = [];
		var yearProviderCountArray = [];
		var yearPaidCountArray = [];
		for(var i = 11; i >=0; i--) {
			yearPostedCountArray.push(monthsPostedCount(i));
			yearBuyerCountArray.push(monthsBuyerCount(i));
			yearPaidCountArray.push(monthsPaidCount(i));
			yearProviderCountArray.push(monthsProviderCount(i));
		}
		if(aDay == 0) {
			monthsArray = ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January'];
		}
		if(aDay == 1) {
			monthsArray = ['March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February'];
		}
		if(aDay == 2) {
			monthsArray = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
		}
		if(aDay == 3) {
			monthsArray = ['May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'];
		}
		if(aDay == 4) {
			monthsArray = ['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'];
		}
		if(aDay == 5) {
			monthsArray = ['July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June'];
		}
		if(aDay == 6) {
			monthsArray = ['August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July'];
		}
		if(aDay == 7) {
			monthsArray = ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
		}
		if(aDay == 8) {
			monthsArray = ['October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];
		}
		if(aDay == 9) {
			monthsArray = ['November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'];
		}
		if(aDay == 10) {
			monthsArray = ['December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];
		}
		if(aDay == 11) {
			monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		}
		Meteor.defer(function() {
			highCharts.chart('adminChart', {
				chart: {
					type: 'column'
				},
				title: {
		            text: 'Monthly Activity Report'
		        },
				xAxis: {
					categories: monthsArray,
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
					data: yearBuyerCountArray
				}, {
					name: 'Providers',
					data: yearProviderCountArray
				}, {
					name: 'Jobs Posted',
					data: yearPostedCountArray
				}, {
					name: 'Jobs Completed',
					data: yearPaidCountArray
				}]
			})
		})
	},
	sampleChart: function() {
		var buyersAndProviders = require('highcharts/highstock');
		var daysArray = [];
		var aDay = new Date();
		var lastWeek = new Date();
		lastWeek.setUTCDate(lastWeek.getUTCDate() - 7);
		var buyersLastWeek = Buyers.find({createdAt: {$gte: lastWeek}}).fetch();
		var providersLastWeek = Profiles.find({createdAt: {$gte: lastWeek}}).fetch();
		var todaysBuyersCount = function(diff) {
			var count = 0;
			var today = new Date().getUTCDate();
			buyersLastWeek.forEach(function(buyer) {
				if(buyer.createdAt.getUTCDate() == today - diff) {
					count ++;
				}
			});
			if(count == 0)
				return 0;
			else
				return count;
		}
		var todaysProviderCount = function(diff) {
			var count = 0;
			var today = new Date().getUTCDate();
			providersLastWeek.forEach(function(provider) {
				if(provider.createdAt.getUTCDate() == today - diff) {
					count ++;
				}
			});
			if(count == 0)
				return 0;
			else
				return count;
		}
		buyersCountArray = [todaysBuyersCount(6), todaysBuyersCount(5), todaysBuyersCount(4), todaysBuyersCount(3), todaysBuyersCount(2), todaysBuyersCount(1), todaysBuyersCount(0)];
		providersCountArray = [todaysProviderCount(6), todaysProviderCount(5), todaysProviderCount(4), todaysProviderCount(3), todaysProviderCount(2), todaysProviderCount(1), todaysProviderCount(0)];
		if(aDay.getUTCDay() == 0) {
			daysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday (Today)'];
		}
		if(aDay.getUTCDay() == 1) {
			daysArray = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday (Today)'];
		}
		if(aDay.getUTCDay() == 2) {
			daysArray = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday (Today)'];
		}
		if(aDay.getUTCDay() == 3) {
			daysArray = ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday (Today)'];
		}
		if(aDay.getUTCDay() == 4) {
			daysArray = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday (Today)'];
		}
		if(aDay.getUTCDay() == 5) {
			daysArray = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday (Today)'];
		}
		if(aDay.getUTCDay() == 6) {
			daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday (Today)'];
		}
		Meteor.defer(function() {
			buyersAndProviders.chart('sampleChart', {
		        chart: {
		            type: 'column',
		        },
		        title: {
		            text: 'New user profiles (Weekly).'
		        },
		        subtitle: {
		        	text: 'Total profiles created today: ' + parseInt(todaysProviderCount(0) + todaysBuyersCount(0)),
		            style: {
		                position: 'absolute',
		                right: '0px',
		                bottom: '10px'
		            }
		        },
		        xAxis: {
		            categories: daysArray
		        },
		        yAxis: {
		            title: {
		                text: 'Number of users'
		            },
		            allowDecimals: false
		        },
		        plotOptions: {
		            area: {
		                fillOpacity: 0.5
		            }
		        },
		        series: [{
		            name: 'Buyers',
		            data: buyersCountArray
		        }, {
		            name: 'Providers',
		            data: providersCountArray
		        }]
		    });
		})
	},
	lastWeekJobs: function() {
		var jobChart = require('highcharts/highstock');
		var daysArray = [];
		var aDay = new Date();
		var lastWeek = new Date();
		lastWeek.setUTCDate(lastWeek.getUTCDate() - 7);
		var jobsLastWeek = Jobs.find({createdAt: {$gte: lastWeek}}).fetch();
		var todaysPostedJobCount = function(diff) {
			var count = 0;
			var today = new Date().getUTCDate();
			jobsLastWeek.forEach(function(job) {
				if(job.createdAt.getUTCDate() == today - diff) {
					count ++;
				}
			});
			if(count == 0)
				return 0;
			else
				return count;
		}
		var todaysOpenJobCount = function(diff) {
			var count = 0;
			var today = new Date().getUTCDate();
			jobsLastWeek.forEach(function(job) {
				if(job.createdAt.getUTCDate() == today - diff && job.applicationStatus == 'open') {
					count ++;
				}
			});
			if(count == 0)
				return 0;
			else
				return count;
		}
		var todaysAssignedJobCount = function(diff) {
			var count = 0;
			var today = new Date().getUTCDate();
			Notifications.find({notificationType: 'confirmAssignment'}).fetch().forEach(function(assignedJobNot) {
				if(assignedJobNot.timeStamp.getUTCDate() == today - diff) {
					count ++;
				}
			})
			if(count == 0)
				return 0;
			else
				return count;
		}
		var todayCompletedJobCount = function(diff) {
			var count = 0;
			var today = new Date().getUTCDate();
			Notifications.find({notificationType: 'approveAssignment'}).fetch().forEach(function(approvedJobNot) {
				if(approvedJobNot.timeStamp.getUTCDate() == today - diff) {
					count ++;
				}
			})
			if(count == 0)
				return 0;
			else
				return count;
		}
		var postedJobsCount = [];
		var openJobsCount = [];
		var assignedJobsCount = [];
		var completedJobsCount = [];
		for(var i = 6; i >=0; i--) {
			postedJobsCount.push(todaysPostedJobCount(i));
			openJobsCount.push(todaysOpenJobCount(i));
			assignedJobsCount.push(todaysAssignedJobCount(i));
			completedJobsCount.push(todayCompletedJobCount(i));
		}
		if(aDay.getUTCDay() == 0) {
			daysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday (Today)'];
		}
		if(aDay.getUTCDay() == 1) {
			daysArray = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday (Today)'];
		}
		if(aDay.getUTCDay() == 2) {
			daysArray = ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday (Today)'];
		}
		if(aDay.getUTCDay() == 3) {
			daysArray = ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday (Today)'];
		}
		if(aDay.getUTCDay() == 4) {
			daysArray = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday (Today)'];
		}
		if(aDay.getUTCDay() == 5) {
			daysArray = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday (Today)'];
		}
		if(aDay.getUTCDay() == 6) {
			daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday (Today)'];
		}
		Meteor.defer(function() {
			jobChart.chart('weekJobs', {
		        chart: {
		            type: 'areaspline',
		        },
		        title: {
		            text: 'Job activity report (Weekly).'
		        },
		        subtitle: {
		            style: {
		                position: 'absolute',
		                right: '0px',
		                bottom: '10px'
		            }
		        },
		        xAxis: {
		            categories: daysArray
		        },
		        yAxis: {
		            title: {
		                text: 'Number of Jobs'
		            },
		            allowDecimals: false
		        },
		        plotOptions: {
		            area: {
		                fillOpacity: 0.5
		            }
		        },
		        series: [{
		        	name: 'Posted',
		        	data: postedJobsCount
		        }, {
		            name: 'Open',
		            data: openJobsCount
		        }, {
		            name: 'Assigned',
		            data: assignedJobsCount
		        }, {
		        	name: 'Completed',
		        	data: completedJobsCount
		        }]
		    });
		})
	},
	tryoutchart: function() {
		var tryout = require('highcharts/highstock');
		Meteor.defer(function() {
			var seriesOptions = [],
		        seriesCounter = 0,
		        names = ['open', 'assigned', 'completed'];

		    /**
		     * Create the chart when all data is loaded
		     * @returns {undefined}
		     */
		    function createChart() {

		        tryout.stockChart('tryOut', {

		            rangeSelector: {
		                selected: 2,
		                allButtonsEnabled: true,
		                inputDateFormat: '%d-%m-%y',
		                inputEditDateFormat: '%d-%m-%y',
		                inputEnabled: true
		            },

		            yAxis: {
		                labels: {
		                    formatter: function () {
		                        return (this.value > 0 ? ' + ' : '') + this.value;
		                    }
		                },
		                plotLines: [{
		                    value: 0,
		                    width: 2,
		                    color: 'silver'
		                }]
		            },

		            plotOptions: {
		                series: {
		                    showInNavigator: true
		                }
		            },

		            tooltip: {
		                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
		                split: true
		            },

		            series: seriesOptions
		        }, function(chart) {
		        	setTimeout(function() {
		        		$('input.highcharts-range-selector').datepicker();
		        	}, 0);
		        });
		    }

		    $.each(names, function (i, name) {
	            seriesOptions[i] = {
	                name: name,
	                data: (function() {
	                	var time = new Date().getTime();
	                	var data = [];
	                	for(var i = 0; i < 999; i++) {
	                		data.push([time + i * 1000, Jobs.find({applicationStatus: name}).count()])
	                	}
	                	return data;
	                }())
	            };

	            // As we're loading the data asynchronously, we don't know what order it will arrive. So
	            // we keep a counter and create the chart when all the data is loaded.
	            seriesCounter += 1;

	            if (seriesCounter === names.length) {
	                createChart();
	            }
		    });
		});
	}
});

Template.dashboard.onCreated(function() {
	this.autorun(function() {
		var jobId = Router.current().params.query.jobId;
		if(!jobId)
			return;
		return Meteor.subscribe('documentComments', jobId);
	})
})

Template.dashboard.rendered = function () {
	$('.datatable_wrapper > .dataTables_wrapper > .row > .col-sm-6:first-child').remove();
	Meteor.subscribe('userWallet', Meteor.userId())
	this.$('.rateit').rateit({'readonly': true});
	this.$('.highcharts-range-selector').datepicker();
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