if (Meteor.isServer) {
    var dwolla = Npm.require('dwolla-v2');
    var client = new dwolla.Client({
        id: 'ZmpgXecJaqy6SvIyNGXRKbK9nu2Z8nuygdXISYAecyfr86ugBb',
        secret: 'tIMzVgt95AyXhFf2RHZnoIunQQHN8RWVBvvSHKKaY8kF5ZqzAd',
        environment: 'sandbox'
    });
    var request = Npm.require('request');
    var auth;
    var redirect_uri = 'https://utl-59972.onmodulus.net/oauth_return';
    var Future = Npm.require('fibers/future');
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
                    "redirect_uri": redirect_uri + '?id=' + userId
                }
            };
            request(tokenRequest, function(err, res, body) {
                Fiber = Npm.require('fibers');
                Fiber(function() {
                    body['updated_on'] = new Date();
                    Wallet.upsert({userId: userId}, {$set: body});
                }).run();
                Fiber(function() {
                    Meteor.call('refreshAuthorization', userId);
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
                setTimeout(function() {
                    Fiber(function() {
                        Meteor.call('refreshAuthorization', userId);
                    }).run();
                }, body.expires_in * 1000);
            })
        },
        'createCustomer': function(dwolla_req_object, reqdUserId) {
            var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
            var obj = Wallet.findOne({userId: adminId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return;
            }
            var accountToken = new client.Token({access_token: obj.access_token});
            var customerDetails = {
                firstName: dwolla_req_object.firstName,
                lastName: dwolla_req_object.lastName,
                email: dwolla_req_object.email
            };
            var fut = new Future();
            accountToken.post('customers', customerDetails).then(function(res) {
                var Fiber = Npm.require('fibers');
                Fiber(function() {
                    var dwollaCustomer = res.headers._headers;
                    dwollaCustomer['updated_on'] = new Date();
                    Wallet.upsert({userId: reqdUserId}, {$set: {dwollaCustomer: dwollaCustomer, socialSecurityNo: dwolla_req_object.ssn}});
                }).run();
            }, function(err) {
                fut.return(err);
            });
            fut.wait();
            return fut.value;
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
                fut.return(error);
                console.log(error);
            });
            fut.wait();
            return fut.value;
        },
        'getCustomerDetails': function(customerUrl) {
            var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
            var obj = Wallet.findOne({userId: adminId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return;
            }
            var accountToken = new client.Token({access_token: obj.access_token});
            var fut = new Future();
            accountToken.get(customerUrl).then(function(res) {
                fut.return(res.body);
            }, function(err) {
                console.log(err);
                fut.return(err)
            })
            fut.wait();
            return fut.value;
        },
        'getCustomerTransfers': function(customerTransfersUrl) {
            var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
            var obj = Wallet.findOne({userId: adminId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return;
            }
            var accountToken = new client.Token({access_token: obj.access_token});
            var fut = new Future();
            accountToken.get(customerTransfersUrl).then(function(result) {
                fut.return(result.body);
            }, function(error) {
                console.log(error);
            });
            fut.wait();
            return fut.value;
        },
        'initiatePayment': function(customerFSUrl, reqdUserId, amount) {
            var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
            var obj = Wallet.findOne({userId: adminId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return;
            }
            var accountToken = new client.Token({access_token: obj.access_token});
            var adminFut = new Future();
            accountToken.get(obj._links.account.href).then(function(res) {
                adminFut.return(res.body._links['funding-sources'].href)
            }, function(err) {
                console.log(err)
            })
            adminFut.wait();
            var adminFS = adminFut.value;
            var adminFSUrl = new Future();
            accountToken.get(adminFS).then(function(res) {
                adminFSUrl.return(res.body._embedded['funding-sources'][0]._links.self.href);
            }, function(err) {
                console.log(err);
            })
            adminFSUrl.wait();
            var afsUrl = adminFSUrl.value;
            var requestBody;
            if(Roles.userIsInRole(reqdUserId, ['provider'])) {
                requestBody = {
                    _links: {
                        source: {
                            href: afsUrl
                        },
                        destination: {
                            href: customerFSUrl
                        }
                    },
                    amount: {
                        currency: 'USD',
                        value: amount
                    }
                };
            }
            if(Roles.userIsInRole(reqdUserId, ['buyer'])) {
                console.log(obj._links.account.href)
                requestBody = {
                    _links: {
                        source: {
                            href: customerFSUrl
                        },
                        destination: {
                            href: obj._links.account.href
                        }
                    },
                    amount: {
                        currency: 'USD',
                        value: amount
                    }
                };
            }
            var payReqFut = new Future();
            accountToken.post('transfers', requestBody).then(function(res) {
                console.log(res);
                payReqFut.return(res.headers);
            }, function(err) {
                console.log(err);
            });
            payReqFut.wait();
            return payReqFut.value;
        },
        'genIavToken': function(customerUrl) {
            var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
            var obj = Wallet.findOne({userId: adminId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return;
            }
            var accountToken = new client.Token({access_token: obj.access_token});
            var fut = new Future();
            accountToken.post(customerUrl + '/iav-token').then(function(res) {
                fut.return(res)
            }, function(err) {
                console.log(err);
            });
            fut.wait();
            return fut.value;
        },
        'setFundingSourceInWallet': function(fundingSourceURL, userId) {
            Wallet.update({userId: userId}, {$set: {fundingSourceUrl: fundingSourceURL}})
        },
        'getFundingSource': function() {
            var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
            var obj = Wallet.findOne({userId: adminId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return;
            }
            var accountToken = new client.Token({access_token: obj.access_token});
            var fut = new Future()
            accountToken.get('https://api-uat.dwolla.com/funding-sources/91a68bf0-7c18-4832-9e35-8c8841a3d074').then(function(result) {
                console.log(result.body._links['initiate-micro-deposits']);
            }, function(error) {
                console.log(error);
            })
        },
        'listTransfers': function() {
            var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
            var obj = Wallet.findOne({userId: adminId});
            if(!obj) {
                throw 'User\'s Dwolla account is not connected';
                return;
            }
            var accountToken = new client.Token({access_token: obj.access_token});
            var fut = new Future();
            accountToken.get(obj._links.account.href + '/transfers').then(function(res) {
                fut.return(res.body._embedded.transfers);
            }, function(err) {
                console.log(err);
            });
            fut.wait();
            return fut.value;
        },
        'getTransferDetails': function(transferId) {
            var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
            var obj = Wallet.findOne({userId: adminId});
            if(!obj) {
                throw 'User\'s Dwoll account is not connected';
                return;
            }
            var accountToken = new client.Token({access_token: obj.access_token});
            var fut = new Future();
            accountToken.get('https://api-uat.dwolla.com/transfers/' + transferId).then(function(res) {
                fut.return(res.body);
            }, function(err) {
                console.log(err)
            });
            fut.wait();
            return fut.value;
        },
        'updateCustomer': function() {
            var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
            var obj = Wallet.findOne({userId: adminId});
            if(!obj) {
                throw 'User\'s Dwoll account is not connected';
                return;
            }
            var accountToken = new client.Token({access_token: obj.access_token});
            var fut = new Future();
            accountToken.get("customers").then(function(res) {
                fut.return(res.body._embedded.customers);
            }, function(err) {
                console.log(err);
            })
            fut.wait();
            var customerArray = fut.value;
            customerArray.forEach(function(customer) {
                var reqBody = {
                    email: customer.lastName + 'vryfst@125' + '.com'
                }
                accountToken.post('https://api-uat.dwolla.com/customers/' + customer.id, reqBody).then(function(result) {
                    console.log(result);
                }, function(error) {
                    console.log(error);
                })
            })
        }
    })
}
