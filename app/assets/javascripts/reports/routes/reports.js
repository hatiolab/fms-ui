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

	.state('reports.groups', {
		url: '/groups',
		views: {
			'sidebar-view@': {
				template: '<group-search></group-search>'
			},
			'content-view@' : {
				template: '<group-chart></group-chart>'
			}
		}
	})

	.state('reports.fleets', {
		url: '/fleets',
		views: {
			'sidebar-view@': {
				template: '<fleet-search></fleet-search>'
			},
			'content-view@' : {
				template: '<fleet-chart></fleet-chart>'
			}
		}
	})

	.state('reports.alerts', {
		url: '/alerts',
		views: {
			'sidebar-view@': {
				template: '<alert-search></alert-search>'
			},
			'content-view@' : {
				template: '<alert-chart></alert-chart>'
			}
		}
	});

});