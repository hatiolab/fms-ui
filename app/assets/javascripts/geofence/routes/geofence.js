angular.module('fmsGeofence').config(function($stateProvider, $urlRouterProvider) {

	// Each tab has its own nav history stack:
	$stateProvider

	// geofence	
	.state('geofence', {
		url: '/geofence',
		views: {
			'sidebar-view': {
				controller: 'Geofences',
				templateUrl: '/assets/geofence/views/sidebar.html'
			},
			'content-view' : {
				controller: 'GeofenceItem',
				templateUrl: '/assets/geofence/views/geofence.html'
			}
		}
	});

});