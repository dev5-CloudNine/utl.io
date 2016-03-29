	Template.compose.onRendered(function() {
		$(document).ready(function() {
		  $('#summernote').summernote();
		});
	});


	Template.compose.events({
	    'click #sendMail': function(event, template) {
	        var recipient = $('#to').val();
	        if (!recipient) {
	        	toastr.error('Please select recipient');
	        	return;
	        }
	        var subject = $('#subject').val();
	        if (!subject) {
	        	toastr.error('Please enter subject');
	        	return;
	        } 
	        var content = $('#summernote').summernote('code');
	        var sender = Meteor.userId();
	        var message = {};
	        message.recipient = recipient;
	        message.subject = subject;
	        message.sender = sender;
	        message.content = content;
	        message.date = new Date();
	        message.read = false;

	    	var param = Router.current().params.tab;

	    	var chain = [];
	    	if(param.substr(0,6) == 'newrep') {
	    		chain.push(param.substr(6));
	    		var temp = [];
	    		temp = Messages.findOne({'_id':param.substr(6)}).chain;
	    		console.log(chain);
	    		console.log("....");
	    		console.log(temp);
	    		console.log("....");
	    		chain = chain.concat(temp);
	    		console.log(chain);
	    		message.chain = chain;
	    	}
	    	message.chain = chain;
	        Meteor.call("postMessage", message, function(err, res) {
	            if (err) {
	                toastr.error('Failed to send Message');
	            } else {
	                toastr.success('Message sent');
	                Router.go('dashboard', { tab: 'mails' }, {});
	            }
	        })

	    }
	});

	Template.compose.helpers({
	    userList: function() {
	        var list = [];
	        Meteor.users.find({_id:{$ne:Meteor.userId()}}).map(function(ele) {
	            ele.email = ele.emails[0].address;
	            list.push(ele);
	        });
	        return list;

	    },
	    type: function() {
	    	var param = Router.current().params.tab;
	    	if(param == 'new')
	    		return 'new';
	    	else if(param.substr(0,6) == 'newrep')
	    		return 'newrep'; 
	    	else 
	    		return 'newfwd'; 
	    },
	    thread: function() {
	    	var param = Router.current().params.tab;
	    	if(param.substr(0,6) == 'newrep')
	    		return true;
	    	else
	    		return false;
	    },
	    message: function() {
	    	var id = Router.current().params.tab.substr(6);
    		var msgList = [];
		    Messages.find({
		    	$or:[{'_id':id},{'parent':id}]
		    }).map(function(ele){
		       ele.username = Meteor.users.findOne({'_id':ele.sender}).emails[0].address;
		       ele.date = moment(new Date(ele.date)).format('LL');
		       msgList.push(ele);
		    });
		    return msgList;

	    },
	    parentID: function() {
	    	var res = {};
	    	var id = Router.current().params.tab.substr(6);
	    	res.id = Messages.findOne({'_id':id}).sender;
	    	res.username = Meteor.users.findOne({'_id':res.id}).emails[0].address;
	    	return res;
	    },
	    parentSub: function() {
	    	var id = Router.current().params.tab.substr(6);
	    	return Messages.findOne({'_id':id}).subject;

	    },
	    parentMsg: function() {
	    	var param = Router.current().params.tab;
	    	var id = param.substr(6);


	    	var row = $('<div/>', {
			    'class':'row'
			});

			var ids = [];
			ids.push(id);
			ids = ids.concat(Messages.findOne({'_id':param.substr(6)}).chain);
			console.log(ids);
		    Messages.find({
		    	_id:{$in:ids}
		    }).map(function(ele){
		       username = Meteor.users.findOne({'_id':ele.sender}).emails[0].address;
		       date = moment(new Date(ele.date)).format('LL');

			    	var col = $('<div/>', {
					    'class':'col-md-12'
					}).appendTo(row);
			    	var mailboxContent = $('<div/>', {
					    'class':'mailbox-content'
					}).appendTo(col);
			    	var messageHeader = $('<div/>', {
					    'class':'message-header',
					    'style':"background-color: aliceblue; padding: 10px;"
					}).appendTo(mailboxContent);
			    	var messageContent = $('<div/>', {
					    'class':'message-content',
					    'html':ele.content
					}).appendTo(mailboxContent);;
			    	var uname = $('<p/>', {
					    'style':'float: left;',
					    'text': "from: "+ username
					}).appendTo(messageHeader);
			    	var mDate = $('<p/>', {
					    'class':'message-date',
					    'text': date
					}).appendTo(messageHeader);

		    });
		    //console.log(row[0].innerHTML);
		    return row[0].innerHTML;




	    }

	    // },
	    // content: function() {
	    // 	var param = Router.current().params.tab;
	    // 	if(param.substr(0,6) == 'newrep') {

	    // 	} else if(param.substr(0,6) == 'newfwd') {

	    // 	} 
	    // }

	});
