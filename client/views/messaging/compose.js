
	var selectionChange = new Deps.Dependency;

	Template.compose.onRendered(function() {
		$('#summernote').summernote();
		$('.note-editor .note-toolbar .note-insert').remove();
	});


	Template.compose.events({
	    'click #sendMail': function(event, template) {
	        var recipient = $('#recipient').val();
	        if (!recipient) {
	        	toastr.error('Please select recipient');
	        	return;
	        }
	        var projectID = $('#project').val();
	        if (!projectID) {
	        	toastr.error('Please select a project');
	        	return;
	        } 
	        var content = $('#summernote').summernote('code');
	        $('#summernote').summernote('destroy');
	        var sender = Meteor.userId();
	        var message = {};
	        message.recipient = recipient;
	        message.subject = $( "#project option:selected" ).text();
	        message.projectID = projectID;
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
	    		chain = chain.concat(temp);
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

	    },
	    'change #project' : function(event,template){
	    	selectionChange.changed();
	    }
	});

	var SelectedProject;

	Template.compose.helpers({
	    userList: function(project) {
	    	selectionChange.depend();
	    	SelectedProject= $('#project').val();
	    	if(Router.current().params.tab.substr(0,6) == 'newrep') {
		    	var id = Router.current().params.tab.substr(6);
		    	SelectedProject = Messages.findOne({'_id':id}).projectID;
	    	}
	    	var defaultOpt = {id:null,email:'Select recipient'};
	    	var emailIDs = [];
	    	if(!SelectedProject) {
	    		return [{id:null,email:'Please select a project'}];
	    	} else if(SelectedProject=='other') {
	    		emailIDs.push(defaultOpt);
	    		var companyName = Meteor.users.findOne({_id:Meteor.userId()}).companyName;
	    		Meteor.users.find({$and:[{_id:{$ne:Meteor.userId()}},{companyName:companyName}]}).map(function(ele){
	    			emailIDs.push({id:ele._id,email:ele.emails[0].address});
	    		});
	    	}
	    	emailIDs.push(defaultOpt);
    		Meteor.users.find({$and:[{_id:{$ne:Meteor.userId()}},{contacts:{$regex: SelectedProject}}]}).map(function(ele){
    			emailIDs.push({id:ele._id,email:ele.emails[0].address});
    		});
	    	return emailIDs;
	    },
	    projectList: function() {
	    	var projects = [];
	    	if(Meteor.user().roles.indexOf("corporate-accountant")>-1 || Meteor.user().roles.indexOf("corporate-admin")>-1 
	    		|| Meteor.user().roles.indexOf("corporate-manager")>-1) {
	    		projects.push({title:'Other',
	    						id:'other'});
	    	} else {

		    	var userCollection = Meteor.users.findOne({_id:Meteor.userId()});
		    	var contactsPair = userCollection.contacts;
		    	var jobIDs = [];
		    	for(var i=0;i<contactsPair.length;i++) {
		    		jobIDs.push(contactsPair[i].split(':')[1]);
		    	}
		    	Jobs.find({_id:{$in:jobIDs||[]}}).map(function(ele){
		    		projects.push({title:ele.title,
		    						id:ele._id});
		    	});
	    	}
	    	return projects;
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
			var msgObj = Messages.findOne({'_id':param.substr(6)});
			if(msgObj) {
				ids = ids.concat(msgObj.chain);
			}
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
