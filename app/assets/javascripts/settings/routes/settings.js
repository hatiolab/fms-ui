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
				template: '<fleet-detail></fleet-detail>'
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
				template: '<group-detail></group-detail>'
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
				template: '<preference-detail></preference-detail>'
			}
		}
	})

	.state('settings.company', {
		url: '/company',
		views: {
			'sidebar-view@': {
				template: '<company-list></company-list>'
			},
			'content-view@' : {
				template: '<company-detail></company-detail>'
			}
		}
	});

});