Template.task.helpers({
	task: function() {
		var id = Router.current().params.taskID;
		return Tasks.find({_id:id});
	},
	show : function() {
		if (Meteor.user() &&
            Meteor.user().roles &&
            (Meteor.user().roles.indexOf("buyer"))!=-1) {
			return true;
        } 
		return Jobs.findOne({$and:[
			{_id:Router.current().params.jobID},
			{applicationStatus : "assigned"},
			{ applications: { $elemMatch: {app_status: 'accepted'}}},
			{ applications: { $elemMatch: {userId: Meteor.userId()}}}
			]})?true:false;
	},
	isBuyer: function() {
		if (Meteor.user() &&
            Meteor.user().roles &&
            (Meteor.user().roles.indexOf("buyer"))!=-1) {
			return true;
        } 		
	},
	taskID : function() {
		return Tasks.findOne({$and:[{'jobID':Router.current().params.jobID},{'task':Router.current().params.taskName}]})._id;
	},
	jobName: function() {
		return Jobs.findOne({_id:Router.current().params.jobID}).title;
	},
	states:function(){
		var staticStates = ['Open','On Hold','Working','Completed'];
		var stateObjArr = [];
		var selectedState = Tasks.findOne({_id:Router.current().params.taskID}).state;
		for(var i=0;i<staticStates.length;i++) {
			var obj = {};
			if(selectedState==staticStates[i]){
				obj.value = staticStates[i];
				obj.selected = 'Selected';
			} else {
				obj.value = staticStates[i];
			}
			stateObjArr.push(obj);
		}
		return stateObjArr;
	},
	uploadFile:function(){
		var taskObj = Tasks.findOne({_id:Router.current().params.taskID});
		if(taskObj && taskObj.taskName.toLowerCase().indexOf('upload') > -1) {
			return true;
		} else 
			return false;
	},
	"files": function(){
        return S3.collection.find();
    }

});

Template.task.events({
	'click button[type=submit]': function(event, template) {
		event.preventDefault();
		var obj = {};
		obj.state = $('#state').val();
		obj.comments = $('#comments').val();
		obj.task = $('#taskName').val();
		obj.jobID =  Router.current().params.jobID;
		var id = $('#task-form').data('id');
		Meteor.call('updateTask',id,obj,function(err,res){
			if(err) {
				toastr.error('Operation failed');
			} else {
				toastr.success('Task has been updated');
			}
		});
		event.preventDefault();
	},
	"click button.upload": function(event){
		event.preventDefault();
        var files = $("input.file_bag")[0].files

        S3.upload({
                files:files,
                path:"subfolder"
            },function(e,r){
                console.log(r);
        });
    }
});