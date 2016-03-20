	Template.compose.onRendered(function() {
	    $(function() {
	        $('#edit').froalaEditor()
	    });
	});


	Template.compose.events({
	    'click #sendMail': function(event, template) {
	        var recipient = $('#to').val();
	        if(!recipient) toastr.error('Please select recipient');
	        var subject = $('#subject').val();
	        if(!subject) toastr.error('Please enter subject');
	        var content = $('#edit').val();
	        if(!content) toastr.error('Please enter message');
	        var sender = Meteor.userId();
	        var message = {};
	        message.recipient = recipient;
	        message.subject = subject;
	        message.sender = sender;
	        message.content = content;

	        Meteor.call("postMessage",message,function(err,res){
	        	if(err) {
	        		toastr.error('Failed to send Message');
	        	} else {
	        		toastr.success('Message sent');
	        	}
	        }) 

	    }
	});
