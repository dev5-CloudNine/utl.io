if (Meteor.isServer) {
    var dwolla = Npm.require('dwolla-v2');
    var client = new dwolla.Client({
        id: 'Ljykx8wFK86txAIl6fFys7IP0G6YeH7S7HLqaDSXq66TUWqEC3',
        secret: '3pBbbQRTbe7UkJ62VjYkmzGEW5fIB7O5aCz8LAWTHf1PJNMpeb',
        environment: 'sandbox'
    });
    var request = Npm.require('request');
    var auth;
    var redirect_uri = 'http://localhost:3000/oauth_return';
    var Future = Npm.require('fibers/future');
    function async(cb) {
        client.fullAccountInfo(function(err, data) {
            if (err) { console.log(err); }
            cb(err, data);
        });
    }
    function asyncGetBalance(cb) {
        client.balance(function(err, data){
           if (err) { console.log(err); }
            cb(err, data);
        });
    }
    function asyncGetTrans(cb) {
        client.transactions(function(err, data) {
          if (err) { console.log(err); }
          cb(err, data);
        });
    }
    Meteor.methods({
        'authUrl': function(userId) {
            auth = new client.Auth({
                redirect_uri: redirect_uri + '?id=' + userId,
                scope: 'ManageCustomers|Funding|Transactions|Send'
            });
            return auth.url;
        },
        'finishAuth': function(code, userId) {
            var tokenRequest = {
                uri: client.tokenUrl,
                method: 'POST',
                json: {
                    "client_id": client.id,
                    "client_secret": client.secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect_uri + '?id=' +userId
                }
            };
            request(tokenRequest, function(err, res, body) {
                Fiber = Npm.require('fibers');
                Fiber(function() {
                    body['updated_on'] = new Date();
                    Wallet.upsert({userId: userId}, {$set: body});
                }).run();
            })
        },
        'refreshAuthorization': function(userId) {
            var obj = Wallet.findOne({userId: userId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return
            }
            var tokenRequest = {
                uri: client.tokenUrl,
                method: 'POST',
                json: {
                    'client_id': client.id,
                    'client_secret': client.secret,
                    'refresh_token': obj.refresh_token,
                    'grant_type': 'refresh_token'
                }
            }
            request(tokenRequest, function(err, res, body) {
                Fiber = Npm.require('fibers');
                Fiber(function() {
                    body['updated_on'] = new Date();
                    Wallet.upsert({userId: userId}, {$set: body});
                }).run();
            })
        },
        'createCustomer': function(userId, provider) {
            var dob = moment(provider.dateOfBirth).format('YYYY-MM-DD');
            var obj = Wallet.findOne({userId: userId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return;
            }
            var accountToken = new client.Token({access_token: obj.access_token});
            var customerDetails = {
                firstName: provider.firstName,
                lastName: provider.lastName,
                email: 'shibin@batra.com',
                type: 'personal',
                address1: provider.fullLocation.street,
                city: provider.fullLocation.locality,
                state: provider.fullLocation.state,
                postalCode: provider.fullLocation.zip,
                dateOfBirth: dob,
                ssn: provider.socialSecurityNumber,
                phone: provider.contactNumber
            };
            var customerUrl;
            accountToken.post('customers', customerDetails).then(function(res) {
                console.log('Create customer result');
                console.log(res);
                customerUrl = res.headers._headers.location[0];
                var fundObj = {
                    'routingNumber': provider.bankDetails.routingNumber,
                    'accountNumber': provider.bankDetails.accountNumber,
                    'type': provider.bankDetails.bankAccountType,
                    'name': provider.firstName + ' FSRC'
                };
                accountToken.post(customerUrl + '/funding-sources', fundObj).then(function(res) {console.log(res)}, function(err) {console.log(err)});
            }, function(err) {
                console.log('Create Customer error');
                console.log(err.body._embedded.errors);
            })
        },
        'showCustomers': function(userId) {
            var obj = Wallet.findOne({userId: userId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return;
            }
            var resultObject = [];
            var accountToken = new client.Token({access_token: obj.access_token});
            var fut = new Future();
            accountToken.get('customers').then(function(result) {
                fut.return(result.body._embedded.customers);
            }, function(error) {
                console.log(error);
            });
            fut.wait();
            return fut.value;
        },
        'getBalance': function() {
            var obj = Wallet.findOne({'_id':this.userId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return;
            }
            client.setToken(obj.access_token);
            var fut = new Future();
            var bound_callback = Meteor.bindEnvironment(function(err, res) {
                if (err) {
                    fut.throw(err);
                } else {
                    fut.return(res)
                }
            });
            asyncGetBalance(bound_callback);
            fut.wait();
            return fut.value;
        },
        'getTransactions': function() {
            var obj = Wallet.findOne({'_id':this.userId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return;
            }
            client.setToken(obj.access_token);
            var fut = new Future();
            var bound_callback = Meteor.bindEnvironment(function(err, res) {
                if (err) {
                    fut.throw(err);
                } else {
                    fut.return(res)
                }
            });
            asyncGetTrans(bound_callback);
            fut.wait();
            return fut.value;

        }
    })
}
