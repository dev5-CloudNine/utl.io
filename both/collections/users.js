Users = Meteor.users;

UserProfileSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Full Name",
    max: 64,
    optional: true
  }
});

UserSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  username: {
    type: String,
    optional: true
  },
  status: {
    type: Object,
    optional: true
  },
  'status.lastLogin.date': {
    type: Date, optional: true
  },
  'status.lastLogin.ipAddr': {
    type: String, optional: true
  },
  'status.userAgent': {
    type: String, optional: true
  },
  'status.idle': { type: Boolean, optional: true },
  'status.lastActivity': { type: Date, optional: true },
  'status.online': {
    type: Boolean,
    index: true,
    optional: true,
  },
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "Email Address"
  },
  "emails.$.verified": {
    type: Boolean,
    defaultValue: false
  },
  emailHash: {
    type: String,
    optional: true
  },
  isDeveloper: {
    type: Boolean,
    defaultValue: false
  },
  isBuyer: {
    type: Boolean,
    defaultValue: false
  },
  isDispatcher: {
    type: Boolean,
    defaultValue: false
  },
  isAccountant: {
    type: Boolean,
    defaultValue: false
  },
  createdAt: {
    type: Date
  },
  companyName: {
    type: String,
    optional: true
  },
  profile: {
    type: UserProfileSchema,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  favoriteJobs: {
    type: Array,
    optional: true
  },
  'favoriteJobs.$': {
    type: String
  },
  favoriteUsers: {
    type: Array,
    optional: true
  },
  favCount: {
    type: Number,
    optional: true,
    autoValue: function() {
      if(this.isInsert) {
        return 0;
      }
    }
  },
  readableID: {
    type: String,
    optional: true
  },
  imgURL: {
    type: String,
    optional: true
  },
  resumeURL: {
    type: Array,
    optional: true
  },
  'resumeURL.$': {
    type: Object
  },
  'resumeURL.$.file_url': {
    type: String
  },
  'resumeURL.$.file_name': {
    type: String
  },
  'favoriteUsers.$': {
    type: String
  },
  favoriteBuyers: {
    type: Array,
    optional:true
  },
  'favoriteBuyers.$': {
    type: String
  },
  roles: {
    type: Array,
    optional: true
  },
  "roles.$": {
    type: String
  },
  invitedBy: {
    type: String,
    optional: true
  }
});

Users.attachSchema(UserSchema);

Users.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return Roles.userIsInRole(userId, ['admin']) || (!_.contains(fieldNames, 'roles') && userId && doc && userId === doc.userId);
  },
  remove: function(userId, doc) {
    return false;
  },
  fetch: ['userId']
});
