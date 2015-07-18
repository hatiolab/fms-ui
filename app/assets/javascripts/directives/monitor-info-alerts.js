fmsApp.directive('monitorInfoAlerts', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorAlertsCtrl',
		templateUrl: '/assets/views/monitor/monitor-info-alerts.html',
		scope: {}
	}; 
})
.controller('monitorAlertsCtrl', function($rootScope, $scope, $resource, $element) {

});
