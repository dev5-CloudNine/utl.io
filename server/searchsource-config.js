SearchSource.defineSource('openJobs', function(searchText, options) {
	var options = {sort: {createdAt: -1}, limit: 10};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or: [
			{title: regExp},
			{location: regExp},
			{jobtype: regExp},
			{jobSubCategory: regExp},
			{servicelocation: regExp},
			{readableID: regExp}
		]};
		return Jobs.find({$and: [{$and: [{status: 'active'}, {applicationStatus: 'open'}, {invited: false}]}, selector]}, options).fetch();
	} else {
		return Jobs.find({$and: [{status: 'active'}, {applicationStatus: 'open'}, {invited: false}]}, options).fetch();
	}
});

SearchSource.defineSource('buyerAllJobs', function(searchText, options) {
	var options = {sort: {createdAt: -1}};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or:[
			{title: regExp},
			{location: regExp},
			{jobtype: regExp},
			{jobSubCategory: regExp},
			{servicelocation: regExp},
			{readableID: regExp}
		]};
		return Jobs.find({$and: [{userId: this.userId}, selector]}, options).fetch();
	} else {
		return Jobs.find({userId: this.userId}, options).fetch();
	}
});

SearchSource.defineSource('buyerOpenJobs', function(searchText, options) {
	var options = {sort: {createdAt: -1}};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or:[
			{title: regExp},
			{location: regExp},
			{jobtype: regExp},
			{jobSubCategory: regExp},
			{servicelocation: regExp},
			{readableID: regExp}
		]};
		return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'open'}, selector]}, options).fetch();
	} else {
		return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'open'}]}, options).fetch();
	}
})

SearchSource.defineSource('buyerRoutedJobs', function(searchText, options) {
	var options = {sort: {createdAt: -1}};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or:[
			{title: regExp},
			{location: regExp},
			{jobtype: regExp},
			{jobSubCategory: regExp},
			{servicelocation: regExp},
			{readableID: regExp}
		]};
		return Jobs.find({$and: [{userId: this.userId}, {routed: true}, selector]}, options).fetch();
	} else {
		return Jobs.find({$and: [{userId: this.userId}, {routed: true}]}, options).fetch();
	}
})

SearchSource.defineSource('buyerAssignedJobs', function(searchText, options) {
	var options = {sort: {createdAt: -1}};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or:[
			{title: regExp},
			{location: regExp},
			{jobtype: regExp},
			{jobSubCategory: regExp},
			{servicelocation: regExp},
			{readableID: regExp}
		]};
		return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'assigned'}, selector]}, options).fetch();
	} else {
		return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'assigned'}]}, options).fetch();
	}
})

SearchSource.defineSource('buyerCompletedJobs', function(searchText, options) {
	var options = {sort: {createdAt: -1}};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or:[
			{title: regExp},
			{location: regExp},
			{jobtype: regExp},
			{jobSubCategory: regExp},
			{servicelocation: regExp},
			{readableID: regExp}
		]};
		return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'completed'}, selector]}, options).fetch();
	} else {
		return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'completed'}]}, options).fetch();
	}
})

SearchSource.defineSource('buyerPaymentPendingJobs', function(searchText, options) {
	var options = {sort: {createdAt: -1}};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or:[
			{title: regExp},
			{location: regExp},
			{jobtype: regExp},
			{jobSubCategory: regExp},
			{servicelocation: regExp},
			{readableID: regExp}
		]};
		return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'pending_payment'}, selector]}, options).fetch();
	} else {
		return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'pending_payment'}]}, options).fetch();
	}
})

SearchSource.defineSource('buyerPaidJobs', function(searchText, options) {
	var options = {sort: {createdAt: -1}};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or:[
			{title: regExp},
			{location: regExp},
			{jobtype: regExp},
			{jobSubCategory: regExp},
			{servicelocation: regExp},
			{readableID: regExp}
		]};
		return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'paid'}, {buyerArchived: false}, selector]}, options).fetch();
	} else {
		return Jobs.find({$and: [{userId: this.userId}, {applicationStatus: 'paid'}, {buyerArchived: false}]}, options).fetch();
	}
})

SearchSource.defineSource('deactivatedJobs', function(searchText, options) {
	var options = {sort: {createdAt: -1}};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or:[
			{title: regExp},
			{location: regExp},
			{jobtype: regExp},
			{jobSubCategory: regExp},
			{servicelocation: regExp},
			{readableID: regExp}
		]};
		return Jobs.find({$and: [{userId: this.userId}, {status: 'deactivated'}, selector]}, options).fetch();
	} else {
		return Jobs.find({$and: [{userId: this.userId}, {status: 'deactivated'}]}, options).fetch();
	}
})

SearchSource.defineSource('buyersList', function(searchText, options) {
	var options = {sort: {createdAt: -1}, limit: 10};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or: [
			{firstName: regExp},
			{lastName: regExp},
			{location: regExp},
			{title: regExp}
		]};
		return Buyers.find(selector, options).fetch();
	} else {
		return Buyers.find({}, options).fetch();
	}
});

SearchSource.defineSource('providerList', function(searchText, options) {
	var options = {sort: {createdAt: -1}, limit: 10};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or: [
			{firstName: regExp},
			{lastName: regExp},
			{title: regExp},
			{location: regExp}
		]};
		return Profiles.find(selector, options).fetch();
	} else {
		return Profiles.find({}, options).fetch();
	}
});

function buildRegExp(searchText) {
	var parts = searchText.trim().split(/[ \-\:]+/);
	return new RegExp('(' + parts.join('|') + ')', 'ig');
}