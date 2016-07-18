var allUsers = function() {
	return Users.find().fetch();
}
var adminOptionsObject = {
	columns: [
		{
			title: 'User Name',
			data: function(user) {
				if(user.roles[0] == 'buyer' || user.roles[0] == 'corporate-manager') {
					var buyerDetails = Buyers.findOne({userId: user._id});
					if(buyerDetails) {
						var buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.name + '</a>';
						return buyerLink;
					} else {
						return getUserEmail(user);
					}
				}
				if(user.roles[0] == 'provider' || user.roles[0] == 'corporate-provider') {
					var providerDetails = Profiles.findOne({userId: user._id});
					if(providerDetails) {
						var providerLink = '<a href="/profiles/' + providerDetails._id + '">' + providerDetails.name + '</a>';
						return providerLink;
					} else {
						return getUserEmail(user);
					}
				}
				if(user.roles[0] == 'corporate-admin') {
					var corporateDetails = Corporates.findOne({userId: user._id});
					if(corporateDetails) {
						var corporateLink = '<a href="/corporates/' + corporateDetails._id + '">' + corporateDetails.name + '</a>';
						return corporateLink;
					} else {
						return getUserEmail(user);
					}
				}
				if(user.roles[0] == 'admin') {
					return 'Admin';
				}
			}
		},
		{
			title: 'User Role',
			data: function(user) {
				return user.roles[0];
			}
		},
		{
			title: 'Company',
			data: function(user) {
				if(user.roles[0] == 'buyer' || user.roles[0] == 'corporate-manager') {
					var buyerDetails = Buyers.findOne({userId: user._id});
					if(buyerDetails) {
						if(buyerDetails.companyName) {
							return buyerDetails.companyName;
						} else {
							return '';
						}
					} else {
						return '';
					}
				}
				if(user.roles[0] == 'provider' || user.roles[0] == 'corporate-provider') {
					var providerDetails = Profiles.findOne({userId: user._id});
					if(providerDetails) {
						if(providerDetails.companyName)
							return providerDetails.companyName;
						else
							return '';
					}
				}
				if(user.roles[0] == 'corporate-admin') {
					var companyName = Corporates.findOne({userId: user._id}).companyName;
					if(companyName) {
						return companyName;
					} else {
						return '';
					}
				}
				if(user.roles[0] == 'admin') {
					return '';
				}
			}
		},
		{
			title: 'Account Balance',
			data: function(user) {
				return '$' + Wallet.findOne({userId: user._id}).accountBalance;
			}
		},
		{
			title: 'Created On',
			data: function(user) {
				return moment(user.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a");
			}
		}
	],
	order: [
		[4, 'asc']
	]
}
Template.allUsers.helpers({
	allUsers: function() {
		return allUsers;
	},
	adminOptionsObject: adminOptionsObject
})