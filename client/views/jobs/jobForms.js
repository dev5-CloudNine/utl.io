AutoForm.addHooks(['jobNew', 'jobEdit', 'duplicateJob', 'assignJob'], {
	after: {
		insert: function(error, result) {
			if (error) {
				toastr.error(error);
				$('button#submitJob').button('reset');
			} else {
				analytics.track("Job Created");
        		Router.go('job', {_id:result});
			}
		},
		update: function(error, result) {
			if (error) {
				toastr.error("Update Error:", error);
			} else {
				analytics.track("Job Edited");
				Router.go('job', {_id: Router.current().params._id});
			}
		}
	}
});

Template.duplicateJob.rendered = function() {
	var jobBudget = this.data.job.your_cost;
	this.autorun(function() {
		var accountBalance;
		if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
			accountBalance = Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
		} else {
			accountBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
		}
		if(jobBudget > accountBalance) {
			$('.notEnoughBalance').show();
		}
	})
}

Template.jobFields.rendered = function() {
  	$('#spinner').hide();
  	$('.fileUploadProgress').hide();
	Meteor.typeahead.inject('.typeahead');
	$('.note-editor .note-toolbar .note-insert').remove();
}

var locLoaded=false;
var proLoaded = false;

Template.jobFields.events({
	'click button#uploadDocs': function(event, template) {
		event.preventDefault();
	},
	'click .hidelessbalalert': function(event, template) {
		$(event.currentTarget).parent().hide();
	},
	'change input[name="fixedamount"], keyup input[name="fixedamount"]': function(event, template) {
		var fixedamount = parseFloat($('input[name="fixedamount"]').val());
		var accountBalance;
		if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
			accountBalance = Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
		} else {
			accountBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
		}
		$('input[name="totalfromclient"]').val(fixedamount);
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'buyer') {
			$('input[name="your_cost"]').val(fixedamount + (fixedamount * 5/100));
			$('input[name="freelancer_nets"]').val(fixedamount);
		} else if(paidBy == 'provider') {
			$('input[name="your_cost"]').val(fixedamount);
			$('input[name="freelancer_nets"]').val(fixedamount - (fixedamount * 5/100));
		}
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			// $('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			// $('div.enoughBalance').show();
			$('div.notEnoughBalance').hide();
			$('button[type="submit"]').prop('disabled', false);
		}
	},
	'change input[name="hourlyrate"], keyup input[name="hourlyrate"], change input[name="maxhours"], keyup input[name="maxhours"]': function(event, template) {
		var hourlyrate = parseFloat($('input[name="hourlyrate"]').val());
		var maxhours = parseFloat($('input[name="maxhours"]').val());
		var accountBalance;
		if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
			accountBalance = Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
		} else {
			accountBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
		}
		var totalamount = hourlyrate * maxhours;
		$('input[name="totalfromclient"]').val(totalamount);
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'buyer') {
			$('input[name="your_cost"]').val(totalamount + (totalamount * 5/100));
			$('input[name="freelancer_nets"]').val(totalamount);
		} else if(paidBy == 'provider') {
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(totalamount - (totalamount * 5/100));
		}
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			// $('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			// $('div.enoughBalance').show();
			$('div.notEnoughBalance').hide();
			$('button[type="submit"]').prop('disabled', false);
		}
	},
	'change input[name="rateperdevice"], keyup input[name="rateperdevice"], change input[name="maxdevices"], keyup input[name="maxdevices"]': function(event, template) {
		var rateperdevice = parseFloat($('input[name="rateperdevice"]').val());
		var maxdevices = parseFloat($('input[name="maxdevices"]').val());
		var accountBalance;
		if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
			accountBalance = Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
		} else {
			accountBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
		}
		var totalamount = rateperdevice * maxdevices;
		$('input[name="totalfromclient"]').val(totalamount);
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'buyer') {
			$('input[name="your_cost"]').val(totalamount + (totalamount * 5/100));
			$('input[name="freelancer_nets"]').val(totalamount);
		} else if(paidBy == 'provider') {
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(totalamount - (totalamount * 5/100));
		}
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			// $('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			// $('div.enoughBalance').show();
			$('div.notEnoughBalance').hide();
			$('button[type="submit"]').prop('disabled', false);
		}
	},
	'change input[name="payforfirsthours"], keyup input[name="payforfirsthours"], change input[name="payfornexthours"], keyup input[name="payfornexthours"], change input[name="nexthours"], keyup input[name="nexthours"]': function(event, template) {
		var payforfirsthours = $('input[name="payforfirsthours"]').val();
		var firsthours = $('input[name="firsthours"]').val();
		var payfornexthours = $('input[name="payfornexthours"]').val();
		var nexthours = $('input[name="nexthours"]').val();
		var accountBalance;
		if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
			accountBalance = Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
		} else {
			accountBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
		}
		var totalforfirsthours = parseFloat(payforfirsthours);
		var totalfornexthours = payfornexthours * nexthours;
		var totalamount = parseFloat(totalforfirsthours + totalfornexthours);
		$('input[name="totalfromclient"]').val(totalamount);
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'buyer') {
			$('input[name="your_cost"]').val(totalamount + (totalamount * 5/100));
			$('input[name="freelancer_nets"]').val(totalamount);
		} else if(paidBy == 'provider') {
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(totalamount - (totalamount * 5/100));
		}
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			// $('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			// $('div.enoughBalance').show();
			$('div.notEnoughBalance').hide();
			$('button[type="submit"]').prop('disabled', false);
		}
	},
	'change input[value="buyer"]': function(event, template) {
		event.preventDefault();
		var totalamount = parseFloat(template.find('input[name="totalfromclient"]').value);
		var clientCost = totalamount + totalamount * 5/100;
		var accountBalance;
		if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
			accountBalance = Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
		} else {
			accountBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
		}
		template.find('input[name="your_cost"]').value = clientCost;
		template.find('input[name="freelancer_nets"]').value = totalamount;
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			// $('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			// $('div.enoughBalance').show();
			$('div.notEnoughBalance').hide();
			$('button[type="submit"]').prop('disabled', false);
		}
	},
	'change input[value="provider"]': function(event, template) {
		event.preventDefault();
		var totalamount = parseFloat(template.find('input[name="totalfromclient"]').value);
		var freenet = totalamount - totalamount * 5/100;
		var accountBalance;
		if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
			accountBalance = Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
		} else {
			accountBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
		}
		template.find('input[name="your_cost"]').value = totalamount;
		template.find('input[name="freelancer_nets"]').value = freenet;
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			// $('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			// $('div.enoughBalance').show();
			$('div.notEnoughBalance').hide();
			$('button[type="submit"]').prop('disabled', false);
		}
	},
	'change select[name="jobtype"]': function(event, instance) {
		var parentId = $(event.target).val();
		instance.selParent.set(parentId);
	},
	'change .file_bag': function(event, template){
		event.preventDefault();
		$('.fileUploadProgress').show();
		var files = $(event.currentTarget)[0].files;
		if(!files)
			return;
		S3.upload({
			files: files,
			path: S3_FILEUPLOADS
		}, function(error, result) {
			$('.fileUploadProgress').hide();
			if(error) {
				toastr.error('Failed to upload documents.');
			}
			else {
				var jobID = Router.current().params._id;
				if(Router.current().params.userId) {
					var files = [];
					var fileListItem = '<div class="thumbnail" data-url=' + result.secure_url + '><span title="Remove" class="close-preview" style="cursor: pointer;" onclick="removeFile(\''+result.secure_url+'\')">&times;</span><a href=' + result.secure_url + ' target="_blank">' + result.file.original_name + '</a><div class="caption" style="overflow: hidden; word-wrap: break-word"><a href=' + result.secure_url + ' + target="_blank">' + result.file.original_name + '</a></div></div>'
					$('.fileList').append(fileListItem);
					$('div.fileList div.thumbnail').each(function(li) {
						var fileDetails = {
							file_url: $(this).data('url'),
							file_name: result.file.original_name
						}
						files.push(fileDetails);
					})
					Jobs.before.insert(function(userId, doc) {
						doc.files = files;
					});
					$('#uploadJobDocs').modal('hide');
				} else if(jobID) {
					var fileDetails = {
						file_url: result.secure_url,
						file_name: result.file.original_name
					}
		            Meteor.call('addJobFile', fileDetails, jobID,function (error, result) {
		            	if(!error)
		            		$('#uploadJobDocs').modal('hide');
		            });
				} else {
					var files = [];
					var fileListItem = '<div class="col-md-2"><div class="thumbnail" data-url=' + result.secure_url + ' style="position:relative;"><span title="Remove" class="close-preview" style="cursor: pointer;" onclick="removeFile(\''+result.secure_url+'\')">&times;</span><a href=' + result.secure_url + ' target="_blank"><img src=' + result.secure_url + ' style="height: 100px" onerror=this.src="/images/genericFile.jpg"></a><div class="caption" style="overflow: hidden; word-wrap: break-word"><a href=' + result.secure_url + ' + target="_blank">' + result.file.original_name + '</a></div></div></div>'
					$('.fileList').append(fileListItem);
					$('div.fileList div.thumbnail').each(function(li) {
						var fileDetails = {
							file_url: $(this).data('url'),
							file_name: result.file.original_name
						}
						files.push(fileDetails);
					});
					Jobs.before.insert(function(userId, doc) {
						doc.files = files;
					});
					$('#uploadJobDocs').modal('hide');
				}
			}
			var fileDetails = {
				file_url: result.secure_url,
				file_name: result.file.original_name
			}
			Meteor.call('addFileToUserFM', fileDetails, Meteor.userId());
		})
	},
	'click .remove-job-file' : function(event, template) {
	    event.preventDefault();
	    $('#spinner').show();
		var jobID = Router.current().params._id;
	    var url = $(event.currentTarget).data('url');
	 //    var index = url.indexOf(S3_FILEUPLOADS)-1;
	 //    var path = url.substr(index);
	 //    S3.delete(path, function(err, res) {
	 //        $('#spinner').hide();
	 //        if (err) {
	 //            toastr.error("Operation failed");
	 //        } else {
	 //            Meteor.call('deleteJobFile', url, jobID, Meteor.userId(), function (error, result) {
	 //                if(!error)
	 //                  toastr.success("Deleted");
	 //            });
	 //        }
	 //    });
	 //    event.stopPropagation();
	 	Meteor.call('deleteJobFile', url, jobID, Meteor.userId(), function(error, result) {
	 		if(!error) {
	 			$('#spinner').hide();
	 		}
	 	});
	 	event.stopPropagation();
	},
	'click .removeUserFile': function(event, template) {
		event.preventDefault();
		var url = $(event.currentTarget).data('url');
		var index = url.indexOf(S3_FILEUPLOADS)-1;
		var path = url.substr(index);
		S3.delete(path, function(err, res) {
			if(err) {
				toastr.error('Operation failed');
			} else {
				Meteor.call('removeUserFile', url, Meteor.userId(), function(error, result) {
					if(!error)
						toastr.success('Removed file from your file manager');
				})
			}
		})
	},
	'click .attachSelected': function(event, template) {
		var selected = $('input[name="select_files"]:checked');
		if(selected.length <= 0)
			toastr.error('Please select file(s) to attach.');
		else {
			for(var i = 0; i < selected.length; i++) {
				var fileUrl = $(selected[i]).data('url');
				var fileName = $(selected[i]).data('file-name');
				var jobId = Router.current().params._id;
				if(Router.current().params.userId) {
					var files = [];
					var fileListItem = '<div class="thumbnail" data-url=' + fileUrl + '><span title="Remove" class="close-preview" style="cursor: pointer;" onclick="removeFile(\''+fileUrl+'\')">&times;</span><a href=' + fileUrl + ' target="_blank">' + fileName + '</a><div class="caption" style="overflow: hidden; word-wrap: break-word"><a href=' + fileUrl + ' + target="_blank">' + fileName + '</a></div></div>'
					$('.fileList').append(fileListItem);
					$('div.fileList div.thumbnail').each(function(li) {
						var fileDetails = {
							file_url: fileUrl,
							file_name: fileName
						}
						files.push(fileDetails);
					})
					Jobs.before.insert(function(userId, doc) {
						doc.files = files;
					});
					$('#uploadJobDocs').modal('hide');
				} else if(jobId) {
					var fileDetails = {
						file_url: fileUrl,
						file_name: fileName
					}
					Meteor.call('addJobFile', fileDetails, jobId,function (error, result) {
						if(!error)
							$('#uploadJobDocs').modal('hide')
		            });		            
				} else {
					var files = [];
					var fileListItem = '<div class="col-md-2"><div class="thumbnail" data-url=' + fileUrl + ' style="position:relative;"><span title="Remove" class="close-preview" style="cursor: pointer;" onclick="removeFile(\''+fileUrl+'\')">&times;</span><a href=' + fileUrl + ' target="_blank"><img src=' + fileUrl + ' style="height: 100px" onerror=this.src="/images/genericFile.jpg"></a><div class="caption" style="overflow: hidden; word-wrap: break-word"><a href=' + fileUrl + ' + target="_blank">' + fileName + '</a></div></div></div>'
					$('.fileList').append(fileListItem);
					$('div.fileList div.thumbnail').each(function(li) {
						var fileDetails = {
							file_url: fileUrl,
							file_name: fileName
						}
						files.push(fileDetails);
					});
					Jobs.before.insert(function(userId, doc) {
						doc.files = files;
					});
					$('#uploadJobDocs').modal('hide');
				}
			}
		}
	}
});

