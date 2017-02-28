AutoForm.addHooks(['jobNew', 'jobEdit', 'duplicateJob', 'assignJob'], {
	after: {
		insert: function(error, result) {
			if (error) {
				toastr.error(error);
				$('button#submitJob').button('reset');
			} else {
				analytics.track("Job Created");
        		Router.go('job', {_id:result});
        		var jobDetails = Jobs.findOne({_id: result});
        		var providerEmails = [];
        		var providerSmsAddresses = [];
        		var providers = Profiles.find({}).fetch();
        		for(var i = 0; i < providers.length; i++) {
        			providerEmails.push(providers[i].userName);
        			providerSmsAddresses.push(providers[i].smsAddress)
        		}
        		if(jobDetails.routed) {
        			var providerDetails = Profiles.findOne({userId: jobDetails.selectedProvider});
					var buyerDetails;
					if(Roles.userIsInRole(jobDetails.userId, ['buyer']))
						buyerDetails = Buyers.findOne({userId: jobDetails.userId});
					else if(Roles.userIsInRole(jobDetails.userId, ['dispatcher']))
						buyerDetails = Dispatchers.findOne({userId: jobDetails.userId});
					Meteor.call('routeEmail', buyerDetails, providerDetails, jobDetails);
        		}
        		toastr.success('Account Debited: ' + jobDetails.buyerCost + ' USD');
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

Template.duplicateJob.onCreated(function() {
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
});

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
		$('input[name="totalfromclient"]').val(+(Math.round(fixedamount + 'e+2') + 'e-2'));
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'buyer') {
			var yourCost = fixedamount + (fixedamount * 5/100)
			$('input[name="your_cost"]').val(+(Math.round(yourCost + 'e+2') + 'e-2'));
			$('input[name="freelancer_nets"]').val(+(Math.round(fixedamount + 'e+2') + 'e-2'));
		} else if(paidBy == 'provider') {
			var providerNets = fixedamount - (fixedamount * 5/100)
			$('input[name="your_cost"]').val(+(Math.round(fixedamount + 'e+2') + 'e-2'));
			$('input[name="freelancer_nets"]').val(+(Math.round(providerNets + 'e+2') + 'e-2'));
		}
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			$('button[type="submit"]').prop('disabled', true);
		} else {
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
		$('input[name="totalfromclient"]').val(+(Math.round(totalamount + 'e+2') + 'e-2'));
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'buyer') {
			var yourCost = totalamount + (totalamount * 5/100)
			$('input[name="your_cost"]').val(+(Math.round(yourCost + 'e+2') + 'e-2'));
			$('input[name="freelancer_nets"]').val(+(Math.round(totalamount + 'e+2') + 'e-2'));
		} else if(paidBy == 'provider') {
			var providerNets = totalamount - (totalamount * 5/100)
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(+(Math.round(providerNets + 'e+2') + 'e-2'));
		}
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			$('button[type="submit"]').prop('disabled', true);
		} else {
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
		$('input[name="totalfromclient"]').val(+(Math.round(totalamount + 'e+2') + 'e-2'));
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'buyer') {
			var yourCost = totalamount + (totalamount * 5/100)
			$('input[name="your_cost"]').val(+(Math.round(yourCost + 'e+2') + 'e-2'));
			$('input[name="freelancer_nets"]').val(+(Math.round(totalamount + 'e+2') + 'e-2'));
		} else if(paidBy == 'provider') {
			var providerNets = totalamount - (totalamount * 5/100)
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(+(Math.round(providerNets + 'e+2') + 'e-2'));
		}
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			$('button[type="submit"]').prop('disabled', true);
		} else {
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
		$('input[name="totalfromclient"]').val(+(Math.round(totalamount + 'e+2') + 'e-2'));
		var paidBy = $('input[name="paidby"]:checked').val();
		if(paidBy == 'buyer') {
			var yourCost = totalamount + (totalamount * 5/100)
			$('input[name="your_cost"]').val(+(Math.round(yourCost + 'e+2') + 'e-2'));
			$('input[name="freelancer_nets"]').val(+(Math.round(totalamount + 'e+2') + 'e-2'));
		} else if(paidBy == 'provider') {
			var providerNets = totalamount - (totalamount * 5/100)
			$('input[name="your_cost"]').val(totalamount);
			$('input[name="freelancer_nets"]').val(+(Math.round(providerNets + 'e+2') + 'e-2'));
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
		$('input[name="your_cost"]').val(+(Math.round(clientCost + 'e+2') + 'e-2'))
		$('input[name="freelancer_nets"]').val(+(Math.round(totalamount + 'e+2') + 'e-2'))
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			$('button[type="submit"]').prop('disabled', true);
		} else {
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
		$('input[name="your_cost"]').val(+(Math.round(totalamount + 'e+2') + 'e-2'))
		$('input[name="freelancer_nets"]').val(+(Math.round(freenet + 'e+2') + 'e-2'))
		if($('input[name="your_cost"]').val() > accountBalance) {
			$('div.notEnoughBalance').show();
			$('button[type="submit"]').prop('disabled', true);
		} else {
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
                var jobId = Router.current().params._id;
                if(Router.current().params.userId) {
                    var files = [];
                    var fileListItem = '<li data-url='+result.secure_url+'><i class="fa fa-times-circle remove-file" aria-hidden="true" title="Remove" style="cursor: pointer;" onclick="removeJobFile(\''+result.secure_url+'\')"></i> <a href='+result.secure_url+' target="_blank">'+result.file.original_name+'</a></li>'
                    $('.fileList').append(fileListItem);
                    $('ul.fileList li').each(function(li) {
                        var fileDetails = {
                            file_url: $(this).data('url'),
                            file_name: result.file.original_name
                        }
                        files.push(fileDetails);
                    });
                    Jobs.before.insert(function(userId, doc) {
                    	doc.files = files;
                    })
                } else if(jobId) {
                	var fileDetails = {
                		file_url: result.secure_url,
                		file_name: result.file.original_name
                	}
                	Meteor.call('addJobFile', fileDetails, jobId);
                } else {
                    var files = [];
                    var fileListItem = '<li data-url='+result.secure_url+'><i class="fa fa-times-circle remove-file" aria-hidden="true" title="Remove" style="cursor: pointer;" onclick="removeJobFile(\''+result.secure_url+'\')"></i> <a href='+result.secure_url+' target="_blank">'+result.file.original_name+'</a></li>'
                    $('.fileList').append(fileListItem);
                    $('ul.fileList li').each(function(li) {
                        var fileDetails = {
                            file_url: $(this).data('url'),
                            file_name: result.file.original_name
                        }
                        files.push(fileDetails);
                    });
                    Jobs.before.insert(function(userId, doc) {
                    	doc.files = files;
                    })
                }
            }
        })        
    },
    'click .remove-job-file' : function(event, template) {
        event.preventDefault();
        $('#spinner').show();
        var url = $(event.currentTarget).data('url');
        if(Router.current().route.getName() == 'duplicateJob') {
        	$("ul.fileList").find("[data-url='"+url+"']").parent().remove();
        	$('#spinner').hide();
        	return;
        }
        var jobId = Router.current().params._id;        
        var index = url.indexOf(S3_FILEUPLOADS)-1;
        var path = url.substr(index);
        S3.delete(path, function(err, res) {
            $('#spinner').hide();
            if (err) {
                toastr.error("Operation failed");
            } else {
                Meteor.call('deleteJobFile', url, jobId);
            }
        });
        event.stopPropagation();
    }
});

