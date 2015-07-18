fmsApp.directive('monitorInfoTrips', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorTripsCtrl',
		templateUrl: '/assets/views/monitor/monitor-info-trips.html',
		scope: {}
	}; 
})
.controller('monitorTripsCtrl', function($rootScope, $scope, $resource, $element) {

});