var selectionChange = new Deps.Dependency;

Template.compose.onRendered(function() {
    $('#spinner').hide();
	$('#summernote').summernote();
	$('.note-editor .note-toolbar .note-insert').remove();
});

var messageFiles = [];
var attachFiles = function(files) {
    messageFiles = [];
    files.forEach(function(file) {
        messageFiles.push(file);
    })
}

var removeMessageFile = function(file) {
    for(var i = 0; i < messageFiles.length; i++) {
        if(messageFiles[i].file_url == file) {
            messageFiles.splice(i, 1);
            return;
        }
    }
}

Template.compose.events({
    'click #sendMail': function(event, template) {
        var recipient = $('#recipient').val();
        if (recipient == 'Select recipient') {
        	toastr.error('Please select recipient');
        	return;
        }
        var param = Router.current().params.tab;
        var projectID = $('#project').val();
        if(!param.substr(0, 9) == 'newaccmsg' || !param.substr(0, 9) == 'newdismsg') {
            if (!projectID) {
            	toastr.error('Please select a project');
            	return;
            }
        }
        var content = $('#summernote').summernote('code');
        $('#summernote').summernote('destroy');
        var sender = Meteor.userId();
        var message = {};
        message.files = [];
        messageFiles.forEach(function(msgFile) {
            message.files.push(msgFile);
        })
        message.recipient = recipient;
        message.subject = $( "#project option:selected" ).text();
        message.projectID = projectID;
        message.sender = sender;
        message.content = content;
        message.date = new Date();
        message.read = false;
    	var chain = [];
    	if(param.substr(0,6) == 'newrep') {
    		chain.push(param.substr(6));
    		var temp = [];
    		temp = Messages.findOne({'_id':param.substr(6)}).chain;
    		chain = chain.concat(temp);
    		message.chain = chain;
            message.subject = $('#project').val();
    	}
        if(param.substr(0, 6) == 'newapm') {
            message.subject = $('#project').val();
        }
        if(param.substr(0, 6) == 'newpbm') {
            message.subject = $('#project').val();
        }
        if(param.substr(0,6) == 'newcsm') {
            message.subject = $('#project').val();
        }
        if(param.substr(0,9) == 'newaccmsg') {
            message.subject = $('#subject').val();
        }
        if(param.substr(0,9) == 'newdismsg') {
            message.subject = $('#subject').val();
        }

    	message.chain = chain;
        Meteor.call("postMessage", message, function(err, res) {
            if (err) {
                toastr.error('Failed to send Message');
            } else {
                toastr.success('Message sent');
                Router.go('mailBox', { tab: 'mails-inbox' }, {});
            }
        })

    },
    'change #project' : function(event,template){
    	selectionChange.changed();
    },
    'change .file_bag': function(event, template){
        event.preventDefault();
        $('#spinner').show();
        var files = $(event.currentTarget)[0].files;
        if(!files)
            return;
        S3.upload({
            files: files,
            path: S3_FILEUPLOADS
        }, function(error, result) {
            $('#spinner').hide();
            if(error) {
                toastr.error('Failed to upload documents.');
            }
            else {
                var messageId = Router.current().params.tab.substr(6);
                if(messageId) {
                    var files = [];
                    var fileListItem = '<li data-url='+result.secure_url+'><i class="fa fa-times-circle remove-file" aria-hidden="true" title="Remove" style="cursor: pointer;" onclick="removeMsgFile(\''+result.secure_url+'\')"></i> <a href='+result.secure_url+' target="_blank">'+result.file.original_name+'</a></li>'
                    $('.fileList').append(fileListItem);
                    $('ul.fileList li').each(function(li) {
                        var fileDetails = {
                            file_url: $(this).data('url'),
                            file_name: result.file.original_name
                        }
                        files.push(fileDetails);
                    });
                    attachFiles(files);
                } else {
                    var files = [];
                    var fileListItem = '<li data-url='+result.secure_url+'><i class="fa fa-times-circle remove-file" aria-hidden="true" title="Remove" style="cursor: pointer;" onclick="removeMsgFile(\''+result.secure_url+'\')"></i> <a href='+result.secure_url+' target="_blank">'+result.file.original_name+'</a></li>'
                    $('.fileList').append(fileListItem);
                    $('ul.fileList li').each(function(li) {
                        var fileDetails = {
                            file_url: $(this).data('url'),
                            file_name: result.file.original_name
                        }
                        files.push(fileDetails);
                    });
                    attachFiles(files);
                    toastr.success('File uploaded successssfully');
                }
            }
        })        
    },
    'click .remove-msg-file' : function(event, template) {
        event.preventDefault();
        $('#spinner').show();
        var messageId = Router.current().params.tab.substr(6);
        var url = $(event.currentTarget).data('url');
        var index = url.indexOf(S3_FILEUPLOADS)-1;
        var path = url.substr(index);
        S3.delete(path, function(err, res) {
            $('#spinner').hide();
            if (err) {
                toastr.error("Operation failed");
            } else {
                Meteor.call('deleteMessageFile', url, messageId,function (error, result) {
                    if(!error)
                      toastr.success("Deleted");
                });
            }
        });
        event.stopPropagation();
    }
});

