fmsApp.directive('monitorSideFleets', function() { 
	return { 
		restrict: 'E',
		controller: 'MonitorCtrl',
		//scope: {},
		templateUrl: '/assets/views/monitor/monitor-side-fleets.html'
	}; 
});