Tracker.autorun(function() {
  var current = Router.current();

  Tracker.afterFlush(function() {
    $('.content-inner').scrollTop(0);
    $(window).scrollTop(0);
  });
  $(window).on('beforeunload', function() {
  	socket.close();
  })
});


if (Meteor.isServer) {
Cities._ensureIndex({
"city": "text"
});
}