angular.module('fmsGeofence').config(function($stateProvider, $urlRouterProvider) {

	// Each tab has its own nav history stack:
	$stateProvider

	// geofence	
	.state('geofence', {
		url: '/geofence',
		views: {
			'sidebar-view': {
				template: '<geofence-list toggle-switch></geofence-list>'
			},
			'content-view' : {
				templateUrl: '/assets/geofence/views/contents/geofence-view.html'
			}
		}
	})

	.state('geofence.settings', {
		url: '/settings',
		views: {
			'sidebar-view@': {
				template: '<setting-list toggle-switch></setting-list>'
			},
			'content-view@' : {
				templateUrl : '/assets/geofence/views/contents/settings.html'
			}
		}
	})

	.state('geofence.relations', {
		url: '/relations',
		params: { 'geofence' : null },
		views: {
			'sidebar-view@': {
				template: '<relation-list toggle-switch></relation-list>'
			},
			'content-view@' : {
				template: '<relation-detail></relation-detail>'
			}
		}
	});

});