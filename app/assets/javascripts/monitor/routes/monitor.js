angular.module('fmsMonitor').config(function($stateProvider, $urlRouterProvider) {

	// Each tab has its own nav history stack:
	$stateProvider

	// monitor	
	.state('monitor', {
		url: '/',
		params: { 'tabId' : null },
		views: {
			'sidebar-view': {
				templateUrl: '/assets/monitor/views/sidebar/sidebar.html'
			},
			'content-view' : {
				templateUrl: '/assets/monitor/views/content/monitor-map.html'
			}/*,
			'infobar-view' : {
				templateUrl: '/assets/monitor/views/infobar/infobar.html'
			}*/
		}
	});

});