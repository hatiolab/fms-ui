angular.module('fmsCore').controller('AlertZoneCtrl', function($rootScope, $scope, $state, $timeout, $element, $compile, FmsUtils, RestApi) {

	/**
	 * timer 시작 여부 
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
	 * 
	 * @type {Number}
	 */
	$scope.maxAlertCount = 10;
	/**
	 * 타이머 주기, 기본 2초
	 * 
	 * @type {Number}
	 */
	$scope.tryInterval = 2;
	/**
	 * Check Alert Interval
	 * 
	 * @type {Number}
	 */
	$scope.checkAlertInterval = 15;
	/**
	 * 마지막 조회시간을 저장하고 있다가 10초에 한 번씩 마지막 조회 이 후 시간으로 조회 ...
	 */
	$scope.lastSearchAlertTime = new Date().getTime();

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
	   		time : alertData.alert.etm,
	   		typeClass : alertData.alert.typeClass,
	   		isShow : true
	   	};
   		
   		if(!$scope.addAlert(alert)) {
   			$scope.lastSearchAlertTime = alertData.alert.ctm;
   		} else {
				$scope.lastSearchAlertTime = new Date().getTime();
   		}

   		$scope.$emit('new-alert-count-change', 1);
   	}   	
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
 			if($scope.alertList.length >= $scope.maxAlertCount) {
 				var lastAlert = $scope.alertList.pop();
 				$('#alert_' + lastAlert.id).remove();
 			}

 			$scope.alertList.unshift(alert);
 			$scope.shiftPopups();
 			$scope.showAlertPopups(alert);

 			// 제거될 타이머 등록 
 			var nextInvokeTime = new Date().getTime() + $scope.getFadeAwayInterval();
 			$scope.alertAwayTasks.unshift({ time : nextInvokeTime, id : alert.id });
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
	 	popupStr += "<strong><button type='button' ng-click=\"goTrip('" + alert.id + "', 'Y')\">" + alert.title + "</button></a></strong>{{" + alert.time + " | fmstime}}";
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
 		RestApi.get('/events/' + $scope.lastSearchAlertTime + '/latest_one.json', {}, 
 			function(alert) {
 				$scope.setAlert(alert);
 			},
 			function(error) {
 				console.log(error);
 			});

 		// 다음 체크 다음 설정  
		$scope.alertCheckTime = new Date().getTime() + $scope.getCheckAlertInterval();
	};

	/**
	 * Alert Popup을 자동으로 하나 지운다.
	 */
	$scope.removePopup = function(alertId) {
		var idx = $scope.alertList.map(function(alert) { return alert.id; }).indexOf(alertId);
		if(idx >= 0) {
			var alerts = $scope.alertList.splice(idx, 1);
			if(alerts && alerts.length > 0) {
				var alert = alerts[0];
				$scope.removeAlert(alert.id);
				$('#alert_' + alert.id).remove();
			}			
		}
	};

	/**
	 * Go Trip
	 */
	$scope.goTrip = function(alertId, goTrip) {
	 	$scope.removeAlert(alertId);
 		$('#alert_' + alertId).remove();
 		$scope.$emit('new-alert-count-change', -1);
 		$scope.redrawPopups();

	 	if('Y' == goTrip) {
	 		$state.go('monitor', { 'tabId': 'side-alerts' }, { reload : true });
		 	/*RestApi.get('/events/' + alertId + '.json', {}, function(alert) { $scope.$emit('monitor-event-trip-change', alert);});*/
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
	  * Interval 
	  * 
	  * @return {Number}
	  */
	$scope.getInterval = function() {
 		return $scope.tryInterval * 1000;
	};

	/**
	 * Check Alert Interval
	 * 
	 * @return {Number}
	 */
	$scope.getCheckAlertInterval = function() {
		return $scope.checkAlertInterval * 1000;
	};

	 /**
	  * Alert Popup Disappear Interval 
	  * 
	  * @return {Number}
	  */
	$scope.getFadeAwayInterval = function() {
		var interval = $rootScope.getIntSetting('alert_away_interval');
		interval = !interval ? 5 : interval;
 		return interval * 1000;
	};	

	/**
	 * Alert을 체크하는 시간을 등록해 놓으면 타이머가 시간을 체크하여 처리한다.
	 * 
	 * @type {Array}
	 */
	$scope.alertCheckTime = new Date().getTime() + 5 * 1000;
	/**
	 * Alert Popup을 지우는 시간과 지울 Alert ID를 등록해 놓으면 타이머가 시간을 체크하여 처리한다.
	 * 
	 * @type {Array}
	 */
	$scope.alertAwayTasks = [];	

	/**
	 * 타이머가 intervalStorage에 등록된 할 일을 처리한다.
	 */
	$scope.doTimer = function() {
		$timeout.cancel();
		var currentTime = new Date().getTime();

		if($scope.alertCheckTime > 0) {
			if($scope.alertCheckTime <= currentTime) {
				$scope.alertCheckTime = 0;
				$scope.searchNewAlert();
			}
		}

		if($scope.alertAwayTasks.length > 0) {
			var taret = $scope.alertAwayTasks[$scope.alertAwayTasks.length - 1];
			if(taret.time <= currentTime) {
				target = $scope.alertAwayTasks.pop();
				$scope.removePopup(target.id);
			}
		}

		$scope.startTimer();
	};

	/**
	 * 타이머 시작 
	 * @return {[type]} [description]
	 */
	$scope.startTimer = function() {
		var interval = $scope.getInterval();
	 	$timeout($scope.doTimer, interval);
	};

	/**
	 * 타이머 시작 
	 */ 
	$scope.startTimer();

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		$timeout.cancel();
	});

});