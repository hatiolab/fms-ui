angular.module('fmsCore').controller('CoreCtrl', function($rootScope, $scope, ConstantSpeed, RestApi) {

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
	 * Setting값 초기화 
	 */
	$rootScope.refreshSettings();

});