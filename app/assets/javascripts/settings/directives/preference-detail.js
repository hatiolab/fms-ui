angular.module('fmsSettings').directive('preferenceDetail', function() {
		return {
			restrict: 'E',
			controller: 'preferenceDetailCtrl',
			templateUrl: '/assets/settings/views/contents/preferences.html',
			scope: {},
			link : function(scope, element, attr, preferenceDetailCtrl) {
				scope.searchPreferences(null);
			}
		};
	})
	.controller('preferenceDetailCtrl', function($rootScope, $scope, $filter, $resource, $element, $window, RestApi, ModalUtils) {

		/**
		 * Setting View Binding Model
		 * 
		 * @type {Object}
		 */
		$scope.settings = {};
		/**
		 * Language Setup Mode가 변경되었는지 여부 체크 
		 */
		$scope.prevLangSetupMode = 'N';
		/**
		 * Search Groups
		 */
		$scope.searchPreferences = function(searchParams) {
			$scope.doSearch({ '_o[name]' : 'asc', 'limit' : 1000 }, function(dataSet) {
				$scope.items = dataSet.items;
				$scope.afterSearch(dataSet.items);
			});
		};

		/**
		 * infinite scorll directive에서 호출 
		 * 
		 * @param  {Object}
		 * @param  {Function}
		 * @return N/A
		 */
		$scope.doSearch = function(params, callback) {
			RestApi.search('/settings.json', params, function(dataSet) {
				callback(dataSet);
			});
		};

		/**
		 * Settign 값 
		 * 'trip_interval' : 10
		 * 'batch_interval' : 10
		 * 'gps_interval' : 10
		 * 'map_refresh_interval' : 10
		 * 'stillcut_interval' : 10
		 * 'alert_away_interval' : 10
		 * 'speed_over' : 120
		 * 'speed_high' : 100
		 * 'speed_normal' : 80
		 * 'speed_slow' : 40
		 * 'map_refresh' : Y
		 * 'distance_unit' : km
		 * 'timezone' : Seoul
		 * 'format_date' : yyyy-MM-dd
		 * 'format_time' : HH:mm:ss
		 * 'content_base_url' : http://fms-server:8300
		 * 'alarm_impact' : Y
		 * 'alarm_g_sensor' : Y
		 * 'alarm_emergency' : Y
		 * 'alarm_geofence' : Y
		 * 'alarm_overspeed' : Y
		 * 'default_count_per_page' : 50
		 * 'default_grid_buffer_count' : 200
		 * 'language_setup_mode' : N
		 * 'lat' : 37.3892,
		 * 'lng' : 127.0896
		 * 
		 * @param  {Object}
		 * @return N/A
		 */
		$scope.afterSearch = function(dataSet) {
			angular.forEach(dataSet, function(data) {
				var property = data.name;
				if(property.indexOf('_interval') >= 0 || property.indexOf('speed_') >= 0 || property.indexOf('_count') >= 0 || property == 'lat' || property == 'lng') {
					$scope.settings[property] = data.value ? Number(data.value) : 0;
				} else {
					$scope.settings[property] = data.value;
				}
			});

			$scope.prevLangSetupMode = $scope.settings.language_setup_mode;
		};

		/**
		 * Check form validation
		 * 
		 * @return N/A
		 */
		$scope.checkValidForm = function() {
			if($scope.settings['map_refresh'] && $scope.settings['map_refresh'] == 'Y') {
				if(!$scope.settings['map_refresh_interval'] || $scope.settings['map_refresh_interval'] < 1) {
					$scope.showAlerMsg("Input Value unvaliable", "Map Refresh Interval is required, if Map Refresh option selected!");
					return false;
				}
			}

			return true;
		};

		/**
		 * Show Alert Message
		 * 
		 * @param  {String}
		 * @return {Boolean}
		 */
		$scope.showAlerMsg = function(title,msg) {
			ModalUtils.alert('sm', title, msg);
			return false;
		};

		/**
		 * Save - Create or Update
		 * 
		 * @return {Object}
		 */
		$scope.save = function() {
			var items = $scope.beforeSave();

			if (items.length > 0) {
				var url = '/settings/update_multiple.json';
				var result = RestApi.updateMultiple(url, null, items);
				result.$promise.then(
					function(results) {
						$scope.afterSave(results);
					}, 
					function(error) {
						ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
					});
			}
		};

		/**
		 * Before Save
		 * 
		 * @return {Array}
		 */
		$scope.beforeSave = function() {
			var settings = $scope.items.map(function(item) {
				return { id : item.id, name : item.name, value : $scope.settings[item.name].toString(), _cud_flag_ : 'u' };
			});

			for (property in $scope.settings) {
				if($scope.checkNewSetting(property)) {
					settings.push({ id : '', name : property, value : $scope.settings[property].toString(), _cud_flag_ : 'c' });
				}
			}

			console.log(settings);
			return settings;
		};

		/**
		 * Database에 저장되지 않은 새로운 설정인지 체크 
		 * 
		 * @param  {settingName}
		 * @return {Bollean}
		 */
		$scope.checkNewSetting = function(settingName) {
			var found = $scope.items.filter(function(item) {
				return item.name == settingName;
			});

			return (!found || found.length == 0) ? true : false;
		};

		/**
		 * After Save
		 * 
		 * @param  {Array}
		 */
		$scope.afterSave = function(results) {
			// Setting 값이 변경된 경우 Domain 저장 
			if($scope.settings.lat != DEFAULT_LAT || $scope.settings.lng != DEFAULT_LNG) {
				currentDomain.lat = $scope.settings.lat;
				currentDomain.lng = $scope.settings.lng;

				var result = RestApi.update('domains/' + currentDomain.id + '.json', null, currentDomain);
				result.$promise.then(
					function(data) {
						DEFAULT_LAT = currentDomain.lat;
						DEFAULT_LNG = currentDomain.lng;
						$scope.afterAllSave(results);

					}, function(error) {
						ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
					});

			// Setting 값이 변경되지 않은 경우 
			} else {
				$scope.afterAllSave(results);
			}
		};

		/**
		 * 모든 저장 처리가 끝난 후 ...
		 */
		$scope.afterAllSave = function(results) {
			$scope.refreshSetting(results);

			// Language Setup 모드 변경시 페이지 리로드 
			if($scope.prevLangSetupMode != $scope.settings.language_setup_mode) {
				ModalUtils.alert('sm', 'Mode Changed!', 'Mode was changed! So Application must be reload!', function() {
					$window.location.reload();
				});
			// 그렇지 않으면 성공 메시지 
			} else {
				$scope.showAlerMsg("Success", "Success to save!");
			}
		};

		/**
		 * Refresh Setting List
		 * 
		 * @return N/A
		 */
		$scope.refreshSetting = function(settings) {
			$scope.$emit('settings-value-change', settings);
			$scope.searchPreferences();
		};

	});