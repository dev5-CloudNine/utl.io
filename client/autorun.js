Tracker.autorun(function() {
  var current = Router.current();

  Tracker.afterFlush(function() {
    $('.content-inner').scrollTop(0);
    $(window).scrollTop(0);
  });
});


Meteor.startup(function(){
    Cities._ensureIndex({
        "city": "text"
    });
});
