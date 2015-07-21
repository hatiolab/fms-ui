angular.module('fmsMonitor').directive('monitorInfoTrips', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorTripsCtrl',
		templateUrl: '/assets/monitor/views/infobar/monitor-info-trips.html',
		scope: {}
	}; 
})
.controller('monitorTripsCtrl', function($rootScope, $scope, $resource, $element, RestApi) {
	/**
	 * Fleet Trip Data Set
	 */
	$scope.fleetTripDataSet = {};

	/**
	 * Trip 선택 조회시
	 */
	$scope.$on('monitor-trip-info-change', function(evt, tripData) {
		// alert list 조회 
		RestApi.get('/trips.json', { '_q[fid-eq]' : tripData.fid }, function(dataSet) {
			$scope.fleetTripDataSet = dataSet;
			$scope.fleetTripItems = dataSet.items;
		});
	});

});