Array.prototype.pushArray = function(files) {
	files.push.apply(files, files.concat.apply([], arguments));
};

removeFile = function(url) {
	$('#spinner').show();
	// var index = url.indexOf(S3_FILEUPLOADS)-1;
	// var path = url.substr(index);
	// S3.delete(path, function(err, res) {
	// 	$('#spinner').hide();
	// 	if (err) {
	// 		toastr.error("Operation failed");
	// 	} else {
	// 		$("div.fileList").find("[data-url='"+url+"']").remove();
	// 		toastr.success('Document is deleted successfully');
	// 	}
	// });
	$("div.fileList").find("[data-url='"+url+"']").remove();
	toastr.success('Document is deleted successfully');
	$('#spinner').hide();
}

Template.jobFields.created = function() {
	if(this.data) {
		this.selParent = new ReactiveVar(this.data.job.jobtype);
	} else {
		this.selParent = new ReactiveVar(null);
	}
}

Template.jobFields.helpers({
	userDocuments: function() {
		var fileManager = FileManager.findOne({userId: Meteor.userId()});
		if(fileManager.files) {
			return fileManager.files;
		}
	},
	locationData : function(){
		locLoaded = true;
		return this.job.location;
	},
	providerData: function() {
		proLoaded = true;
		return this.job.individualprovider;
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
				return { value: v.city + ", " + v.state + ", " + v.zip}; 
			}));
		});
	},
	parentCategories: function() {
		return Categories.find().fetch();
	},
	childCategories: function () {
		var parentId = Template.instance().selParent.get();
		return parentId ? SubCategories.find({parentId: parentId}).fetch() : null;
	},
	files: function() {
		if(!this.job) return [];
		return Jobs.findOne({_id:this.job._id}).files;
	},
	uploadedFiles: function() {
		return S3.collection.find();
	}
});

