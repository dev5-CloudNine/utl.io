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

function buildRegExp(searchText) {
	var parts = searchText.trim().split(/[ \-\:]+/);
	return new RegExp('(' + parts.join('|') + ')', 'ig');
}