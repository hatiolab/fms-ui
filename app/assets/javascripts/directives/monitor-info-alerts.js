fmsApp.directive('monitorInfoAlerts', function() { 
	return { 
		restrict: 'E',
		controller: 'MonitorCtrl',
		//scope: {}, 		
		templateUrl: '/assets/views/monitor/monitor-info-alerts.html'
	}; 
});