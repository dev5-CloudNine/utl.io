UI.registerHelper("formatDate", function(timestamp) {
	if(timestamp)
		return moment(timestamp).format('LLLL');
});

UI.registerHelper('formatServiceSchedule', function(timestamp) {
	if(timestamp)
		return moment(timestamp).format('DD/MM/YYYY');
})

UI.registerHelper('formatDOB', function(timestamp) {
	if(timestamp)
		return moment(timestamp).format('YYYY-MM-DD');
});

UI.registerHelper("currentUserDisplayName", function() {
	return getUserName(Meteor.user());
});

UI.registerHelper('blendedTotalHours', function(firstHours, nextHours) {
	return (firstHours + nextHours);
});

UI.registerHelper("currentUserEmail", function() {
	return getUserEmail(Meteor.user());
});

UI.registerHelper("resizeImageUrl", function(imageUrl, height, width) {
	if(imageUrl)
      return imageUrl + "-/resize/" + height + "x" + width + "/";
});

UI.registerHelper('toUpperCase', function(stringToConvert) {
	return stringToConvert.toUpperCase();
});

UI.registerHelper('myProfile', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['buyer'])) {
		return Buyers.findOne({userId: Meteor.userId()});
	}
	if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
		return Profiles.findOne({userId: Meteor.userId()});
	}
	if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
		return Dispatchers.findOne({userId: Meteor.userId()});
	}
	if(Roles.userIsInRole(Meteor.userId(), ['accountant'])) {
		return Accountants.findOne({userId: Meteor.userId()});
	}
})

UI.registerHelper('providerCount', function() {
	return Profiles.find().count();
})

UI.registerHelper('buyerCount', function() {
	return Buyers.find().count();
})

UI.registerHelper('favUserCount', function() {
	var favUsers = Meteor.user().favoriteUsers;
	if(favUsers)
		return favUsers.length;
	return 0;
})

UI.registerHelper('buyerNotificationCount', function() {
	return Notifications.find({$and: [{buyerId: Meteor.userId()}, {side: 'buyer'}, {read: false}]}).count();
});

UI.registerHelper('providerNotificationCount', function() {
	return Notifications.find({$and: [{providerId: Meteor.userId()}, {side: 'provider'}, {read: false}]}).count();
})

UI.registerHelper('unreadMsgCount', function(userId) {
	return Messages.find({$and: [{recipient: userId}, {read: false}]}).count();
});

UI.registerHelper('openJobsCount', function() {
	return Jobs.find({$and: [{invited: false}, {routed: false}, {$or: [{applicationStatus: 'open'}, {$and: [{applicationStatus: 'assigned'}, {assignmentStatus: 'not_confirmed'}]}]}]}).count();
});

UI.registerHelper('buyerJobsCount', function() {
	return Jobs.find({userId: Meteor.userId()}).count();
})

UI.registerHelper('recommendedJobsCount', function() {
	var jobCategories = Profiles.findOne({userId: Meteor.userId()}).industryTypes;
	return Jobs.find({$and: [{routed: false}, {invited: false}, {jobSubCategory: {$in: jobCategories}}, {$or: [{applicationStatus: 'open'}, {$and: [{applicationStatus: 'assigned'}, {assignmentStatus: 'not_confirmed'}]}]}]}).count()
});

UI.registerHelper('providerInvitedCount', function() {
	var invitedJobs = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
	if(invitedJobs) {
		return invitedJobs.length;
	}
	return 0;
});

UI.registerHelper('buyerInvitedCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {invited: true}, {applicationStatus: 'open'}]}).count();
	}
})

UI.registerHelper('postedJobCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
		return Jobs.find({userId: Meteor.userId()}).count();
	}
});

UI.registerHelper('buyerAssignedCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}, {$or: [{assignmentStatus: 'not_confirmed'}, {assignmentStatus: 'confirmed'}, {assignmentStatus: 'rejected'}]}, {status: 'active'}]}).count();
	}
});

UI.registerHelper('buyerPendingApprovalCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'assigned'}, {assignmentStatus: 'submitted'}, {status: 'active'}]}).count();
	}
})

