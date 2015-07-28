angular.module('fmsCore').controller('CoreCtrl', function($rootScope, $scope, $interval, ConstantSpeed, FmsUtils, RestApi) {

	/**
	 * Inject to rootScope : Refresh Settings
	 */
	$rootScope.refreshSettings = function() {
		RestApi.list('/settings.json', {}, function(dataSet) {
			var settings = dataSet;
			$rootScope.settings = {};

			for(var i = 0 ; i < settings.length ; i++) {
				$rootScope.setSetting(settings[i].name, settings[i].value);
			}

			$rootScope.$broadcast('settings-all-ready');
		});
	};

	/**
	 * Inject to rootScope : get Setting Value
	 */
	$rootScope.getSetting = function(name) {
		return $rootScope.settings ? $rootScope.settings[name] : null;
	};

	/**
	 * Inject to rootScope : get Setting Value To Integer
	 */
	$rootScope.getIntSetting = function(name) {
		return $rootScope.settings ? parseInt($rootScope.getSetting(name)) : null;
	};

	/**
	 * Inject to rootScope : set Setting Value
	 */
	$rootScope.setSetting = function(name, value) {
		$rootScope.settings[name] = value;
		var eventName = 'setting-' + name + '-change';
		$rootScope.$broadcast(eventName, value);
	};

	/**
	 * Get speed level by setting
	 */	
	$rootScope.getSpeedLevel = function(speed) {
		if(!$rootScope.settings) {
			return ConstantSpeed.SPEED_SLOW;
		}

		if(speed == 0) {
			return ConstantSpeed.SPEED_IDLE;
			
		} else if(speed >= $rootScope.getIntSetting(ConstantSpeed.SPEED_OVER)) {
			return ConstantSpeed.SPEED_OVER;
			
		} else if(speed > $rootScope.getIntSetting(ConstantSpeed.SPEED_NORMAL)) {
			return ConstantSpeed.SPEED_HIGH;
			
		} else if(speed > $rootScope.getIntSetting(ConstantSpeed.SPEED_SLOW)) {
			return ConstantSpeed.SPEED_NORMAL;
			
		} else {
			return ConstantSpeed.SPEED_SLOW;
		}
	};

	/**
	 * speed level이 속하는 속도 구간을 리턴 
	 */
	$rootScope.getSpeedRange = function(level) {
		if(ConstantSpeed.SPEED_OFF == level) {
			return -1;

		} else if(ConstantSpeed.SPEED_IDLE == level) {
			return 0;
			
		} else if(ConstantSpeed.SPEED_SLOW == level) {
			return [0, $rootScope.getIntSetting(level)];
			
		} else if(ConstantSpeed.SPEED_NORMAL == level) {
			return [$rootScope.getIntSetting(ConstantSpeed.SPEED_SLOW), $rootScope.getIntSetting(level)];
			
		} else if(ConstantSpeed.SPEED_HIGH == level) {
			return [$rootScope.getIntSetting(ConstantSpeed.SPEED_NORMAL), $rootScope.getIntSetting(level)];
			
		} else {
			return $rootScope.getIntSetting(ConstantSpeed.SPEED_HIGH);
		}		
	};

	/**
	 * Setting값 초기화 
	 */
	$rootScope.refreshSettings();

	// /**
	//  * Alert
	//  */
	// $scope.alertItem = { isShow : false, id : '', type : '', tripId : '', title : '', time : new Date() };
	// /**
 //   * Alert 발생시 
 //   */
	// $scope.$on('core-alert-occur', function(evt, alert) {
	// 	$scope.alertItem.id = alert.id;
	// 	$scope.alertItem.type = alert.type;
	// 	$scope.alertItem.tripId = alert.tripId;
	// 	$scope.alertItem.title = alert.title;
	// 	$scope.alertItem.time = alert.time;
	// 	$scope.alertItem.isShow = true;
	// });

	// /**
	//  * 임시 방안 - 추후 pub / sub으로 구현 
	//  * alert 조회 - 마지막 조회시간을 저장하고 있다가 10초에 한 번씩 마지막 조회 이 후 시간으로 조회 ...
	//  */
	// $scope.lastSearchAlertTime = 1437964420594; //new Date().getTime();

	// /**
	//  * Refresh timer를 시작 
	//  */
	// $scope.searchNewAlert = function() {
	// 	RestApi.get('/events/' + $scope.lastSearchAlertTime + '/latest_one.json', {}, function(alert) {
	// 		if(alert && alert.driver) {
	// 			FmsUtils.setAlertTypeClass(alert.alert);
	// 			$scope.alertItem.id = alert.alert.id;
	// 			$scope.alertItem.type = alert.alert.typ;
	// 			$scope.alertItem.tripId = alert.alert.tid;
	// 			$scope.alertItem.title = alert.driver.name;
	// 			$scope.alertItem.time = alert.alert.ctm;
	// 			$scope.alertItem.typeClass = alert.alert.typeClass;
	// 			$scope.alertItem.isShow = true;
	// 			$scope.lastSearchAlertTime = $scope.alertItem.time + 1;
	// 		}
	// 	});

	// 	$scope.lastSearchAlertTime = new Date().getTime();
	// };

	// /**
	//  * Scope destroy시 timeout 제거 
	//  */
	// $scope.$on('$destroy', function(event) {
	// 	$interval.cancel();
	// });

	// /**
	//  * Go Trip
	//  */
	// $scope.goTrip = function(tripId) {
	// 	alert(tripId);
	// };

	// $interval($scope.searchNewAlert, 3 * 1000);	

});