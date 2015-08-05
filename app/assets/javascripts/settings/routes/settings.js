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
				template: '<driver-list></driver-list>'
			},
			'content-view@' : {
				template: '<driver-detail></driver-detail>'
			}
		}
	})

	.state('settings.fleets', {
		url: '/fleets',
		views: {
			'sidebar-view@': {
				template: '<fleet-list></fleet-list>'
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
				template: '<group-list></group-list>'
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
				template: '<preference-list></preference-list>'
			},
			'content-view@' : {
				templateUrl: '/assets/settings/views/contents/preferences.html'
			}
		}
	});

});