fmsApp.directive('monitorSideAlerts', function() { 
	return { 
		restrict: 'E',
		controller: 'MonitorCtrl',
		//scope: {}, 		
		templateUrl: '/assets/views/monitor/monitor-side-alerts.html'
	}; 
});