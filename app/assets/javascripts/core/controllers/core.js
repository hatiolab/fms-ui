angular.module('fmsCore').controller('CoreCtrl', function($rootScope, $scope, RestApi) {

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
	 * Setting값 초기화 
	 */
	$rootScope.refreshSettings();

});