Template.breadcrumbs.helpers({
	path: function() {
		var pathParams = [];
		Router.current().route.path(this).split('/').forEach(function(parameter) {
			pathParams.push(parameter);
		});
		pathParams.splice(0, 1);
		// pathParams.splice(1, 1);
		return pathParams;
	}
})