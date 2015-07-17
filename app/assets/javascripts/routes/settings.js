fmsApp.config(function($stateProvider, $urlRouterProvider) {

	// Each tab has its own nav history stack:
	$stateProvider

	// settings
	.state('settings', {
		url: '/settings',
		views: {
			'sidebar-view': {
				templateUrl: '/assets/views/settings/setting-sidebar.html'
			},
			'content-view' : {
				templateUrl: '/assets/views/settings/setting-content.html'
			}
		}
	});

});