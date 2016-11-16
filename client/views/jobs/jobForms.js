AutoForm.addHooks(['jobNew', 'jobEdit', 'duplicateJob', 'assignJob'], {
	after: {
		insert: function(error, result) {
			if (error) {
				toastr.error(error);
				Session.set('insertError', true);
			} else {
				analytics.track("Job Created");
				toastr.success('The job has been posted and your account has been debited with the proposed budget.');
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
	var accountBalance;
	if(Roles.userIsInRole(Meteor.userId(), ['dispatcher'])) {
		accountBalance = Wallet.findOne({userId: Meteor.user().invitedBy}).accountBalance;
	} else {
		accountBalance = Wallet.findOne({userId: Meteor.userId()}).accountBalance;
	}
	if(this.data.job.your_cost > accountBalance) {
		$('.notEnoughBalance').show();
		$('.publish').prop('disabled', true);
		$('#dupToFav').prop('disabled', true);
		$('.dupInviteIndividual').prop('disabled', true);
	} else {
		$('enoughBalance').show();
		$('.publish').prop('disabled', false);
		$('.duplicateToFavs').prop('disabled', false);
		$('.dupInviteIndividual').prop('disabled', false);
	}
}

Template.duplicateJob.events({
	'click #dupJob': function(event, template) {
		$('#dupToFav').prop('disabled', true);
		$('#dupInvInd').prop('disabled', true);
	},
	'click .dupPublishInd': function(event, template) {
		event.preventDefault();
	},
	'click .dupInviteIndividual': function(event, template) {
		var individualProvider = $('input[name="individualprovider"]')[0].id;
		Session.set('publishToIndividual', true);
		Jobs.before.insert(function(userId, doc) {
			$(event.target).prop('disabled', true);
			if(!Session.get('publishToIndividual'))
				return;
			if(Session.get('insertError')) {
				$(event.target).prop('disabled', false);
				$('button.duplicate').prop('disabled', false);
				$('button.duplicateToFavs').prop('disabled', false);
				return;
			}
			doc.invited = true;
			doc.individualprovider = individualProvider;
		});
		Jobs.after.insert(function(userId, doc) {
			if(!Session.get('publishToIndividual'))
				return;
			if(Session.get('insertError'))
				return;
			Meteor.call('publishToIndividualUpdate', doc, function(error) {
				if(error) {
					toastr.error('Failed to publish to the individual. Please try again.');
				} else {
					delete Session.keys['publishToIndividual'];
					toastr.success('An invitation has been sent to the individual to apply for this job.');
				}
			})
		})
	},
	'click .duplicateToFavs': function(event, template) {
		var favProviders = Users.findOne({_id: Meteor.userId()}).favoriteUsers;
 		Session.set('duplicateToFav', true);
 		Jobs.before.insert(function(userId, doc) {
			$(event.currentTarget).prop('disabled', true);
			$('.dupPublishInd').prop('disabled', true);
			$('.duplicate').prop('disabled', true);
 			if(!Session.get('duplicateToFav'))
 				return;
 			doc.invited = true;
 			doc.favoriteProviders = [];
 			for(var i = 0; i < favProviders.length; i++) {
 				doc.favoriteProviders.push(favProviders[i]);
 			}
		});
		Jobs.after.insert(function(userId, doc) {
 			if(!Session.get('duplicateToFav'))
 				return;
 			doc.invited = true;
 			Meteor.call('publishToFavsUpdate', doc, function(error) {
 				if(error) {
 					toastr.error('Failed to publish job to favorites. Please try again');
 				} else {
 					delete Session.keys['duplicateToFav'];
 				}
 			})
		});
	}
})

Template.jobFields.rendered = function() {
  	$('#spinner').hide();
  	$('.fileUploadProgress').hide();
	Meteor.typeahead.inject('.typeahead');
	$('.note-editor .note-toolbar .note-insert').remove();
}

Template.providerList.rendered = function() {
	Meteor.typeahead.inject('.proTypeahead');
}

var locLoaded=false;
var proLoaded = false;

Template.jobFields.events({
	'click button#uploadDocs': function(event, template) {
		event.preventDefault();
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
		if(paidBy == 'You') {
			$('input[name="your_cost"]').val(fixedamount + (fixedamount * 5/100));
			$('input[name="freelancer_nets"]').val(fixedamount);
		} else if(paidBy == 'Provider') {
			$('input[name="your_cost"]').val(fixedamount);
			$('input[name="freelancer_nets"]').val(fixedamount - (fixedamount * 5/100));
		}
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			$('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			$('div.enoughBalance').show();
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
		if(paidBy == 'You') {
			$('input[name="your_cost"]').val(totalamount + (totalamount * 5/100));
			$('input[name="freelancer_nets"]').val(totalamount);
		} else if(paidBy == 'Provider') {
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(totalamount - (totalamount * 5/100));
		}
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			$('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			$('div.enoughBalance').show();
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
		if(paidBy == 'You') {
			$('input[name="your_cost"]').val(totalamount + (totalamount * 5/100));
			$('input[name="freelancer_nets"]').val(totalamount);
		} else if(paidBy == 'Provider') {
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(totalamount - (totalamount * 5/100));
		}
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			$('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			$('div.enoughBalance').show();
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
		if(paidBy == 'You') {
			$('input[name="your_cost"]').val(totalamount + (totalamount * 5/100));
			$('input[name="freelancer_nets"]').val(totalamount);
		} else if(paidBy == 'Provider') {
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(totalamount - (totalamount * 5/100));
		}
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			$('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			$('div.enoughBalance').show();
			$('div.notEnoughBalance').hide();
			$('button[type="submit"]').prop('disabled', false);
		}
	},
	'change input[value="You"]': function(event, template) {
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
			$('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			$('div.enoughBalance').show();
			$('div.notEnoughBalance').hide();
			$('button[type="submit"]').prop('disabled', false);
		}
	},
	'change input[value="Provider"]': function(event, template) {
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
			$('div.enoughBalance').hide();
			$('button[type="submit"]').prop('disabled', true);
		} else {
			$('div.enoughBalance').show();
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

Template.providerList.helpers({
	individualprovider: function(query, sync, callback) {
		if(!proLoaded)
			$('.proTypeahead').addClass('loadinggif');
		Meteor.call('individualprovider', query, {}, function(err, res) {
			if(err) {
				console.log(err);
				return;
			}
			callback(res.map(function(v) {
				proLoaded = true;
				$('.proTypeahead').removeClass('loadinggif');
				return {value: v.firstName + ' ' + v.lastName, id: v.userId, readableId: Meteor.users.findOne({_id: v.userId}).readableID, title: v.title};
			}))
		})
	},
	select: function(e, suggestion, dataset) {
		$(e.currentTarget).prop('id', suggestion.id);
	}
})

Template.jobNew.events({
	'click #pubNew': function(event, template) {
		$('#pubFav').prop('disabled', true);
		$('#pubInd').prop('disabled', true);
		if(Session.get('insertError')) {
			$('#pubFav').prop('disabled', false);
			$('#pubInd').prop('disabled', false);
		}
	},
	'click .publishToFavs': function(event, template) {
		var favProviders = Users.findOne({_id: Meteor.userId()}).favoriteUsers;
 		Session.set('publishToFav', true);
 		Jobs.before.insert(function(userId, doc) {
 			$('button.publish').prop('disabled', true);
 			$('button.publishInd').prop('disabled', true);
			$(event.currentTarget).prop('disabled', true);
 			if(!Session.get('publishToFav'))
 				return;
 			if(Session.get('insertError')) {
 				$('button.publish').prop('disabled', false);
 				$('button.publishInd').prop('disabled', false);
 				$(event.currentTarget).prop('disabled', false);
 				return;
 			}
 			doc.invited = true;
 			doc.favoriteProviders = [];
 			for(var i = 0; i < favProviders.length; i++) {
 				doc.favoriteProviders.push(favProviders[i]);
 			}
		});
		Jobs.after.insert(function(userId, doc, res) {
 			if(!Session.get('publishToFav'))
 				return;
 			if(Session.get('insertError'))
 				return;
 			doc.invited = true;
 			Meteor.call('publishToFavsUpdate', doc, function(error) {
 				if(error) {
 					toastr.error('Failed to publish job to favorites. Please try again');
 				} else {
 					delete Session.keys['publishToFav'];
 				}
 			})
		});
	},
	'click .publishInd': function(event, template) {
		event.preventDefault();
	},
	'click .inviteIndividual': function(event, template) {
		var individualProvider = $('input[name="individualprovider"]')[0].id;
		Session.set('publishToIndividual', true);
		Jobs.before.insert(function(userId, doc) {
			$(event.target).prop('disabled', true);
			$('button.publish').prop('disabled', true);
 			$('button.publishToFavs').prop('disabled', true);
			if(!Session.get('publishToIndividual'))
				return;
			if(Session.get('insertError')) {
				$('button.publish').prop('disabled', false);
 				$('button.publishToFavs').prop('disabled', false);
 				$(event.currentTarget).prop('disabled', false);
				return;
			}
			doc.invited = true;
			doc.individualprovider = individualProvider;
		});
		Jobs.after.insert(function(userId, doc) {
			if(!Session.get('publishToIndividual'))
				return;
			if(Session.get('insertError'))
				return;
			Meteor.call('publishToIndividualUpdate', doc, function(error) {
				if(error) {
					toastr.error('Failed to publish to the individual. Please try again.');
				} else {
					delete Session.keys['publishToIndividual'];
				}
			})
		})
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