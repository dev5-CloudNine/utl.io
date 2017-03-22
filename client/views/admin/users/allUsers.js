var allUsers = function() {
	return Users.find().fetch();
}
var allUsersObject = {
	lengthMenu: [40, 80, 160, 320],
	pageLength: 40,
	order: [[0, 'desc']],
	columns: [
		{
			title: 'ID',
			data: function(user) {
				return user.readableID;
			},
			width: '10%'
		},
		{
			title: 'User Name',
			data: function(user) {
				if(user.roles[0] == 'buyer') {
					var buyerDetails = Buyers.findOne({userId: user._id});
					if(buyerDetails) {
						var buyerLink = '<a href="/buyers/' + buyerDetails._id + '">' + buyerDetails.firstName + ' ' + buyerDetails.lastName + '</a>';
						return buyerLink;
					} else {
						return getUserEmail(user);
					}
				}
				if(user.roles[0] == 'provider') {
					var providerDetails = Profiles.findOne({userId: user._id});
					if(providerDetails) {
						var providerLink = '<a href="/profiles/' + providerDetails._id + '">' + providerDetails.firstName + ' ' + providerDetails.lastName + '</a>';
						return providerLink;
					} else {
						return getUserEmail(user);
					}
				}
				if(user.roles[0] == 'dispatcher') {
					var dispatcherDetails = Dispatchers.findOne({userId: user._id});
					if(dispatcherDetails) {
						var dispatcherLink = '<a href="/dispatchers/' + dispatcherDetails._id + '">' + dispatcherDetails.firstName + ' ' + dispatcherDetails.lastName + '</a>';
						return dispatcherLink;
					} else {
						return getUserEmail(user);
					}
				}
				if(user.roles[0] == 'accountant') {
					var accountantDetails = Accountants.findOne({userId: user._id});
					if(accountantDetails) {
						var accountantLink = '<a href="/accountants/' + accountantDetails._id + '">' + accountantDetails.firstName + ' ' + accountantDetails.lastName + '</a>';
						return accountantLink;
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
				if(user.roles[0] == 'buyer') {
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
				if(user.roles[0] == 'provider') {
					var providerDetails = Profiles.findOne({userId: user._id});
					if(providerDetails) {
						if(providerDetails.companyName)
							return providerDetails.companyName;
						else
							return '';
					}
				}
				if(user.roles[0] == 'dispatcher') {
					var dispatcherDetails = Dispatchers.findOne({userId: user._id});
					if(dispatcherDetails) {
						if(dispatcherDetails.companyName)
							return dispatcherDetails.companyName
						else
							return '';
					}
				}
				if(user.roles[0] == 'accountant') {
					var accountantDetails = Accountants.findOne({userId: user._id});
					if(accountantDetails) {
						if(accountantDetails.companyName)
							return accountantDetails.companyName
						else
							return '';
					}
				}
				if(user.roles[0] == 'admin') {
					return '';
				}
			}
		},
		{
			title: 'Acct. Balance (USD)',
			data: function(user) {
				var userWallet = Wallet.findOne({userId: user._id});
				if(Roles.userIsInRole(user._id, ['dispatcher', 'accountant']))
					return;
				if(userWallet.dwollaCustomer && userWallet.fundingSourceUrl) {
					return '<p>' + (+(Math.round(userWallet.accountBalance + 'e+2') + 'e-2')) + '</p><small><i><a href="/users/transfers/' + user._id +'">Show Transfers</a></i></small>'
				}
				return +(Math.round(userWallet.accountBalance + 'e+2') + 'e-2');
			}
		},
		{
			title: 'Created On',
			data: function(user) {
				return moment(user.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a");
			}
		}
	]
}
Template.allUsers.helpers({
	allUsers: function() {
		return allUsers;
	},
	adminOptionsObject: allUsersObject
})