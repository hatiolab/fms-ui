angular.module('fmsGeofence').config(function($stateProvider, $urlRouterProvider) {

	// Each tab has its own nav history stack:
	$stateProvider

	// geofence	
	.state('geofence', {
		url: '/geofence',
		views: {
			'sidebar-view': {
				controller: 'GeofenceCtrl',
				templateUrl: '/assets/geofence/views/sidebar.html'
			},
			'content-view' : {
				controller: 'GeofenceItemCtrl',
				templateUrl: '/assets/geofence/views/geofence.html'
			}
		}
	});

});