angular.module('fmsHr').config(function($stateProvider, $urlRouterProvider) {

	// Each tab has its own nav history stack:
	$stateProvider

	// hr
	.state('hr', {
		url: '/hr',
		views: {
			'sidebar-view': {
				controller: 'HrCtrl',
				templateUrl: '/assets/hr/views/hr-sidebar.html'
			},
			'content-view' : {
				controller: 'HrCtrl',
				templateUrl: '/assets/hr/views/hr-content.html'
			}
		}
	})

	.state('hr.overview', {
		url: '/overview',
		views: {
			'sidebar-view@': {
				template: '<hr-overview-search></hr-overview-search>'
			},
			'content-view@' : {
				template: '<hr-overview-chart></hr-overview-chart>'
			}
		}
	})

	.state('hr.overspeed', {
		url: '/overspeed',
		views: {
			'sidebar-view@': {
				template: '<hr-overspeed-search></hr-overspeed-search>'
			},
			'content-view@' : {
				template: '<hr-overspeed-chart></hr-overspeed-chart>'
			}
		}
	})

	.state('hr.drivehabit', {
		url: '/drivehabit',
		views: {
			'sidebar-view@': {
				template: '<hr-drivehabit-search></hr-drivehabit-search>'
			},
			'content-view@' : {
				template: '<hr-drivehabit-chart></hr-drivehabit-chart>'
			}
		}
	});

});