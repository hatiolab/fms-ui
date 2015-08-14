angular.module('fmsCore').controller('AlertZoneCtrl', function($rootScope, $scope, $timeout, $interval, $element, $compile, FmsUtils, RestApi) {

	/**
	 * timer 시작 여
	 * 
	 * @type {Boolean}
	 */
	$scope.timerStarted = false;
	/**
	 * alert list
	 * 
	 * @type {Array}
	 */
	$scope.alertList = []; 
	/**
	 * 최대 alert 개수 - 이 개수 이상이면 자동 삭제 
	 * @type {Number}
	 */
	$scope.max_alert_count = 10;
	/**
	 * 임시 방안 - 추후 pub / sub으로 구현 
	 * alert 조회 - 마지막 조회시간을 저장하고 있다가 10초에 한 번씩 마지막 조회 이 후 시간으로 조회 ...
	 */
	 $scope.lastSearchAlertTime = new Date().getTime();	

	/**
   * Alert 발생시 
   */
   $scope.setAlert = function(alertData) {   	
   	$timeout.cancel();

   	if(alertData && alertData.alert && alertData.alert.id) {
	   	FmsUtils.setAlertTypeClass(alertData.alert);
	   	var alert = {
	   		id : alertData.alert.id,
	   		type : alertData.alert.typ,
	   		tripId : alertData.alert.tid,
	   		title : alertData.driver.name,
	   		time : alertData.alert.etm,
	   		typeClass : alertData.alert.typeClass,
	   		isShow : true
	   	};
   		
   		$scope.lastSearchAlertTime = alertData.alert.ctm + 10;

   		if(!$scope.addAlert(alert)) {
   			$scope.lastSearchAlertTime = alertData.alert.ctm + 1000;
   		}   		

   	} else {
   		$scope.lastSearchAlertTime = new Date().getTime() + 10;
   	}
   	
   	$timeout($scope.searchNewAlert, $scope.getInterval());
   };

   /**
    * Alert 추가 
    * 
    * @param {Object}
    */
   $scope.addAlert = function(alert) {
   		var exist = false;

   		for(var i = 0 ; i < $scope.alertList.length ; i++) {
   			var orgAlert = $scope.alertList[i];
   			if(orgAlert.id == alert.id) {
   				exist = true;
   				break;
   			}
   		}

   		if(!exist) {
   			if($scope.alertList.length >= $scope.max_alert_count) {
   				var lastAlert = $scope.alertList.pop();
   				$('#alert_' + lastAlert.id).remove();
   			}

   			$scope.alertList.unshift(alert);
   			$scope.shiftPopups();
   			$scope.showAlertPopups(alert);
   		}

   		return exist;
   };

   /**
    * alert 삭제 
    * 
    * @param  {String}
    * @return N/A
    */
   $scope.removeAlert = function(alertId) {
   	var idx = -1;
   	for(var i = 0 ; i < $scope.alertList.length ; i++) {
   		var orgAlert = $scope.alertList[i];
   		if(orgAlert.id == alertId) {
   			idx = i;
   			break;
   		}
   	}

   	if(idx >= 0) {
   		$scope.alertList.splice(idx, 1);
   	}
   };

	 /**
	  * close시 popup들의 위치를 다시 조정한다.
	  * 
	  * @return N/A
	  */
	 $scope.shiftPopups = function() {
	 	var topPosition = 55 + 60, height = 60;
	 	var popups = $element.find('.alert-popup');
	 	if(popups.length == 0) {
	 		return;
	 	}

	 	var lastIdx = popups.length - 1;
	 	for(var i = lastIdx ; i >= 0 ; i--) {
	 		if(i != lastIdx)
	 			topPosition = topPosition + height;

	 		var popup = popups[i];
	 		popup.style.top = topPosition + 'px';
	 	}
	 };   

	/**
	 * Alert popup을 띄운다.
	 */
	 $scope.showAlertPopups = function(alert) {
	 	var popupStr = "<div id='alert_" + alert.id + "' style='top:55px' class='alert alert-popup' role='alert' ng-show='true'>";
	 	popupStr += "<div class='" + alert.typeClass + "'></div>";
	 	popupStr += "<button type='button' class='close' data-dismiss='alert' aria-label='Close' ng-click=\"goTrip('" + alert.id + "', 'N')\">";
	 	popupStr += "<span aria-hidden='true'>&times;</span></button>";
	 	popupStr += "<strong><button type='button' ng-click=\"goTrip('" + alert.id + "', 'Y')\">" + alert.title + "</button></a></strong>{{" + alert.time + " | date : 'medium'}}";
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
	 $scope.goTrip = function(alertId, goTrip) {
	 	$scope.removeAlert(alertId);
 		$('#alert_' + alertId).remove();
 		$scope.redrawPopups();	 	

	 	if('Y' == goTrip) {
		 	RestApi.get('/events/' + alertId + '.json', {}, function(alert) {
		 		$scope.$emit('monitor-event-trip-change', alert);
		 	});
	 	}
	 };

	 /**
	  * close시 popup들의 위치를 다시 조정한다.
	  * 
	  * @return N/A
	  */
	 $scope.redrawPopups = function() {
	 	var topPosition = 55, height = 60;
	 	var popups = $element.find('.alert-popup');
	 	if(popups.length == 0) {
	 		return;
	 	}
	 	var lastIdx = popups.length - 1;
	 	for(var i = lastIdx ; i >= 0 ; i--) {
	 		if(i != lastIdx)
	 			topPosition = topPosition + height;

	 		var popup = popups[i];
	 		popup.style.top = topPosition + 'px';
	 	}
	 };

	 /**
	  * Setting이 준비되면 Refresh
	  * 
	  * @param  {String}
	  * @param  {Function}
	  * @return N/A
	  */
	 $scope.$on('settings-all-ready', function() {
	 	alert('Setting All Ready');
	 	$scope.refreshTimer();
	 });

	/**
	 * Refresh timer를 시작 
	 */
	 $scope.refreshTimer = function() {
	 	if(!$scope.timerStarted) {
	 		$scope.timerStarted = true;
		 	$timeout.cancel();
		 	var interval = $scope.getInterval();
	 		$timeout($scope.searchNewAlert, interval);	 		
	 	}
	 };

	 /**
	  * Interval 
	  * 
	  * @return {Number}
	  */
	 $scope.getInterval = function() {
		var interval = 10;
	 	try {
	 		interval = $rootScope.getIntSetting('map_refresh_interval');	
	 	} catch(e) {
	 	}
	 	
 		if(!interval || interval < 10) {
 			interval = 10;
 		}

 		return interval * 1000;
	 };

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		$timeout.cancel();
	});

	/**
	 * timer 시작 
	 */ 
	$scope.refreshTimer();

	});