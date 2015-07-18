angular.module('fmsMonitor').directive('monitorInfoTrips', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorTripsCtrl',
		templateUrl: '/assets/monitor/views/infobar/monitor-info-trips.html',
		scope: {}
	}; 
})
.controller('monitorTripsCtrl', function($rootScope, $scope, $resource, $element) {

});