Template.submitButtons.events({
	'change input[name="publishJob"]': function(event, template) {
		var publishTo = $(event.currentTarget).val();
		console.log(publishTo);
		if(publishTo == 'selectedProviders')
			$('#publishIndividual').show();
		else
			$('#publishIndividual').hide();
		if(publishTo == 'assignToProvider')
			$('#assignToAProvider').show();
		else
			$('#assignToAProvider').hide();
		if(publishTo == 'favProviders') {
			var favoriteUsers = Meteor.users.findOne({_id: Meteor.userId()}).favoriteUsers;
			if(!favoriteUsers || favoriteUsers.length < 1) {
				$('.noFavProviders').show();
				$('#submitJob').attr('disabled', 'disabled');
			} else {
				$('.noFavProviders').hide();
				$('#submitJob').removeAttr('disabled');
			}
		}
	},
	'click #submitJob': function(event, template) {
		var publishTo = $('input[name="publishJob"]:checked').val();
		$(event.currentTarget).button('loading');
		if(publishTo == 'favProviders') {
			Session.set('publishToFav', true);
			var favProviders = Users.findOne({_id: Meteor.userId()}).favoriteUsers;
			Jobs.after.insert(function(userId, doc, res) {
				if(!Session.get('publishToFav')) {
					$(event.currentTarget).button('reset');
					return;
				}
	 			Meteor.call('publishToFavsUpdate', doc, favProviders, function(error) {
	 				if(error) {
	 					toastr.error('Failed to publish job to your favorite providers. Please try again');
	 					$(event.currentTarget).button('reset');
	 				} else {
	 					favProviders.length = 0;
	 					delete Session.keys['publishToFav'];
	 				}
	 			})
			});
		}
		else if(publishTo == 'selectedProviders') {
			Session.set('publishToIndividual', true);
			var individualProviders = $('select[name="invitedproviders"]').val();
			Jobs.after.insert(function(userId, doc) {
				if(!Session.get('publishToIndividual')) {
					$(event.currentTarget).button('reset');
					return;
				}
				Meteor.call('publishToIndividualUpdate', doc, individualProviders, function(error) {
					if(error) {
						$(event.currentTarget).button('reset');
						toastr.error('Failed to publish to the chosen providers. Please try again.');
					} else {
						individualProviders.length = 0;
						delete Session.keys['publishToIndividual'];
					}
				})
			})
		}
	}
})

Template.jobNew.events({
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

Template.jobLocationMap.onRendered(function() {
  this.autorun(() => {
    if(GoogleMaps.loaded()) {
      $('#loc').geocomplete({
      	country: 'us',
      	details: '#locationDetails'
      })
    }
  })
});

Template.jobLocationMap.helpers({
	locationData : function(){
		locLoaded = true;
		if(this.job)
		return this.job.location;
		return;
	}
})