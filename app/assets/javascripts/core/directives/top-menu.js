angular.module('fmsCore').directive('topMenu', function() { 
	return { 
		restrict: 'E',
		replace: true,
		controller: 'topMenuCtrl',
		templateUrl: '/assets/core/views/top-menu.html'
	}; 
})

.controller('topMenuCtrl', function($rootScope, $scope, $element, ConstantSpeed, FmsUtils, RestApi) {

	$scope.items = [ {
		name : 'Map', 
		cls : 'icon-map',
		href : '#/',
		active : true
	}, {
		name : 'Geofence', 
		cls : 'icon-geofence',
		href : '#/geofence',
		active : false
	}, {
		name : 'HR', 
		cls : 'icon-hr',
		href : '#/hr/overspeed',
		active : false
	}, {
		name : 'Report', 
		cls : 'icon-report',
		href : '#/reports/group-drive',
		active : false
	}, {
		name : 'Setting', 
		cls : 'icon-setting',
		href : '#/settings/drivers',
		active : false
	} ];

	$scope.setActive = function(activeItem) {
		for(var i = 0 ; i < $scope.items.length ; i++) {
			var item = $scope.items[i];
			item.active = (item.name == activeItem.name);
		}
	};

	$rootScope.$on('settings-value-change', function(event, setting) {
		for(var i=0; i<setting.length; i++){
			$rootScope.setSetting(setting[i].name, setting[i].value);
		}
	});

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

	/**
	 * Window Resize 시 모든 그리드 켄테이너의 Height 조정 
	 */
  $(window).on("resize.doResize", function () {
  	FmsUtils.resetAllGridContainerHeight();
  });

	/**
	 * Destroy hook
	 */
  $scope.$on("$destroy",function () {
    $(window).off("resize.doResize");
  });	

});
