Profiles.after.insert(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isDeveloper: true
    }
  });
});

Profiles.after.remove(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isDeveloper: false,
      imgURL: ""
    }
  });
});

Buyers.after.insert(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isBuyer: true
    }
  });
});

Buyers.after.remove(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isBuyer: false,
      imgURL: ""
    }
  });
});

Dispatchers.after.insert(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isDispatcher: true
    }
  });
});

Accountants.after.insert(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isAccountant: true
    }
  })
})

Corporates.after.insert(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isCorporate: true
    }
  });
});

Corporates.after.remove(function(userId, doc) {
  Users.update({
    _id: doc.userId
  }, {
    $set: {
      isCorporate: false
    }
  });
});

Jobs.after.remove(function(userId, doc) {
  TimeSheet.remove({'jobID':doc._id});
  Tasks.remove({'jobID':doc._id});
});


Jobs.after.insert(function(userId, doc){
  var obj ={};
  var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
  var inviterId = Meteor.users.findOne({_id: doc.userId}).invitedBy;
  var buyerCost = doc.your_cost;
  if(Roles.userIsInRole(doc.userId, ['dispatcher'])) {
    Wallet.update({userId: inviterId}, {$inc: {accountBalance: -buyerCost}});
    Wallet.update({userId: adminId}, {$inc: {accountBalance: buyerCost}});
  } else {
    Wallet.update({userId: userId}, {$inc: {accountBalance: -buyerCost}});
    Wallet.update({userId: adminId}, {$inc: {accountBalance: buyerCost}});
  }
  var jobTransObj = {
    jobId: doc._id,
    budget: buyerCost,
    adminId: adminId,
    buyerId: doc.userId,
    dateAndTime: doc.createdAt
  }
  if(doc.tasks) doc.tasks.map(function(task){
    obj.taskName = task.taskname;
    obj.taskdescription = task.taskdescription;
    obj.jobID = doc._id;
    Tasks.insert(obj);
  });

  obj.taskName = 'Enter close out notes';
  obj.taskdescription = 'Please enter notes before submitting the work. Make sure that you have completed all the tasks before submitting the project.';
  obj.jobID = doc._id;
  Tasks.insert(obj);

  obj.taskName = 'Collect a signature';
  obj.taskdescription = 'Please collect a signature from respective authority.';
  obj.jobID = doc._id;
  Tasks.insert(obj);

  obj.taskName = 'Upload a file';
  obj.taskdescription = 'Please upload relevent files.';
  obj.jobID = doc._id;
  Tasks.insert(obj);

  TimeSheet.insert({jobID:doc._id,"checkIn" : ""});

  var notificationObj = {
    notificationType: 'newJob',
    timeStamp: new Date(),
    jobId: doc._id,
    buyerId: doc.userId,
    read: false
  }
  Notifications.insert(notificationObj);
  JobTransactions.insert(jobTransObj);
  var admin = Users.findOne({roles:{$in: ['admin']}});
  Email.send({
      to: getUserEmail(admin),
      from: FROM_EMAIL,
      subject: "New Job Posted - " + doc.title,
      text: "A new job is posted: " + doc.title + "\n\n" 
            + Meteor.absoluteUrl("jobs/"+doc._id) + "\n\n\n\n\n\n"
    });
  if(doc.selectedProvider) {
    Profiles.update({_id: doc.selectedProvider}, {$addToSet: {appliedJobs: doc._id}});
  }
});

Jobs.before.update(function(userId, doc, fieldNames, modifier) {
  var adminId = Meteor.users.findOne({roles: {$in: ['admin']}})._id;
  if(modifier.$set.your_cost > doc.your_cost) {
    var diff = modifier.$set.your_cost - doc.your_cost;
    Wallet.update({userId: adminId}, {$inc: {accountBalance: diff}});
    Wallet.update({userId: userId}, {$inc: {accountBalance: -diff}});
  }
  if(modifier.$set.your_cost < doc.your_cost) {
    var diff = doc.your_cost - modifier.$set.your_cost;
    Wallet.update({userId: adminId}, {$inc: {accountBalance: -diff}});
    Wallet.update({userId: userId}, {$inc: {accountBalance: diff}});
  }
})


Jobs.after.update(function(userId, doc, fieldNames, modifier){
  var obj ={};
  if(doc.tasks) doc.tasks.map(function(task){
    obj.taskName = task.taskname;
    obj.taskdescription = task.taskdescription;
    obj.jobID = doc._id;
    var exists = Tasks.findOne({$and:[{jobID:obj.jobID},{taskName:obj.taskName}]});
    if(!exists)
      Tasks.insert(obj);
  });
});

Jobs.before.insert(function(userId, doc) {
  var id = Jobs.findOne({},{limit:1,sort:{'createdAt':-1}});
  if(id) {
    id = parseInt(id.readableID);
  } else {
    id=0;
  }
  id++;
  doc.readableID= id;
});

Meteor.users.before.insert(function(userId,doc){
  var id = Meteor.users.findOne({},{limit:1,sort:{'createdAt':-1}});
  if(id) {
    id = parseInt(id.readableID);
  } else {
    id=0;
  }
  id++;
  doc.readableID= id;  
});

Meteor.users.after.insert(function(userId, doc) {
  if(Roles.userIsInRole(doc._id, ['dispatcher', 'accountant'])) {
    FileManager.insert({userId: doc._id});
    return;
  } else if(Roles.userIsInRole(doc._id, ['buyer', 'provider'])) {
    Wallet.insert({userId: doc._id, dwollaId: null, accountBalance: 0});
    FileManager.insert({userId: doc._id});
  }
});
