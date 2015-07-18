angular.module('fmsMonitor').directive('monitorInfoAlerts', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorAlertsCtrl',
		templateUrl: '/assets/monitor/views/infobar/monitor-info-alerts.html',
		scope: {}
	}; 
})
.controller('monitorAlertsCtrl', function($rootScope, $scope, $resource, $element) {

});
