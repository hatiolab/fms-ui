fmsApp.directive('monitorInfo', function() { 
	return { 
		restrict: 'E',
		controller: 'MonitorCtrl',
		//scope: {}, 		
		templateUrl: '/assets/views/monitor/monitor-info.html'
	}; 
});