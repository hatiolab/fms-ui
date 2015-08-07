angular.module('fmsSettings').directive('groupDetail', function() {
		return {
			restrict: 'E',
			controller: 'groupDetailCtrl',
			templateUrl: '/assets/settings/views/contents/groups.html',
			scope: {},
			link : function(scope, element, attr, groupDetailCtrl) {
			}
		};
	})
	.controller('groupDetailCtrl', function($rootScope, $scope, $resource, $element, ModalUtils, FmsUtils, RestApi) {
		/**
		 * Selected Driver Item
		 * 
		 * @type {Object}
		 */
		$scope.item = {};

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
					driver: $scope.item
				});
				result.$promise.then(function(data) {
					$scope.refreshList();
				});

			} else {
				var result = RestApi.create('/fleet_groups.json', null, {
					driver: $scope.item
				});
				result.$promise.then(function(data) {
					$scope.refreshList();
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
			console.log(1);
			$scope.items.push({'no':'','geofence.name':'','geofence.description':'','geofence.alarm_type':''});
			$scope.numbering($scope.items, 1);
		};

		/**
		 * rm - remove
		 * 
		 * @return {Object}
		 */
		$scope.rmGeofence = function() {
			// if(!$scope.checkValidForm()) {
			// 	return;
			// }

			// if($scope.item.id && $scope.item.id != '') {
			// 	var url = '/fleet_groups/' + $scope.item.id + '.json';
			// 	var result = RestApi.update(url, null, {driver : $scope.item});
			// 	result.$promise.then(function(data) {
			// 		$scope.refreshList();
			// 	});

			// } else {
			// 	var result = RestApi.create('/fleet_groups.json', null, {driver : $scope.item});
			// 	result.$promise.then(function(data) {
			// 		$scope.refreshList();
			// 	});
			// }
		};


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

			if (params.name) {
				searchParams["_q[fleet_group_id-like]"] = params.fleet_group_id;
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
			console.log($scope.geofences);
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

		$scope.geofenceHide =true;
		$scope.alarmTypeHide = true;
		// --------------------------- E N D ----------------------------
	});