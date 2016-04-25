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
      isDeveloper: false
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
      isBuyer: false
    }
  });
});

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

Jobs.after.insert(function(userId, doc){
  var admin = Users.findOne({roles:"admin"});
  Email.send({
      to: getUserEmail(admin),
      from: FROM_EMAIL,
      subject: "New Job Posted - " + doc.title,
      text: "Job needs to be approved before it is live:\n\n" 
            + Meteor.absoluteUrl("jobs/"+doc._id) + "\n\n\n\n\n\n"
    });
});

Jobs.before.insert(function(userId, doc){
  var id = Jobs.findOne({},{limit:1,sort:{'readableID':-1}});
  if(id) {
    id = parseInt(id.readableID.substring(5));
  } else {
    id=0;
  }
  id++;
  doc.readableID= "J"+id;
});

Meteor.users.before.insert(function(userId,doc){
  var id = Meteor.users.findOne({},{limit:1,sort:{'readableID':-1}});
  if(id) {
    id = parseInt(id.readableID.substring(5));
  } else {
    id=0;
  }
  id++;
  doc.readableID= "UTLM-"+id;  
});