UI.registerHelper('deactivatedCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
    	return Jobs.find({$and: [{userId: Meteor.userId()}, {status: 'deactivated'}]}).count();
	}
});

UI.registerHelper('buyerOpenCount', function(buyerId) {
	if(buyerId) {
		return Jobs.find({$and: [{userId: buyerId}, {$or: [{applicationStatus: 'open'}, {$and: [{applicationStatus: 'assigned'}, {assignmentStatus: 'not_confirmed'}]}]}]}).count();
	} else {
		if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
			return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'open'}]}).count();
		}
	}
});

UI.registerHelper('buyerPaidCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {applicationStatus: 'paid'}, {buyerArchived: false}]}).count();
	}
});

UI.registerHelper('buyerRoutedCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher'])) {
		return Jobs.find({$and: [{userId: Meteor.userId()}, {routed: true}, {applicationStatus: 'frozen'}, {status: 'active'}]}).count();
	}
});

UI.registerHelper('appliedJobsCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
		var providerDetails = Profiles.findOne({userId: Meteor.userId()});
		if(providerDetails.appliedJobs)
			return providerDetails.appliedJobs.length;
		return 0;
	}
});

UI.registerHelper('invitedJobsCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
		var routedJobs = Profiles.findOne({userId: Meteor.userId()}).invitedJobs;
		if(routedJobs) {
			return routedJobs.length;
		}
		return 0;
	}
});

UI.registerHelper('routedJobsCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
		var routedJobs = Profiles.findOne({userId: Meteor.userId()}).routedJobs;
		if(routedJobs) {
			return routedJobs.length;
		}
		return 0;
	}
});

UI.registerHelper('assignedJobsCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
		var providerDetails = Profiles.findOne({userId: Meteor.userId()});
		if(providerDetails && providerDetails.assignedJobs) {
			return providerDetails.assignedJobs.length;
		}
		return 0;
	}
});

UI.registerHelper('proPendingApprovalCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
		var providerDetails = Profiles.findOne({userId: Meteor.userId()});
		if(providerDetails && providerDetails.pendingApproval) {
			return providerDetails.pendingApproval.length;
		}
		return 0;
	}
});

UI.registerHelper('proPaidJobsCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
		var paidJobs = Profiles.findOne({userId: Meteor.userId()}).paidJobs;
		if(paidJobs) {
			return paidJobs.length;
		}
		return 0;
	}
});

UI.registerHelper('providerAllCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
		var allJobs = Profiles.findOne({userId: Meteor.userId()}).allJobs;
		if(allJobs)
			return allJobs.length;
		return 0;
	}
});

UI.registerHelper('proDeactivatedCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['provider'])) {
		var deactivatedJobs = Profiles.findOne({userId: Meteor.userId()}).deactivatedJobs;
		if(deactivatedJobs) {
			return deactivatedJobs.length;
		}
		return 0;
	}
})

UI.registerHelper('userAccountBalance', function() {
	var accountBalance;
	if(Roles.userIsInRole(Meteor.userId(), ['accountant', 'dispatcher'])) {
		accountBalance =  Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
	} else {
		accountBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
	}
	return +(Math.round(accountBalance + 'e+2') + 'e-2');
});

UI.registerHelper('teamCount', function() {
	var dispatchers = Dispatchers.find({invitedBy: Meteor.userId()}).count();
	var accountants = Accountants.find({invitedBy: Meteor.userId()}).count();
	return dispatchers + accountants;
});

UI.registerHelper('teamDispatcherCount', function() {
	return Dispatchers.find({invitedBy: Meteor.userId()}).count();
})

UI.registerHelper('teamAccountantCount', function() {
	return Accountants.find({invitedBy: Meteor.userId()}).count();
})

UI.registerHelper('invoicesCount', function() {
	if(Roles.userIsInRole(Meteor.userId(), ['provider']))
		return Invoices.find({providerId: Meteor.userId()}).count();
	if(Roles.userIsInRole(Meteor.userId(), ['buyer', 'dispatcher']))
		return Invoices.find({buyerId: Meteor.userId()}).count();
})