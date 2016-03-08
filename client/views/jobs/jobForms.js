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

var arr = new ReactiveArray();

Template.jobFields.events({
	'keyup input[name="fixedamount"]': function(event, template) {
		var fixedamount = template.find('input[name="fixedamount"]').value;
		template.find('input[name="totalfromclient"]').value = fixedamount;
		template.find('input[id="your_cost"]').value = fixedamount;
		var freenet = fixedamount - (fixedamount * 5/100);
		template.find('input[id="freelancer_nets"]').value = freenet;
	},
	'keyup input[name="maxhours"]': function(event, template) {
		var hourlyrate = template.find('input[name="hourlyrate"]').value;
		var maxhours = template.find('input[name="maxhours"]').value;
		var totalamount = hourlyrate * maxhours;
		template.find('input[name="totalfromclient"]').value = totalamount;
		template.find('input[id="your_cost"]').value = totalamount;
		var freenet = totalamount - (totalamount * 5/100);
		template.find('input[id="freelancer_nets"]').value = freenet;
	},
	'keyup input[name="maxdevices"]': function(event, template) {
		var rateperdevice = template.find('input[name="rateperdevice"]').value;
		var maxdevices = template.find('input[name="maxdevices"]').value;
		var totalamount = rateperdevice * maxdevices;
		template.find('input[name="totalfromclient"]').value = totalamount;
		template.find('input[id="your_cost"]').value = totalamount;
		var freenet = totalamount - (totalamount * 5/100);
		template.find('input[id="freelancer_nets"]').value = freenet;
	},
	'keyup input[name="nexthours"]': function(event, template) {
		var payforfirsthours = template.find('input[name="payforfirsthours"]').value;
		var firsthours = template.find('input[name="firsthours"]').value;
		var payfornexthours = template.find('input[name="payfornexthours"]').value;
		var nexthours = template.find('input[name="nexthours"]').value;
		var totalforfirsthours = payforfirsthours * firsthours;
		var totalfornexthours = payfornexthours * nexthours;
		var totalamount = totalforfirsthours + totalfornexthours;
		template.find('input[name="totalfromclient"]').value = totalamount;
		template.find('input[id="your_cost"]').value = totalamount;
		var freenet = totalamount - (totalamount * 5/100);
		template.find('input[id="freelancer_nets"]').value = freenet;
	},
	'change input[value="You"]': function(event, template) {
		var totalamount = parseInt(template.find('input[name="totalfromclient"]').value);
		var clientCost = totalamount + totalamount * 5/100;
		console.log(clientCost);
		template.find('input[id="your_cost"]').value = clientCost;
		template.find('input[id="freelancer_nets"]').value = totalamount;
	},
	'change input[value="Freelancer"]': function(event, template) {
		var totalamount = parseInt(template.find('input[name="totalfromclient"]').value);
		var freenet = totalamount - totalamount * 5/100;
		template.find('input[id="your_cost"]').value = totalamount;
		template.find('input[id="freelancer_nets"]').value = freenet;
	}
});

Template.jobFields.helpers({
	jobTypeOptions: function () {
		return [
			{
				optgroup: "IT/Networking",
				options: [
					{label: "Network & System Admininstration", value: "Network & System Admininstration"},
					{label: "Server", value: "Server"},
					{label: "Information Security", value: "Information Security"},
					{label: "ERP-CRM Software", value: "ERP-CRM Software"},
					{label: "Helpdesk", value: "Helpdesk"},
					{label: "Database Administration", value: "Database Administration"},
					{label: "Network Setup", value: "Network Setup"},
					{label: "Management", value: "Management"},
					{label: "Network Security", value: "Network Security"}
				]
			},
			{
				optgroup: "Wiring Installment",
				options: [
					{label: "CAT 3-5-6", value: "CAT 3-5-6"},
					{label: "Fiber Optic", value: "Fiber Optic"},
					{label: "Coax", value: "Coax"}
				]
			}
		];
	},
	names: function() {
		return arr.list();
	}
});