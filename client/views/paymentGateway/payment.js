
Template.payment.onRendered(function(){
	$('.show-info').hide();
});

Template.payment.events({
	'click .dwolla' : function(){
		Meteor.call('getUserInfo', Meteor.userId(), function (error, result) {
			if(error){
				console.log(error);
				return;
			}
			$('.show-info').text(JSON.stringify(result));
			$('.show-info').show();
		});
	},
	'click .authUrl' : function(){
		Meteor.call('authUrl', Meteor.userId(), function (error, result) {
			if(error){
				console.log(error);
				return;
			}
			window.location = result;
		});
	},
	'click .dwolla-balance' : function(){
		Meteor.call('getBalance', Meteor.userId(), function(error, result) {
			if(error){
				console.log(error);
				return;
			}
			$('.show-info').text(JSON.stringify(result));
			$('.show-info').show();
		});
	},
	'click .dwolla-trans' : function(){
		Meteor.call('getTransactions', function (error, result) {
			if(error){
				console.log(error);
				return;
			}
			$('.show-info').text(JSON.stringify(result));
			$('.show-info').show();
		});
	}
})