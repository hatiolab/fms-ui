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
	.controller('preferenceDetailCtrl', function($rootScope, $scope, $filter, $resource, $element, RestApi) {

		
		/**
		 * Rails Server의 스펙에 맞도록 파라미터 변경 ...
		 *
		 * @param  {Object}
		 */
		$scope.normalizeSearchParams = function(params) {
			var searchParams = {'_o[name]' : 'asc'};

			if(!params || FmsUtils.isEmpty(params)) {
				return searchParams;
			} 

			return searchParams;
		};

		/**
		 * Search Groups
		 */
		$scope.searchPreferences = function(searchParams) {

			searchParams = $scope.normalizeSearchParams(searchParams);

			$scope.doSearch(searchParams, function(dataSet) {
				$scope.items = dataSet.items;
				$scope.afterSearch(dataSet.items);
				console.log(dataSet.items.name);
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
			$scope.settings={
				'batch_interval' : Number($scope.getByName(dataSet,'batch_interval').value) ,
				'distance_unit' : $scope.getByName(dataSet,'distance_unit').value,
				'gps_interval' : Number($scope.getByName(dataSet,'gps_interval').value),
				'map_refresh_interval' : Number($scope.getByName(dataSet,'map_refresh_interval').value),
				'speed_high' : Number($scope.getByName(dataSet,'speed_high').value),
				'speed_over' : Number($scope.getByName(dataSet,'speed_over').value),
				'speed_slow' : Number($scope.getByName(dataSet,'speed_slow').value),
				'speed_normal' : Number($scope.getByName(dataSet,'speed_normal').value),				
				'stillcut_interval' : Number($scope.getByName(dataSet,'stillcut_interval').value),
				'trip_interval' : Number($scope.getByName(dataSet,'trip_interval').value),
				'map_refresh' : $scope.getByName(dataSet,'map_refresh').value
			};
		};

		/**
		 * 
		 */
		$scope.getByName = function (dataSet, param) {
			var result = $filter('filter')(dataSet, {'name':param})[0];
			return result;
		}

		/**
		 * Check form validation
		 * 
		 * @return N/A
		 */
		$scope.checkValidForm = function() {

			return true;
		};

		/**
		 * Show Alert Message
		 * 
		 * @param  {String}
		 * @return {Boolean}
		 */
		$scope.showAlerMsg = function(msg) {
			ModalUtils.alert('sm', 'Alert', msg);
			return false;
		};

		/**
		 * Save - Create or Update
		 * 
		 * @return {Object}
		 */
		$scope.save = function() {
			var items = [];

			for(var i =0; i<$scope.items.length; i++){
				var item = $scope.items[i];
				items.push({
					id : item.id,
					value : $scope.settings[item.name].toString(),
					_cud_flag_ : "u"
				});
			}

			if (items.length > 0) {
				var url = '/settings/update_multiple.json';
				var result = RestApi.updateMultiple(url, null,items);
				result.$promise.then(function(data) {
					$scope.refreshSetting();
				});
			}
		};	

		/**
		 * Refresh Driver List
		 * 
		 * @return N/A
		 */
		$scope.refreshSetting = function() {
			$scope.$emit('settings-value-change', null);
		}

	});