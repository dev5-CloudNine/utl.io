if (Meteor.isServer) {


    var cfg = {
        apiKey: 'OayTQNcpj0C59MFZSkshYFw911KZiZXjvtza0dyMOYeoVwqw7W',
        apiSecret: 'rAkHu5C0WX6KWeFaadAxoPSMxviPHLsbbKy30PHQ7RQOBvwdBL',
        accessToken: '',
        pin: ''
    };

    var Dwolla = Npm.require('dwolla-node')(cfg.apiKey, cfg.apiSecret);

    var redirect_uri = URL+'/oauth_return';
    Dwolla.sandbox = true;


    var Future = Npm.require('fibers/future');

    function async(cb) {
        Dwolla.fullAccountInfo(function(err, data) {
            if (err) { console.log(err); }
            cb(err, data);
        });
    }

    function asyncGetBalance(cb) {
		Dwolla.balance(function(err, data){
		   if (err) { console.log(err); }
            cb(err, data);
		});
    }

    function asyncGetTrans(cb) {
		Dwolla.transactions(function(err, data) {
		  if (err) { console.log(err); }
		  cb(err, data);
		});
    }


    Meteor.methods({
        'getUserInfo': function() {
        	var obj = Wallet.findOne({'_id':this.userId});
        	if(!obj) {
        		throw 'User\'s Dwolla account is not connected';
        		return;
        	}
        	Dwolla.setToken(obj.access_token);
/*
        	difference = (new Date() - new Date(obj.updated_on)) / 1000;
        	if(difference>obj.expires_in) {

			    Dwolla.refreshAuth(obj.refresh_token, function(error, auth) {
			        if (error) return res.send(error);
		    		auth['updated_on'] = new Date();
			        Wallet.upsert({_id:obj._id},{$set: auth});
			        Dwolla.setToken(auth.access_token);
			    });


        	} else {
    			Dwolla.setToken(token);
        	}
*/

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
        'authUrl': function() {
            return Dwolla.authUrl(redirect_uri+'?id='+this.userId);
        },
        'finishAuth': function(code,userId) {
        	Dwolla.finishAuth(code, redirect_uri+'?id='+userId, function(error, auth) {
		    	Fiber = Npm.require('fibers');
		    	Fiber(function() { 
		    		auth['updated_on'] = new Date();
		        	Wallet.upsert({_id:userId},{$set: auth});
		        }).run();
		    });
        },
        'getBalance': function() {
        	var obj = Wallet.findOne({'_id':this.userId});
        	if(!obj) {
        		throw 'User\'s Dwolla account is not connected';
        		return;
        	}
        	Dwolla.setToken(obj.access_token);
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
        	Dwolla.setToken(obj.access_token);
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



    });

}
