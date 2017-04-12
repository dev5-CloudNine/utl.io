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
    	var buyersDispatchers = [];
    	if(Template.instance().query.get())
    		return Session.get('buyerResults');
    	buyersDispatchers = buyersDispatchers.concat(Buyers.find({}).fetch());
    	buyersDispatchers = buyersDispatchers.concat(Dispatchers.find({}).fetch());
    	return _.sortBy(buyersDispatchers, function(buyer) {return -buyer.createdAt});
    },
    isBuyer: function(userId) {
        return (Roles.userIsInRole(userId, ['buyer']))? true : false;
    },
    isDispatcher: function(userId) {
        return (Roles.userIsInRole(userId, ['dispatcher']))? true : false;
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