angular.module('fmsMonitor').directive('monitorInfo', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorInfoCtrl',
		templateUrl: '/assets/monitor/views/infobar/monitor-info.html',
		scope: {}
	}; 
})
.controller('monitorInfoCtrl', function($rootScope, $scope, $resource, $element) {

	$element.hide();

	/**
	 * Trip 선택 조회시
	 */
	$scope.$on('monitor-trip-info-change', function(evt, tripData) {
		$scope.trip = tripData;
		$element.show();
	});

});