angular.module('fmsCore').controller('AlertZoneCtrl', function($rootScope, $scope, $timeout, $interval, $element, $compile, FmsUtils, RestApi) {

	/**
   * Alert 발생시 
   */
   $scope.setAlert = function(alertData) {
   	if(alertData && alertData.alert && alertData.alert.id) {
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
   		$scope.lastSearchAlertTime = alertData.alert.ctm + 10;

   	} else {
   		$scope.lastSearchAlertTime = new Date().getTime() + 10;
   	}
   	
   	//console.log($scope.lastSearchAlertTime);
   	$timeout($scope.searchNewAlert, $scope.getInterval());
   };

	/**
	 * Alert popup을 띄운다.
	 */
	 $scope.addAlertPopup = function(alert) {
	 	var topPosition = $scope.calcPopupTopPosition();
	 	var popupStr = "<div id='alert_" + alert.id + "' style='top:" + topPosition + "px' class='alert alert-popup' role='alert' ng-show='true'>";
	 	popupStr += "<div class='" + alert.typeClass + "'></div>";
	 	popupStr += "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>";
	 	popupStr += "<span aria-hidden='true'>&times;</span></button>";
	 	popupStr += "<strong><button type='button' ng-click=\"goTrip('" + alert.id + "')\">" + alert.title + "</button></a></strong>{{" + alert.time + " | date : 'medium'}}";
	 	popupStr += "</div>";		
	 	var el = $compile(popupStr)($scope);
	 	$element.append(el);
	 };

	/**
	 * Popup Top Position 계산
	 * 
	 * @return N/A
	 */
	 $scope.calcPopupTopPosition = function() {
	 	var firstTop = 55, height = 60;
	 	var popups = $element.find('.alert-popup');
	 	return firstTop + (height * popups.length);
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
 		RestApi.get('/events/' + $scope.lastSearchAlertTime + '/latest_one.json', {}, function(alert) {
 			$scope.setAlert(alert);
 		});
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

	 /**
	  * Setting이 준비되면 Refresh
	  * 
	  * @param  {String}
	  * @param  {Function}
	  * @return N/A
	  */
	 $scope.$on('settings-all-ready', function() {
	 	$scope.refreshTimer();
	 });

	/**
	 * Refresh timer를 시작 
	 */
	 $scope.refreshTimer = function() {
	 	$timeout.cancel();
	 	var interval = $scope.getInterval();
 		$timeout($scope.searchNewAlert, interval);
	 };

	 /**
	  * Interval 
	  * 
	  * @return {Number}
	  */
	 $scope.getInterval = function() {
	 	var interval = $rootScope.getIntSetting('map_refresh_interval');
 		if(!interval || interval < 10) {
 			interval = 10;
 		}

 		return interval * 1000;
	 };

	 // timer 시작 
	 $scope.refreshTimer();

	});