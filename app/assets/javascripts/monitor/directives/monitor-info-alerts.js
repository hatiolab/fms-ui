angular.module('fmsMonitor').directive('monitorInfoAlerts', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorAlertsCtrl',
		templateUrl: '/assets/monitor/views/infobar/monitor-info-alerts.html',
		scope: {}
	}; 
})
.controller('monitorAlertsCtrl', function($rootScope, $scope, $resource, $element, FmsUtils, RestApi) {

	/**
	 * Trip Alert Data Set
	 */
	$scope.tripAlertDataSet = {};
	/**
	 * Trip 선택 조회시
	 */
	$scope.$on('monitor-trip-info-change', function(evt, tripData) {
		// alert list 조회 
		RestApi.get('/events.json', { '_q[tid-eq]' : tripData.id }, function(dataSet) {
			$scope.tripAlertDataSet = dataSet;
			$scope.tripAlertItems = dataSet.items;
			FmsUtils.setEventTypeClasses($scope.tripAlertItems);
			FmsUtils.setEventTypeNames($scope.tripAlertItems);
		});
	});

});
