angular.module('fmsMonitor').controller('MonitorCtrl', function($rootScope, $scope, $interval, RestApi) {
	
	/**
	 * infobar toggle show / hide model
	 */
	$scope.isInfobarToggle = true;

	/**
	 * 임시 방안 - 추후 pub / sub으로 구현 
	 * alert 조회 - 마지막 조회시간을 저장하고 있다가 10초에 한 번씩 마지막 조회 이 후 시간으로 조회 ...
	 */
	$scope.lastSearchAlertTime = new Date().getTime();

	/**
	 * Refresh timer를 시작 
	 */
	$scope.searchNewAlert = function() {
		RestApi.get('/events/' + $scope.lastSearchAlertTime + '/latest_one.json', {}, function(alert) {
			if(alert && alert.driver) {
				var alertData = { id : alert.id, tripId : alert.tid, title : alert.driver.name, time : alert.alert.ctm };
				$rootScope.$broadcast('core-alert-occur', alertData);
				$scope.lastSearchAlertTime = alertData.time;
			}
		});

		$scope.lastSearchAlertTime = new Date().getTime();
	};

	/**
	 * Scope destroy시 timeout 제거 
	 */
	$scope.$on('$destroy', function(event) {
		$interval.cancel();
	});

	$interval($scope.searchNewAlert, 10 * 1000);

});