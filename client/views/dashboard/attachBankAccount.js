Template.attachBankAccount.onCreated(function() {
	this.autorun(function() {
		Meteor.subscribe('userWallet', Meteor.userId());
		$.getScript('https://cdn.dwolla.com/1/dwolla.js')
		var customerUrl = Wallet.findOne({userId: Meteor.userId()}).dwollaCustomer.location[0];
		Meteor.call('genIavToken', customerUrl, function(error, result) {
			if(!error) {
				var iavToken = result.body.token;
				dwolla.config.dwollaUrl = 'https://uat.dwolla.com';
				dwolla.configure('uat');
                dwolla.iav.start('initiateIav', iavToken, function(err, res) {
                    if(err) {
                        console.log(err);
                    } else {
                    	var fundingSourceUrl = res._links['funding-source'].href;
                        Meteor.call('setFundingSourceInWallet', fundingSourceUrl, Meteor.userId());
                        if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
                        	Router.go('deposit');
                        else if(Roles.userIsInRole(Meteor.userId(), ['provider']))
                        	Router.go('withdraw')
                    }
                })
			} else {
				console.log(error)
			}
		})
	})
});