Array.prototype.pushArray = function(files) {
	files.push.apply(files, files.concat.apply([], arguments));
};

removeJobFile = function(url) {
	$('#spinner').show();
    var index = url.indexOf(S3_FILEUPLOADS)-1;
    var path = url.substr(index);
    S3.delete(path, function(err, res) {
      if (err) {
        toastr.error("Operation failed");
      } else {
      	$('#spinner').hide();
        $("ul.fileList").find("[data-url='"+url+"']").remove();
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
		if(publishTo == 'favProviders') {
			var favoriteUsers = Meteor.users.findOne({_id: Meteor.userId()}).favoriteUsers;
			if(!favoriteUsers || favoriteUsers.length < 1) {
				$('.noFavProviders').show();
				$('#submitJob').attr('disabled', 'disabled');
			} else {
				$('.noFavProviders').hide();
				$('#submitJob').removeAttr('disabled');
			}
		} else {
			$('.noFavProviders').hide();
			$('#submitJob').removeAttr('disabled');
		}
	},
	'click #submitJob': function(event, template) {
		var publishTo = $('input[name="publishJob"]:checked').val();
		$(event.currentTarget).button('loading');
		var buyerDetails;
		if(Roles.userIsInRole(Meteor.userId(), ['buyer']))
			buyerDetails = Buyers.findOne({userId: Meteor.userId()});
		else if(Roles.userIsInRole(Meteor.userId(), ['dispatcher']))
			buyerDetails = Dispatchers.findOne({userId: Meteor.userId()});
		if(publishTo == 'allProviders') {
			Session.set('publishToAll', true);
			Session.set('publishToFav', false);
			Session.set('publishToIndividual', false);
			var providerEmails = [];
    		var providerSmsAddresses = [];
    		var providers = Profiles.find({}).fetch();
    		for(var i = 0; i < providers.length; i++) {
    			providerEmails.push(providers[i].userName);
    			providerSmsAddresses.push(providers[i].smsAddress)
    		}
			Jobs.after.insert(function(userId, doc, res) {
				if(!Session.get('publishToAll')) {
					$(event.currentTarget).button('reset');
					return;
				}
				providers.length = 0;
				Meteor.call('openJobEmails', doc, buyerDetails, providerEmails, providerSmsAddresses);
				delete Session.keys['publishToAll'];
			})
		}
		else if(publishTo == 'favProviders') {
			Session.set('publishToAll', false);
			Session.set('publishToFav', true);
			Session.set('publishToIndividual', false);
			var favProviders = Users.findOne({_id: Meteor.userId()}).favoriteUsers;
			var providerEmails = [];
			var providerSmsAddresses = [];
			for(var i = 0; i < favProviders.length; i++) {
				providerEmails.push(Profiles.findOne({userId: favProviders[i]}).userName);
				providerSmsAddresses.push(Profiles.findOne({userId: favProviders[i]}).smsAddress);
			}
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
	 					Meteor.call('favProvidersEmail', doc, buyerDetails, providerEmails, providerSmsAddresses);
	 					delete Session.keys['publishToFav'];
	 				}
	 			})
			});
		}
		else if(publishTo == 'selectedProviders') {
			Session.set('publishToAll', false);
			Session.set('publishToFav', false);
			Session.set('publishToIndividual', true);
			var individualProviders = $('select[name="invitedproviders"]').val();
			var providerEmails = [];
			var providerSmsAddresses = [];
			for(var i = 0; i < individualProviders.length; i++) {
				providerEmails.push(Profiles.findOne({userId: individualProviders[i]}).userName);
				providerSmsAddresses.push(Profiles.findOne({userId: individualProviders[i]}).smsAddress);
			}
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
						Meteor.call('individualProviderEmail', doc, buyerDetails, providerEmails, providerSmsAddresses);
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