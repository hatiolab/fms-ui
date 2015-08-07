angular.module('fmsSettings').directive('groupDetail', function() {
		return {
			restrict: 'E',
			controller: 'groupDetailCtrl',
			templateUrl: '/assets/settings/views/contents/groups.html',
			scope: {},
			link: function(scope, element, attr, groupDetailCtrl) {}
		};
	})
	.controller('groupDetailCtrl', function($rootScope, $scope, $resource, $element, $filter, ModalUtils, FmsUtils, RestApi) {
		/**
		 * Selected Driver Item
		 * 
		 * @type {Object}
		 */
		$scope.item = {};

		/**
		 * geofence List
		 */
		$scope.items = [];
		/**
		 * 검색 조건 모델 
		 */
		$scope.searchParams = {};
		/**
		 * smart table object
		 */
		$scope.tablestate = null;
		/**
		 * 처음 전체 페이지 로딩시는 fleet data 자동조회 하지 않는다.
		 */
		$scope.searchEnabled = false;

		$scope.geofenceHide = true;
		$scope.alarmTypeHide = true;

		/**
		 * group item selected
		 * 
		 * @param  {String}
		 * @param  handler function
		 */
		$rootScope.$on('setting-group-item-change', function(event, group) {
			$scope.item = group;
			$scope.searchGeoGroups();
			$scope.searchGeofences();
			FmsUtils.setGridContainerHieght('setting-group-relation-table-container');
		});

		/**
		 * 서버에 보내기위해 파라미터 변경  
		 */
		$scope.normalizeSearchParams = function(params) {
			var searchParams = {
				'_o[fleet_group_id]': 'asc'
			};

			if (!params || FmsUtils.isEmpty(params)) {
				return searchParams;
			}

			if (params.id) {
				searchParams["_q[fleet_group_id-eq]"] = params.id;
			}

			return searchParams;
		};

		/**
		 * Search Groups
		 */
		$scope.searchGeoGroups = function() {

			searchParams = $scope.beforeSearch();

			$scope.doSearch(searchParams, function(dataSet) {
				$scope.numbering(dataSet.items, 1);
				$scope.items = dataSet.items;
				$scope.afterSearch(dataSet);
			});
		};

		/**
		 * Search geofence
		 */
		$scope.searchGeofences = function() {
			searchParams = {};

			$scope.doGeofenceSearch(searchParams, function(dataSet) {
				$scope.geofences = dataSet.items;
			});
		};

		/**
		 * Items Numbering
		 * 
		 * @param  {Array}
		 * @param  {Number}
		 * @return N/A
		 */
		$scope.numbering = function(items, startNo) {
			for (var i = 0; i < items.length; i++) {
				items[i].no = i + 1;
				items[i].isEditable = true;
			}
		};



		/**
		 * infinite scorll directive에서 호출 
		 * 
		 * @return {Object}
		 */
		$scope.beforeSearch = function() {
			var searchParams = angular.copy($scope.item);
			return $scope.normalizeSearchParams(searchParams);
		};

		/**
		 * @param  {Object}
		 * @param  {Function}
		 * @return N/A
		 */
		$scope.doSearch = function(params, callback) {
			RestApi.search('/geofence_groups.json', params, function(dataSet) {
				callback(dataSet);
			});
		};

		$scope.doGeofenceSearch = function(params, callback) {
			RestApi.search('/geofences.json', params, function(dataSet) {
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

		};

		/**
		 * Check form validation
		 * 
		 * @return N/A
		 */
		$scope.checkValidForm = function() {
			if (!$scope.item.name || $scope.item.name == '') {
				return $scope.showAlerMsg('Name must not be empty!');
			}

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
			if (!$scope.checkValidForm()) {
				return;
			}

			if ($scope.item.id && $scope.item.id != '') {
				var url = '/fleet_groups/' + $scope.item.id + '.json';
				var result = RestApi.update(url, null, {
					fleet_group: $scope.item
				});
				result.$promise.then(function(data) {
					$scope.refreshList();
					var items = [];
					for (var i = 0; i < $scope.items.length; i++) {
						var relation = $scope.items[i];
						if (relation.fleet_group_id == '' || relation.geofence_id == null) {} else {
							items.push({
								id: relation.id,
								fleet_group_id: relation.fleet_group_id,
								geofence_id: relation.geofence_id,
								alarm_type: relation.alarm_type,
								_cud_flag_: relation.id ? "u" : "c"
							});
						}
					}

					if (items.length > 0) {
						var url = '/geofence_groups/update_multiple.json';
						var result = RestApi.updateMultiple(url, null, items);
						result.$promise.then(function(data) {
							$scope.refreshList();
							$scope.searchGeoGroups();
						});
					}
				});

			} else {
				var result = RestApi.create('/fleet_groups.json', null, {
					fleet_group: $scope.item
				});
				result.$promise.then(function(data) {
					$scope.refreshList();
					var items = [];
					for (var i = 0; i < $scope.items.length; i++) {
						var relation = $scope.items[i];
						if (relation.fleet_group_id == '' || relation.fleet_group_id == null) {} else {
							items.push({
								id: relation.id,
								fleet_group_id: relation.fleet_group_id,
								geofence_id: relation.geofence_id,
								alarm_type: relation.alarm_type,
								_cud_flag_: relation.id ? "u" : "c"
							});
						}
					}

					if (items.length > 0) {
						var url = '/geofence_groups/update_multiple.json';
						var result = RestApi.updateMultiple(url, null, items);
						result.$promise.then(function(data) {
							$scope.refreshList();
							$scope.searchGeoGroups();
						});
					}
				});
			}
		};

		/**
		 * Delete
		 * 
		 * @return N/A
		 */
		$scope.delete = function() {
			if (!$scope.item.id || $scope.item.id == '') {
				return;
			}

			ModalUtils.confirm('sm', 'Confirmation', 'Are you sure to delete?', function() {
				var result = RestApi.delete('/fleet_groups/' + $scope.item.id + '.json', null);
				result.$promise.then(function(data) {
					$scope.new();
					$scope.refreshList();
				});
			});
		};

		/**
		 * New
		 * 
		 * @return N/A
		 */
		$scope.new = function() {
			$scope.item = {};
			$scope.items = {};
		};

		/**
		 * Refresh Driver List
		 * 
		 * @return N/A
		 */
		$scope.refreshList = function() {
			$scope.$emit('setting-group-items-change', null);
		}

		/**
		 * add - Create
		 * 
		 * @return {Object}
		 */
		$scope.addGeofence = function() {
			$scope.items.push({
				'no': '',
				'geofence.name': '',
				'geofence.description': '',
				'geofence.alarm_type': '',
				'fleet_group_id': $scope.item.id
			});
			$scope.numbering($scope.items, 1);
		};

		/**
		 * rm - remove
		 * 
		 * @return {Object}
		 */
		$scope.rmGeofence = function() {
			var result = [];
			result = $filter('filter')($scope.items, {'deleteFlage':true});
			for(var i=0; i<result.length; i++){
				var index = $scope.items.indexOf(result[i]);
				if (index !== -1) {
					$scope.items.splice(index, 1);
				}
			}
		};
		$scope.showdata = function() {};
		// --------------------------- E N D ----------------------------
	});