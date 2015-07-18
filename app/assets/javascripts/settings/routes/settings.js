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
	});

});