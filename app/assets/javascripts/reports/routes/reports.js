angular.module('fmsReports').config(function($stateProvider, $urlRouterProvider) {

	// Each tab has its own nav history stack:
	$stateProvider

	// report
	.state('reports', {
		url: '/reports',
		views: {
			'sidebar-view': {
				controller: 'ReportsCtrl',
				templateUrl: '/assets/reports/views/report-sidebar.html'
			},
			'content-view' : {
				controller: 'ReportsCtrl',
				templateUrl: '/assets/reports/views/report-content.html'
			}
		}
	})

	.state('reports.group-drive', {
		url: '/group-drive',
		views: {
			'sidebar-view@': {
				template: '<group-drive-search></group-drive-search>'
			},
			'content-view@' : {
				template: '<group-drive-chart></group-drive-chart>'
			}
		}
	})

	.state('reports.fleet-drive', {
		url: '/fleet-drive',
		views: {
			'sidebar-view@': {
				template: '<fleet-drive-search></fleet-drive-search>'
			},
			'content-view@' : {
				template: '<fleet-drive-chart></fleet-drive-chart>'
			}
		}
	})

	.state('reports.group-alert', {
		url: '/group-alert',
		views: {
			'sidebar-view@': {
				template: '<group-alert-search></group-alert-search>'
			},
			'content-view@' : {
				template: '<group-alert-chart></group-alert-chart>'
			}
		}
	})

	.state('reports.fleet-alert', {
		url: '/fleet-alert',
		views: {
			'sidebar-view@': {
				template: '<fleet-alert-search></fleet-alert-search>'
			},
			'content-view@' : {
				template: '<fleet-alert-chart></fleet-alert-chart>'
			}
		}
	});

});