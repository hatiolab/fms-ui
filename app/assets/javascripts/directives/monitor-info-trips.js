fmsApp.directive('monitorInfoTrips', function() { 
	return { 
		restrict: 'E',
		controller: 'MonitorCtrl',
		//scope: {}, 		
		templateUrl: '/assets/views/monitor/monitor-info-trips.html'
	}; 
});