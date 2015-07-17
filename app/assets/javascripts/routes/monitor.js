fmsApp.config(function($stateProvider, $urlRouterProvider) {

	// Each tab has its own nav history stack:
	$stateProvider

	// monitor	
	.state('monitor', {
		url: '/monitor',
		views: {
			'sidebar-view': {
				templateUrl: '/assets/views/monitor/monitor-sidebar.html'
			},
			'content-view' : {
				templateUrl: '/assets/views/monitor/monitor-map.html'
			}/* TODO Style Check,
			'infobar-view' : {
				templateUrl: '/assets/views/monitor/infobar.html'
			}*/
		}
	});

});