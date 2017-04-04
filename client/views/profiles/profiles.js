Template.profiles.onCreated(function() {
	var instance = this;
	instance.query = new ReactiveVar();
});

Template.profiles.helpers({
    profilesList: function() {
    	if(Template.instance().query.get())
    		return Session.get('providerResults');
    	return Profiles.find({}, {sort: {createdAt: -1}}).fetch();
    }
});

Template.profiles.events({
	'keyup #search-providers': _.debounce(function(event, template) {
		var query = $(event.currentTarget).val();
		template.query.set(query);
		if(query) {
			Meteor.call('search_providers', query, function(error, result) {
				if(!error)
					Session.set('providerResults', result);
			})
		}
	}, 250)
})