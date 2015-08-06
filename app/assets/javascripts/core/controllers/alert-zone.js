angular.module('fmsCore').controller('AlertZoneCtrl', function($rootScope, $scope, $interval, $element, $compile, FmsUtils, RestApi) {

	/**
   * Alert 발생시 
   */
	$scope.setAlert = function(alertData) {
		$scope.lastSearchAlertTime = alertData.alert.ctm + 1000;
		FmsUtils.setAlertTypeClass(alertData.alert);
		var alert = {
			id : alertData.alert.id,
			type : alertData.alert.typ,
			tripId : alertData.alert.tid,
			title : alertData.driver.name,
			time : alertData.alert.ctm,
			typeClass : alertData.alert.typeClass,
			isShow : true
		};
		$scope.addAlertPopup(alert);
	};

	/**
	 * alert popup을 띄운다.
	 */
	$scope.addAlertPopup = function(alert) {
		var popupStr = "<div id='alert_" + alert.id + "' class='alert alert-popup' role='alert' ng-show='true'>";
		popupStr += "<div class='" + alert.typeClass + "'></div>";
		popupStr += "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>";
		popupStr += "<span aria-hidden='true'>&times;</span></button>";
		popupStr += "<strong><button type='button' ng-click=\"goTrip('" + alert.id + "')\">" + alert.title + "</button></a></strong>{{" + alert.time + " | date : 'medium'}}";
		popupStr += "</div>";		
		var el = $compile(popupStr)($scope);
    $element.append(el);
	};

	/**
	 * 임시 방안 - 추후 pub / sub으로 구현 
	 * alert 조회 - 마지막 조회시간을 저장하고 있다가 10초에 한 번씩 마지막 조회 이 후 시간으로 조회 ...
	 */
	$scope.lastSearchAlertTime = new Date().getTime();

	/**
	 * Refresh timer를 시작 
	 */
	$scope.searchNewAlert = function() {
		var refresh = $rootScope.getSetting('map_refresh');
		if(refresh && refresh == 'Y') {
			RestApi.get('/events/' + $scope.lastSearchAlertTime + '/latest_one.json', {}, function(alert) {
				$scope.lastSearchAlertTime = new Date().getTime();
				if(alert && alert.driver) {
					$scope.setAlert(alert);
				}
			});
		}
	};

	/**
	 * Scope destroy시 timeout 제거 
	 */
	$scope.$on('$destroy', function(event) {
		$interval.cancel();
	});

	/**
	 * Go Trip
	 */
	$scope.goTrip = function(alertId) {
		RestApi.get('/events/' + alertId + '.json', {}, function(alert) {
			$scope.$emit('monitor-event-trip-change', alert);
			$('#alert_' + alertId).remove();
		});
	};

	$interval($scope.searchNewAlert, $rootScope.getIntSetting('map_refresh_interval') * 1000);	

});