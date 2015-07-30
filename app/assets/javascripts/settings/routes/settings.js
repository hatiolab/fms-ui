angular.module('fmsSettings').config(function($stateProvider, $urlRouterProvider) {

	// Each tab has its own nav history stack:
	$stateProvider

	// settings
	.state('settings', {
		url: '/settings',
		views: {
			'sidebar-view': {
				templateUrl: '/assets/settings/views/setting-sidebar.html'
			},
			'content-view' : {
				templateUrl: '/assets/settings/views/setting-content.html'
			}
		}
	})

	.state('settings.drivers', {
		url: '/drivers',
		views: {
			'sidebar-view@': {
				templateUrl: '/assets/settings/views/sidebars/drivers.html'
			},
			'content-view@' : {
				controller : 'DriversCtrl',
				templateUrl: '/assets/settings/views/contents/drivers.html'
			}
		}
	})

	.state('settings.fleets', {
		url: '/fleets',
		views: {
			'sidebar-view@': {
				templateUrl: '/assets/settings/views/sidebars/fleets.html'
			},
			'content-view@' : {
				templateUrl: '/assets/settings/views/contents/fleets.html'
			}
		}
	})

	.state('settings.groups', {
		url: '/groups',
		views: {
			'sidebar-view@': {
				templateUrl: '/assets/settings/views/sidebars/groups.html'
			},
			'content-view@' : {
				templateUrl: '/assets/settings/views/contents/groups.html'
			}
		}
	})

	.state('settings.preferences', {
		url: '/preferences',
		views: {
			'sidebar-view@': {
				templateUrl: '/assets/settings/views/sidebars/preferences.html'
			},
			'content-view@' : {
				templateUrl: '/assets/settings/views/contents/preferences.html'
			}
		}
	});

});