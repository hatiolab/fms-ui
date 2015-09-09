angular.module('fmsGeofence').directive('settingList', function() {
	return {
		restrict: 'E',
		controller: 'settingListCtrl',
		templateUrl: '/assets/geofence/views/sidebars/settings.html',
		scope: {},
		link: function(scope, element, attr, settingListCtrl) {
			var refreshButton = element.find('#searchGeofenceSettings');
			refreshButton.bind("click", function() {
				scope.search(scope.tablestate);
			});
		}
	};
})

.controller('settingListCtrl', function($rootScope, $scope, $element, $state, $stateParams, GridUtils, FmsUtils, ModalUtils, RestApi) {
	/**
	 * admin mode
	 */
	$scope.adminFlag = login.admin_flag;
	/**
	 * Geofence List
	 */
	$scope.items = [];
	/**
	 * Selected Geofence Item
	 */
	$scope.item = { id : '', name : '', description : '' };
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
		var searchParams = {'_o[name]' : 'asc'};

		if(!params || FmsUtils.isEmpty(params)) {
			return searchParams;
		} 

		searchParams['_q[name-like]'] = params.name;
		searchParams['_q[description-like]'] = params.description;
		return searchParams;			
	};

	/**
	 * Search Groups
	 */
	$scope.search = function(tablestate) {
		if($scope.checkSearch(tablestate)) {
			var searchParams = $scope.beforeSearch();
			$scope.doSearch(searchParams, function(dataSet) {
				$scope.numbering(dataSet.items, 1);
				$scope.items = dataSet.items;
				$scope.afterSearch(dataSet);
			});
		}
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
		}
	};

	/**
	 * 페이지네이션 검색 정보를 설정한다. 
	 *
	 * @param {Object}
	 * @param {Object}
	 * @param {Number}
	 * @param {Number}
	 */
	$scope.setPageQueryInfo = function(searchParams, pagination, start, limit) {
		searchParams.start = start;
		searchParams.limit = limit;
		pagination.start = start;
		pagination.number = limit;
	}

	/**
	 * 페이지네이션 결과 정보를 설정한다. 
	 * 
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 */
	$scope.setPageReultInfo = function(total_count, total_page, current_page) {
		if ($scope.tablestate && $scope.tablestate.pagination) {
			$scope.tablestate.pagination.totalItemCount = total_count;
			$scope.tablestate.pagination.numberOfPages = total_page;
			$scope.tablestate.pagination.currentPage = current_page;
		}
	};

	/**
	 * Check Search
	 * 
	 * @return {Boolean}
	 */
	$scope.checkSearch = function(tablestate) {
		if(!$scope.searchEnabled) {
			$scope.searchEnabled = true;
			$scope.tablestate = tablestate;
			$scope.tablestate.pagination.number = GridUtils.getGridCountPerPage();
		}

		if(tablestate) {
			$scope.tablestate = tablestate;
		}

		return true;
	};

	/**
	 * infinite scorll directive에서 호출 
	 * 
	 * @return {Object}
	 */
	$scope.beforeSearch = function() {
 		var searchParams = $scope.normalizeSearchParams($scope.searchParams);
 		$scope.setPageQueryInfo(searchParams, $scope.tablestate.pagination, 0, GridUtils.getGridCountPerPage());
 		return searchParams;			
	};

	/**
	 * infinite scorll directive에서 호출 
	 * 
	 * @param  {Object}
	 * @param  {Function}
	 * @return N/A
	 */
	$scope.doSearch = function(params, callback) {
		RestApi.search('/geofences/list.json', params, function(dataSet) {
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
		$scope.setPageReultInfo(dataSet.total, dataSet.total_page, dataSet.page);
		// grid container를 새로 설정한다.
		GridUtils.setGridContainerHieght('geofence-setting-table-container');
		// Geofence Detail 이동 
		if($stateParams.geofence) {
			$scope.goItem($stateParams.geofence);
		}
	};

	/**
	 * Show group info to contents
	 * 
	 * @param  {Object}
	 * @return N/A
	 */
	$scope.goItem = function(item) {
		if(item && item.id) {
			$scope.setActiveItem(item);
			$scope.item = angular.copy(item);
			$scope.$emit('geofence-item-selected', item);
		}
	};

	/**
	 * active item
	 * 
	 * @param {Object}
	 */
	$scope.setActiveItem = function(activeItem) {
		for(var i = 0 ; i < $scope.items.length ; i++) {
			var item = $scope.items[i];
			item.active = (item.id == activeItem.id);
		}
	};

	/**
	 * Watch fleetSearchParams in page scope, if changed trigger pageFleets in same scope
	 * 
	 * @param  {String}
	 * @return N/A
	 */
	$scope.$watchCollection('searchParams', function() {
		if ($scope.searchEnabled) {
			$scope.search($scope.tablestate);
		}
	});

	/**
	 * save geofence
	 * 
	 * @return {[type]}
	 */
	$scope.saveItem = function() {
		if(!$scope.checkValidForm()) {
			return;
		}

		if($scope.item.id && $scope.item.id != '') {
			var url = '/geofences/' + $scope.item.id + '.json';
			var result = RestApi.update(url, null, {geofence : $scope.item});
			result.$promise.then(
				function(data) {
					ModalUtils.success('Success', 'Success To Save');
					$scope.search($scope.tablestate);
				}, function(error) {
					ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
				});

		} else {
			RestApi.checkUnique('/geofences/show_by_name.json?name='+$scope.item.name,null,
				function() {
					var result = RestApi.create('/geofences.json', null, {geofence : $scope.item});
					result.$promise.then(
						function(data) {
							ModalUtils.success('Success', 'Success To Save');
							$scope.search($scope.tablestate);
						}, function(error) {
							ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
						});
				}, 
				function(data) {
					ModalUtils.alert('sm', 'Error', 'Requested Data Already Exists!');
				},
				function(error) {
					ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
				});
		}
	};

	/**
	 * Check form validation
	 * 
	 * @return N/A
	 */
	$scope.checkValidForm = function() {
		var form = $scope.geofenceSettingForm;
		var keys = ['Name','Description'];

		for(var i = 0 ; i < keys.length ; i++) {
			var input = form[keys[i]];
			if(input) {
				if(!FmsUtils.isEmpty(input.$error)) {
					if(input.$error.required) {
						return $scope.showAlerMsg(input.$name + ' must not be empty!');
					} else if(input.$error.maxlength) {
						return $scope.showAlerMsg(input.$name + ' value length is over max length!');
					} else if(input.$error.minlength) {
						return $scope.showAlerMsg(input.$name + ' value length is under min length!');
					}	else if(input.$error.email) {
						return $scope.showAlerMsg(input.$name + ' value is invalid email format!');
					}
				}
			}
		}

		return true;
	};
	
	$scope.showAlerMsg = function(msg) {
		ModalUtils.alert('sm', 'Alert', msg);
		return false;
	};
	/**
	 * Form이 유효한 지 체크 
	 * @return {Boolean}
	 */
	$scope.isFormValid = function() {
		var form = $scope.geofenceSettingForm;
		if(!form){
			return false;
		}else{
			//return form.$dirty && form.$valid;
			return form.$dirty;
		}
	};
	/**
	 * delete polygon
	 * 
	 * @return {[type]}
	 */
	$scope.deleteItem = function() {
		if(!$scope.item.id || $scope.item.id == '') {
			return;
		}

		ModalUtils.confirm('sm', 'Confirmation', 'Are you sure to delete?', function() {
			var result = RestApi.delete('/geofences/' + $scope.item.id + '.json', null);
			result.$promise.then(
				function(data) {
					$scope.resetItem();
					$scope.search($scope.tablestate);
				}, function(error) {
					ModalUtils.alert('sm', 'Error', 'Status : ' + error.status + ', ' + error.statusText);
				});
		});
	};

	/**
	 * Assign Group
	 */
	$scope.assignGroup = function(geofence) {
		$state.go('geofence.relations', { 'geofence': geofence }, { reload : true });
	};

	/**
	 * reset polygon
	 * 
	 * @return {[type]}
	 */
	$scope.resetItem = function() {
		$scope.item.id = '';
		$scope.item.name = '';
		$scope.item.description = '';
		$scope.$emit('geofence-item-new', $scope.item);
	};		

	/**
	 * geofence item selected
	 * 
	 * @param  {eventName}
	 * @param  handler function
	 */
	var itemsChangeListener = $rootScope.$on('geofence-items-change', function(event, geofence) {
		$scope.resetItem();
		$scope.search($scope.tablestate);
	});

	/**
	 * Destroy Scope - RootScope Event Listener 정리 
	 */
	$scope.$on('$destroy', function(event) {
	  itemsChangeListener();
	});
	  
});