removeMsgFile = function(file) {
    removeMessageFile(file);
    var index = file.indexOf(S3_FILEUPLOADS)-1;
    var path = file.substr(index);
    S3.delete(path, function(err, res) {
      if (err) {
        toastr.error("Operation failed");
      } else {
        $("ul.fileList").find("[data-url='"+file+"']").remove();
        toastr.success('Document is deleted successfully');
      }
    });
}

var SelectedProject;
var SelectedRecipient;

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
            var fName, lName;
            if(Roles.userIsInRole(ele._id, ['provider', 'corporate-provider'])) {
                var profile = Profiles.findOne({userId: ele._id});
                fName = profile.firstName;
                lName = profile.lastName;
            }
            if(Roles.userIsInRole(ele._id, ['buyer', 'corporate-manager'])) {
                var profile = Buyers.findOne({userId: ele._id});
                fName = profile.firstName;
                lName = profile.lastName;
            }
			emailIDs.push({id:ele._id,email:ele.emails[0].address, firstName: fName, lastName: lName});
		});
        if(!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
            Meteor.users.find({roles: {$in: ['admin']}}).map(function(ele) {
                emailIDs.push({id: ele._id, email: ele.emails[0].address, firstName: 'Support', lastName: 'desk'});
            })
        }
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
        console.log(param)
    	if(param == 'new')
    		return 'new';
    	else if(param.substr(0,6) == 'newrep')
    		return 'newrep';
        else if(param.substr(0,6) == 'newapm')
            return 'newapm';
        else if(param.substr(0,6) == 'newpbm')
            return 'newpbm';
        else if(param.substr(0,6) == 'newcsm')
            return 'newcsm';
        else if(param.substr(0,9) == 'newaccmsg')
            return 'newaccmsg';
        else if(param.substr(0,9) == 'newdismsg')
            return 'newdismsg';
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
    parentUser: function() {
        var id = Router.current().params.tab.substr(6);
        var msgDetails = Messages.findOne({_id: id});
        var fName, lName;
        if(Roles.userIsInRole(msgDetails.sender, ['provider', 'corporata-provider'])) {
            var profile = Profiles.findOne({userId: msgDetails.sender});
            fName = profile.firstName;
            lName = profile.lastName;
        }
        if(Roles.userIsInRole(msgDetails.sender, ['buyer', 'corporata-manager'])) {
            var profile = Buyers.findOne({userId: msgDetails.sender});
            fName = profile.firstName;
            lName = profile.lastName;
        }
        var parentUser = {
            parentUserId: msgDetails.sender,
            email: Meteor.users.findOne({_id: msgDetails.sender}).emails[0].address,
            firstName: fName,
            lastName: lName
        }
        return parentUser;
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
    },
    messageJobId: function() {
        var jobDetails = Jobs.findOne({_id: Router.current().params.query.jobId});
        return jobDetails.title;
    },
    assignedProvider: function() {
        var providerDetails = Profiles.findOne({userId: Router.current().params.query.proId});
        var provider = {
            userId: providerDetails.userId,
            userEmail: getUserEmail(Meteor.users.findOne({_id: providerDetails.userId})),
            firstName: providerDetails.firstName,
            lastName: providerDetails.lastName
        }
        return provider;
    },
    postedBuyer: function() {
        var buyerDetails = Buyers.findOne({userId: Router.current().params.query.buyId});
        var buyer = {
            userId: buyerDetails.userId,
            userEmail: getUserEmail(Meteor.users.findOne({_id: buyerDetails.userId})),
            firstName: buyerDetails.firstName,
            lastName: buyerDetails.lastName
        }
        return buyer;
    },
    adminDetails: function() {
        var adminDetails = {
            userId: Router.current().params.query.admId,
            userEmail: getUserEmail(Meteor.users.findOne({_id: Router.current().params.query.admId})),
            firstName: 'Support',
            lastName: 'desk'
        }
        return adminDetails;
    },
    accRecipient: function() {
        var accountant = Accountants.findOne({userId: Router.current().params.query.userId});
        var accountantDetails = {
            accUserId: Router.current().params.query.userId,
            accName: accountant.firstName + ' ' + accountant.lastName
        }
        return accountantDetails;
    },
    disRecipient: function() {
        var dispatcher = Dispatchers.findOne({userId: Router.current().params.query.userId});
        var dispatcherDetails = {
            disUserId: Router.current().params.query.userId,
            disName: dispatcher.firstName + ' ' + dispatcher.lastName
        }
        return dispatcherDetails;
    }
});
