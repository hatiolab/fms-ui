angular.module('fmsMonitor').directive('monitorInfo', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorInfoCtrl',
		templateUrl: '/assets/monitor/views/infobar/monitor-info.html',
		scope: {}
	}; 
})
.controller('monitorInfoCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

	$element.hide();

	/**
	 * Trip 선택 조회시
	 */
	$scope.$on('monitor-trip-info-change', function(evt, tripData) {
		$scope.trip = tripData;
		$element.show();
	});

	/**
	 * 이전 Trip으로 이동
	 */
	$scope.goPrevTrip = function() {
		RestApi.get('/trips/' + $scope.trip.id + '/prev_trip.json', {}, function(trip) {
			if(trip.id) {
				$scope.$emit('monitor-info-trip-change', trip);
			}
		});
	};

	/**
	 * 다음 Trip으로 이동
	 */
	$scope.goNextTrip = function() {
		RestApi.get('/trips/' + $scope.trip.id + '/next_trip.json', {}, function(trip) {
			if(trip.id) {
				$scope.$emit('monitor-info-trip-change', trip);
			}
		});
	};

	/**
	 * 현재 선택된 alert
	 */	
	$scope.alert = null;

	/**
	 * 이전 Alert으로 이동
	 */
	$scope.goPrevAlert = function() {
		if($scope.alert == null) {
			$scope.getFirstAlert($scope.goPrevAlert);
		} else {
			RestApi.get('/events/' + $scope.alert.id + '/prev_event.json', {}, function(prevAlert) {
				if(prevAlert && prevAlert.id) {
					$scope.alert = prevAlert;
					$scope.$emit('monitor-event-info-change', $scope.alert);
				}
			});
		}
	};

	/**
	 * 다음 Alert으로 이동
	 */
	$scope.goNextAlert = function() {
		if($scope.alert == null) {
			$scope.getFirstAlert($scope.goPrevAlert);	
		} else {
			RestApi.get('/events/' + $scope.alert.id + '/next_event.json', {}, function(nextAlert) {
				if(nextAlert && nextAlert.id) {
					$scope.alert = nextAlert;
					$scope.$emit('monitor-event-info-change', $scope.alert);
				}
			});
		}
	};

	/**
	 * 첫번째 Alert 조회 
	 */
	$scope.getFirstAlert = function(callback) {
		RestApi.get('/events/' + $scope.trip.stm + '/latest_one.json', {fid : $scope.trip.fid}, function(alert) {
			if(alert && alert.alert && alert.alert.id) {
				$scope.alert = alert.alert;
				callback();
			}
		});
	};

});