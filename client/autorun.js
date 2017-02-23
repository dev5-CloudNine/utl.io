Tracker.autorun(function() {
	var current = Router.current();
	Tracker.afterFlush(function() {
		$('.content-inner').scrollTop(0);
		$(window).scrollTop(0);
	});
	$(window).on('beforeunload', function() {
		socket.close();
	})
	toastr.options = {
		"closeButton": true,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}
});

Meteor.startup(function() {
	GoogleMaps.load({key: 'AIzaSyCYOFS20R2pwj_iypwsOloV5ctxzClT4GM', libraries: 'places'});
})


if (Meteor.isServer) {
	Cities._ensureIndex({
		"city": "text"
	});
}