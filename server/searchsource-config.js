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

SearchSource.defineSource('buyersList', function(searchText, options) {
	var options = {sort: {createdAt: -1}, limit: 10};
	if(searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or: [
			{name: regExp},
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
			{name: regExp},
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