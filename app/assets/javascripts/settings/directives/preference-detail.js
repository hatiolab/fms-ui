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
		 * infinite scorll directive에서 호출 
		 * 
		 * @param  {Object}
		 * @return N/A
		 */
		$scope.afterSearch = function(dataSet) {
			$scope.settings = {
				'batch_interval' : Number($scope.getByName(dataSet,'batch_interval').value) ,
				'distance_unit' : $scope.getByName(dataSet,'distance_unit').value,
				'gps_interval' : Number($scope.getByName(dataSet,'gps_interval').value),
				'map_refresh_interval' : Number($scope.getByName(dataSet,'map_refresh_interval').value),
				'content_base_url' : $scope.getByName(dataSet,'content_base_url').value,
				'speed_high' : Number($scope.getByName(dataSet,'speed_high').value),
				'speed_over' : Number($scope.getByName(dataSet,'speed_over').value),
				'speed_slow' : Number($scope.getByName(dataSet,'speed_slow').value),
				'speed_normal' : Number($scope.getByName(dataSet,'speed_normal').value),				
				'stillcut_interval' : Number($scope.getByName(dataSet,'stillcut_interval').value),
				'trip_interval' : Number($scope.getByName(dataSet,'trip_interval').value),
				'map_refresh' : $scope.getByName(dataSet,'map_refresh').value,
				'alarm_impact' : $scope.getByName(dataSet,'alarm_impact').value,
				'alarm_g_sensor' : $scope.getByName(dataSet,'alarm_g_sensor').value,
				'alarm_emergency' : $scope.getByName(dataSet,'alarm_emergency').value,
				'alarm_geofence' : $scope.getByName(dataSet,'alarm_geofence').value,
				'alarm_overspeed' : $scope.getByName(dataSet,'alarm_overspeed').value,
				'timezone' : $scope.getByName(dataSet,'timezone').value,
				'format_date' : $scope.getByName(dataSet,'format_date').value,
				'format_time' : $scope.getByName(dataSet,'format_time').value,
				'default_count_per_page' : $scope.getByName(dataSet,'default_count_per_page').value,
				'default_grid_buffer_count' : $scope.getByName(dataSet,'default_grid_buffer_count').value,
				'language_setup_mode' : $scope.getByName(dataSet,'language_setup_mode').value,
				'lat' : DEFAULT_LAT,
				'lng' : DEFAULT_LNG,
			};

			$scope.prevLangSetupMode = $scope.settings.language_setup_mode;
		};

		/**
		 * get setting by name
		 */
		$scope.getByName = function (dataSet, param) {
			var result = $filter('filter')(dataSet, {'name' : param})[0];
			return result;
		}

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
				return { 
					id : item.id, 
					name : item.name,
					value : $scope.settings[item.name].toString(),
					_cud_flag_ : item.id ? 'u' : 'c'
				};
			});

			return settings;
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