angular.module('fmsGeofence').config(function($stateProvider, $urlRouterProvider) {

	// Each tab has its own nav history stack:
	$stateProvider

	// geofence	
	.state('geofence', {
		url: '/geofence',
		views: {
			'sidebar-view': {
				template: 'Sidebar'
			},
			'content-view' : {
				template: 'Content'
			}
		}
	})

	.state('geofence.settings', {
		url: '/settings',
		views: {
			'sidebar-view@': {
				template: '<setting-list></setting-list>'
			},
			'content-view@' : {
				templateUrl : '/assets/geofence/views/contents/settings.html'
			}
		}
	})

	.state('geofence.relations', {
		url: '/relations',
		views: {
			'sidebar-view@': {
				template: '<relation-list></relation-list>'
			},
			'content-view@' : {
				template: '<relation-detail></relation-detail>'
			}
		}
	});

});