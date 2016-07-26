if (Meteor.isServer) {
    var client = Npm.require('dwolla-node')('kThHGM8bTjG8f7R2213FbLkB4GUyDGWD2ltZEze8luqefB7MOI', 'PIP7hw5WzpuNjUl3klw5i0m6sOAZlB9J7pGvUGPLB6LO5bVcrb');
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
    client.sandbox = true;
    Meteor.methods({
        authUrl: function() {
            return client.authUrl(redirect_uri+'?id='+this.userId)
        },
        'finishAuth': function(code,userId) {
            client.finishAuth(code, redirect_uri+'?id='+userId, function(error, auth) {
                Fiber = Npm.require('fibers');
                Fiber(function() { 
                    auth['updated_on'] = new Date();
                    Wallet.upsert({_id:userId},{$set: auth});
                }).run();
            });
        },
        'getUserInfo': function() {
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
            async(bound_callback);
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
