AutoForm.addHooks(['jobNew', 'jobEdit', 'assignJob'], {
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
	},
	before: {
		insert: function(doc) {
			var buyerAccBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
			var your_cost = doc.your_cost;
			if(buyerAccBalance < your_cost) {
				alert("You don't have sufficient account balance to post this job");
				return;
			} else {
				this.result(doc);
			}
		},
		update: function(doc) {
			var buyerAccBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
			var your_cost = doc.$set.your_cost;
			if(buyerAccBalance < your_cost) {
				alert("You don't have sufficient account balance to post this job");
				return;
			} else {
				this.result(doc);
			}
		}
	}
});

Template.jobFields.rendered = function() {
	Meteor.typeahead.inject('.typeahead');
	$('.note-editor .note-toolbar .note-insert').remove();
}

var locLoaded=false;

Template.jobFields.events({
	'change input[name="fixedamount"], keyup input[name="fixedamount"]': function(event, template) {
		var fixedamount = parseFloat($('input[name="fixedamount"]').val());
		$('input[name="totalfromclient"]').val(fixedamount);
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'You') {
			$('input[name="your_cost"]').val(fixedamount + (fixedamount * 5/100));
			$('input[name="freelancer_nets"]').val(fixedamount);
		} else if(paidBy == 'Provider') {
			$('input[name="your_cost"]').val(fixedamount);
			$('input[name="freelancer_nets"]').val(fixedamount - (fixedamount * 5/100));
		}
	},
	'change input[name="hourlyrate"], keyup input[name="hourlyrate"], change input[name="maxhours"], keyup input[name="maxhours"]': function(event, template) {
		var hourlyrate = parseFloat($('input[name="hourlyrate"]').val());
		var maxhours = parseFloat($('input[name="maxhours"]').val());
		var totalamount = hourlyrate * maxhours;
		$('input[name="totalfromclient"]').val(totalamount);
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'You') {
			$('input[name="your_cost"]').val(totalamount + (totalamount * 5/100));
			$('input[name="freelancer_nets"]').val(totalamount);
		} else if(paidBy == 'Provider') {
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(totalamount - (totalamount * 5/100));
		}
	},
	'change input[name="rateperdevice"], keyup input[name="rateperdevice"], change input[name="maxdevices"], keyup input[name="maxdevices"]': function(event, template) {
		var rateperdevice = parseFloat($('input[name="rateperdevice"]').val());
		var maxdevices = parseFloat($('input[name="maxdevices"]').val());
		var totalamount = rateperdevice * maxdevices;
		$('input[name="totalfromclient"]').val(totalamount);
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'You') {
			$('input[name="your_cost"]').val(totalamount + (totalamount * 5/100));
			$('input[name="freelancer_nets"]').val(totalamount);
		} else if(paidBy == 'Provider') {
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(totalamount - (totalamount * 5/100));
		}
	},
	'change input[name="payforfirsthours"], keyup input[name="payforfirsthours"], change input[name="payfornexthours"], keyup input[name="payfornexthours"], change input[name="nexthours"], keyup input[name="nexthours"]': function(event, template) {
		var payforfirsthours = $('input[name="payforfirsthours"]').val();
		var firsthours = $('input[name="firsthours"]').val();
		var payfornexthours = $('input[name="payfornexthours"]').val();
		var nexthours = $('input[name="nexthours"]').val();
		var totalforfirsthours = parseFloat(payforfirsthours);
		var totalfornexthours = payfornexthours * nexthours;
		var totalamount = parseFloat(totalforfirsthours + totalfornexthours);
		$('input[name="totalfromclient"]').val(totalamount);
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'You') {
			$('input[name="your_cost"]').val(totalamount + (totalamount * 5/100));
			$('input[name="freelancer_nets"]').val(totalamount);
		} else if(paidBy == 'Provider') {
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(totalamount - (totalamount * 5/100));
		}
	},
	'change input[value="You"]': function(event, template) {
		event.preventDefault();
		var totalamount = parseFloat(template.find('input[name="totalfromclient"]').value);
		var clientCost = totalamount + totalamount * 5/100;
		template.find('input[name="your_cost"]').value = clientCost;
		template.find('input[name="freelancer_nets"]').value = totalamount;
	},
	'change input[value="Provider"]': function(event, template) {
		event.preventDefault();
		var totalamount = parseFloat(template.find('input[name="totalfromclient"]').value);
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
	'change select[name="jobtype"]': function(event, instance) {
		var parentId = $(event.target).val();
		instance.selParent.set(parentId);
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
				Session.set('fileUpload', true);
				var files = [];
				var fileListItem = '<li data-url='+result.secure_url+'><i class="fa fa-times-circle remove-file" aria-hidden="true" title="Remove" style="cursor: pointer;" onclick="removeFile(\''+result.secure_url+'\')"></i> <a href='+result.secure_url+' target="_blank">'+result.secure_url+'</a></li>'
				$('.fileList').append(fileListItem);
				$('ul.fileList li').each(function(li) {
					files.push($(this).data('url'));
				})
				Jobs.before.insert(function(userId, doc) {
					doc.files = files.toString();
					//doc.files.pushArray(files);
				});
				Jobs.before.update(function(userId, doc) {
					doc.files +=  ','+files.toString();
				});
				toastr.success('Uploaded documents successfully');
			}
		})
	}
});

Array.prototype.pushArray = function(files) {
	files.push.apply(files, files.concat.apply([], arguments));
};

removeFile = function(url) {
	console.log(url);
	var index = url.indexOf(S3_FILEUPLOADS)-1;
	var path = url.substr(index);
	S3.delete(path, function(err, res) {
	  if (err) {
	    toastr.error("Operation failed");
	  } else {
	  	$("ul.fileList").find("[data-url='"+url+"']").remove();
	  	toastr.success('Document is deleted successfully');
	  }
	});
}

Template.jobFields.created = function() {
	if(this.data) {
		this.selParent = new ReactiveVar(this.data.job.jobtype);
	} else {
		this.selParent = new ReactiveVar(null);
	}
}

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
	parentCategories: function() {
		return Categories.find().fetch();
	},
	childCategories: function () {
		var parentId = Template.instance().selParent.get();
		return parentId ? SubCategories.find({parentId: parentId}).fetch() : null;
	}
});

Template.jobNew.events({
	'click .publishToFavs': function(event, template) {
		var favProviders = Users.findOne({_id: Meteor.userId()}).favoriteUsers;
		Session.set('publishToFav', true);
		Jobs.before.insert(function(userId, doc) {
			$(event.target).prop('disabled', true);
			if(!Session.get('publishToFav'))
				return;
			doc.invited = true;
			doc.favoriteProviders = [];
			for(var i = 0; i < favProviders.length; i++) {
				doc.favoriteProviders.push(favProviders[i]);
			}
		});
		Jobs.after.insert(function(userId, doc) {
			if(!Session.get('publishToFav'))
				return;
			doc.invited = true;
			Meteor.call('publishToFavsUpdate', doc, function(error) {
				if(error) {
					toastr.error('Failed to publish job to favorites. Please try again');
				} else {
					delete Session.keys['publishToFav'];
					toastr.success('An invitation has been sent to your favorite providers to apply for this job.');
				}
			})
		});
	},
	'click .saveAsDraft': function(event, template) {
		var favProviders = Users.findOne({_id: Meteor.userId()}).favoriteUsers;
		Session.set('saveAsDraft', true);
		Jobs.before.insert(function(userId, doc) {
			if(!Session.get('saveAsDraft2'))
				return;
			doc.status = 'draft';
			delete Session.keys['saveAsDraft'];
		})
	}
});