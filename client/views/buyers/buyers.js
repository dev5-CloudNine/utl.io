Template.buyers.onCreated(function() {
	var instance = this;
	instance.query = new ReactiveVar();
    this.infiniteScroll({
        perPage: 40,
        subManager: subs,
        collection: Buyers,
        publication: 'buyers'
    });
});

Template.buyers.helpers({
    buyersList: function() {
    	if(Template.instance().query.get())
    		return Session.get('buyerResults');
    	return Buyers.find({}, {sort: {createdAt: -1}}).fetch();
    }
});

Template.buyers.events({
	'keyup #search-buyers': _.debounce(function(event, template) {
		var query = $(event.currentTarget).val();
		template.query.set(query);
		if(query) {
			Meteor.call('search_buyers', query, function(error, result) {
				if(!error)
					Session.set('buyerResults', result);
			})
		}
	}, 250)
})