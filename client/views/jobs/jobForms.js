AutoForm.addHooks(['jobNew', 'jobEdit'], {
	after: {
		insert: function(error, result) {
			if (error) {
				console.log("Insert Error:", error);
			} else {
				analytics.track("Job Created");
        		Router.go('job', {_id:result});
			}
		},
		update: function(error, result) {
			if (error) {
				console.log("Update Error:", error);
			} else {
				analytics.track("Job Edited");
        		Router.go('job', {_id: Router.current().params._id});
			}
		}
	}
});

Template.jobFields.rendered = function() {
	Meteor.typeahead.inject('.typeahead');
}

var locLoaded=false;

Template.assignJob.events({
	'click button.assign': function(event, template) {
		var pId = Router.current().params._id;
		Jobs.before.insert(function(userId, doc) {
			doc.selectedProvider = Profiles.findOne({_id: pId}).userId;
			doc.applications = [];
			var appDetails = {
				userId: doc.selectedProvider,
				applied_at: new Date(),
				app_status: 'accepted',
				app_type: 'application'
			}
			doc.applications.push(appDetails);
		});
		Jobs.after.insert(function(userId, doc) {
			doc.routed = true;
			Meteor.call('assignJobUpdate', doc, pId, function(error) {
				if(error) {
					toastr.error('Failed to assign job to the provider');
				}
				else {
					toastr.success('An invitation has been sent to the provider to confirm assignment.');
				}
			})
		});
	}
});

Template.assignJob.helpers({
	'selectedProvider': function() {
		return Profiles.findOne({_id: Router.current().params._id});
	}
})

Template.jobFields.events({
	'change input[name="fixedamount"], keyup input[name="fixedamount"]': function(event, template) {
		var fixedamount = template.find('input[name="fixedamount"]').value;
		template.find('input[name="totalfromclient"]').value = fixedamount;
		template.find('input[name="your_cost"]').value = fixedamount;
		var freenet = fixedamount - (fixedamount * 5/100);
		template.find('input[name="freelancer_nets"]').value = freenet;
	},
	'change input[name="hourlyrate"], keyup input[name="hourlyrate"], change input[name="maxhours"], keyup input[name="maxhours"]': function(event, template) {
		var hourlyrate = template.find('input[name="hourlyrate"]').value;
		var maxhours = template.find('input[name="maxhours"]').value;
		var totalamount = hourlyrate * maxhours;
		template.find('input[name="totalfromclient"]').value = totalamount;
		template.find('input[name="your_cost"]').value = totalamount;
		var freenet = totalamount - (totalamount * 5/100);
		template.find('input[name="freelancer_nets"]').value = freenet;
	},
	'change input[name="rateperdevice"], keyup input[name="rateperdevice"], change input[name="maxdevices"], keyup input[name="maxdevices"]': function(event, template) {
		var rateperdevice = template.find('input[name="rateperdevice"]').value;
		var maxdevices = template.find('input[name="maxdevices"]').value;
		var totalamount = rateperdevice * maxdevices;
		template.find('input[name="totalfromclient"]').value = totalamount;
		template.find('input[name="your_cost"]').value = totalamount;
		var freenet = totalamount - (totalamount * 5/100);
		template.find('input[name="freelancer_nets"]').value = freenet;
	},
	'change input[name="payforfirsthours"], keyup input[name="payforfirsthours"], change input[name="firsthours"], keyup input[name="firsthours"], change input[name="payfornexthours"], keyup input[name="payfornexthours"], change input[name="nexthours"], keyup input[name="nexthours"]': function(event, template) {
		var payforfirsthours = template.find('input[name="payforfirsthours"]').value;
		var firsthours = template.find('input[name="firsthours"]').value;
		var payfornexthours = template.find('input[name="payfornexthours"]').value;
		var nexthours = template.find('input[name="nexthours"]').value;
		var totalforfirsthours = payforfirsthours * firsthours;
		var totalfornexthours = payfornexthours * nexthours;
		var totalamount = totalforfirsthours + totalfornexthours;
		template.find('input[name="totalfromclient"]').value = totalamount;
		template.find('input[name="your_cost"]').value = totalamount;
		var freenet = totalamount - (totalamount * 5/100);
		template.find('input[name="freelancer_nets"]').value = freenet;
	},
	'change input[value="You"]': function(event, template) {
		var totalamount = parseInt(template.find('input[name="totalfromclient"]').value);
		var clientCost = totalamount + totalamount * 5/100;
		console.log(clientCost);
		template.find('input[name="your_cost"]').value = clientCost;
		template.find('input[name="freelancer_nets"]').value = totalamount;
	},
	'change input[value="Provider"]': function(event, template) {
		var totalamount = parseInt(template.find('input[name="totalfromclient"]').value);
		var freenet = totalamount - totalamount * 5/100;
		template.find('input[name="your_cost"]').value = totalamount;
		template.find('input[name="freelancer_nets"]').value = freenet;
	},
	'change input[name="servicelocation"]': function(event, template) {
		if(event.target.value == 'Field Job') {
			$('div.loc').show();
		} else {
			$('div.loc').hide();
		}
	},
	// "click button.upload": function(event){
	// 	event.preventDefault();
 //        var files = $("input.file_bag")[0].files

 //        S3.upload({
 //                files:files,
 //                path:"subfolder"
 //            },function(e,r){
 //                console.log(r);
 //        });
 //    }
});

Template.jobFields.helpers({
	locationData : function(){
		locLoaded = true;
		return this.job.location;
	},
	location: function (query, sync, callback) {
		if(!locLoaded) $('.typeahead').addClass('loadinggif');
		Meteor.call('location', query, {}, function(err, res) {
			if (err) {
			console.log(err);
			return;
		}
		callback(res.map(function(v) {
			locLoaded = true;
			$('.typeahead').removeClass('loadinggif');
			return { value: v.city + ", " + v.state + ", " + v.zip}; }));
		});
	},
	// "files": function(){
 //        return S3.collection.find();
 //    }
});