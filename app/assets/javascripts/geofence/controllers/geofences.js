angular.module('fmsGeofence',['uiGmapgoogle-maps'])
.controller('GeofenceCtrl', function($rootScope, $scope, $resource, $element, ConstantSpeed, FmsUtils, ModalUtils, RestApi) {
	
	/**
	 * 사이드 바 토글 변수
	 */
	$scope.isSidebarToggle = true;
	/**
	 * 폼 모델 초기화 
	 */
	$scope.geofenceSearchParams = {};
	/**
	 * [tablestate smart table object]
	 * @type {[object]}
	 */
	$scope.tablestate = null;
	/**
	 * [처음 전체 페이지 로딩시는 자동조회 하지 않는다.]
	 * @type {Boolean}
	 */
	$scope.geofenceInit = false;
	/**
	 * 선택된 Geofence
	 * @type {object}
	 */
	$scope.geofence = { id : '', name : '', description : '' };

	/**
	 * Rails Server의 스펙에 맞도록 파라미터 변경 ...
	 */
	this.convertSearchParams = function(params) {
		var searchParams = {'_o[name]' : 'asc'};

		if(!params || FmsUtils.isEmpty(params)) {
			return searchParams;
		} 

		searchParams['_q[name-like]'] = params.name;
		searchParams['_q[description-like]'] = params.description;
		return searchParams;
	};

	$scope.normalizeSearchParams = this.convertSearchParams;

	/**
	 * [search geofences]
	 * @param  {[object]} params [searchParams]
	 * @return N/A
	 */
	this.searchGeofences = function(params) {
		var searchParams = params;
		if(!params || params == {}) {
			searchParams = angular.copy($scope.geofenceSearchParams);
		}

		searchParams = $scope.normalizeSearchParams(searchParams);
		RestApi.search('/geofences.json', searchParams, function(dataSet) {
			$scope.geofences = dataSet;
			$scope.geofenceItems = dataSet.items;
			FmsUtils.setGridContainerHieght('geofence-table-container');
			$scope.$emit('monitor-geofence-list-change', $scope.geofences);
		});
	};

	$scope.findGeofences = this.searchGeofences;

	/**
	 * [pagegeofences call search by pagenation]
	 * @param  {[object]} tablestate [smart table object]
	 * @return N/A
	 */
	$scope.pageGeofences = function(tablestate) {
		if(!$scope.geofenceInit) {
			$scope.geofenceInit = true;
			$scope.tablestate = tablestate;
		}

		if(tablestate) {
			$scope.tablestate = tablestate;
			$scope.tablestate.pagination.number = 1000;
		}

		var searchParams = angular.copy($scope.geofenceSearchParams);
		searchParams = $scope.normalizeSearchParams(searchParams);
		searchParams.start = $scope.tablestate.pagination.start;
		searchParams.limit = $scope.tablestate.pagination.number;

		RestApi.search('/geofences.json', searchParams, function(dataSet) {
			$scope.geofences = dataSet;
			$scope.geofenceItems = dataSet.items;
			$scope.tablestate.pagination.totalItemCount = dataSet.total;
			$scope.tablestate.pagination.numberOfPages = dataSet.total_page;
			FmsUtils.setGridContainerHieght('geofence-table-container');
			$scope.$emit('monitor-geofence-list-change', $scope.fleets);
		});
	};

	/**
	 * [showgeofenceInfo show geofence info window to map]
	 * @param  {[object]} geofence [call geofence information one by one]
	 * @return N/A
	 */
	$scope.goGeofence = function(geofence) {
		if(geofence) {
			$scope.setActiveItem(geofence);
			$scope.geofence = angular.copy(geofence);
			$scope.$emit('geofence-item-selected', geofence);
		}
	};

	/**
	 * active item
	 * 
	 * @param {Object}
	 */
	$scope.setActiveItem = function(activeItem) {
		for(var i = 0 ; i < $scope.geofenceItems.length ; i++) {
			var item = $scope.geofenceItems[i];
			item.active = (item.id == activeItem.id);
		}
	};

	/**
	 * save polygon
	 * 
	 * @return {[type]}
	 */
	$scope.saveGeofence = function() {
		if(!$scope.checkValidForm()) {
			return;
		}

		if($scope.geofence.id && $scope.geofence.id != '') {
			var url = '/geofences/' + $scope.geofence.id + '.json';
			var result = RestApi.update(url, null, {geofence : $scope.geofence});
			result.$promise.then(function(data) {
				$scope.refreshList();
			});

		} else {
			var result = RestApi.create('/geofences.json', null, {geofence : $scope.geofence});
			result.$promise.then(function(data) {
				$scope.refreshList();
			});
		}
	};

	/**
	 * Check form validation
	 * 
	 * @return N/A
	 */
	$scope.checkValidForm = function() {
		if(!$scope.geofence.name || $scope.geofence.name == '') {
			ModalUtils.alert('sm', 'Alert', 'Name must not be empty!');
			return false;
		}

		return true;
	};

	/**
	 * delete polygon
	 * 
	 * @return {[type]}
	 */
	$scope.deleteGeofence = function() {
		if(!$scope.geofence.id || $scope.geofence.id == '') {
			return;
		}

		ModalUtils.confirm('sm', 'Confirmation', 'Are you sure to delete?', function() {
			var result = RestApi.delete('/geofences/' + $scope.geofence.id + '.json', null);
			result.$promise.then(function(data) {
				$scope.refreshList();
			});
		});
	};

	/**
	 * reset polygon
	 * 
	 * @return {[type]}
	 */
	$scope.resetGeofence = function() {
		$scope.geofence.id = '';
		$scope.geofence.name = '';
		$scope.geofence.description = '';
		$scope.$emit('geofence-item-new', $scope.geofence);
	};

	/**
	 * @return {[type]}
	 */
	$scope.refreshList = function() {
		$scope.resetGeofence();
		$scope.pageGeofences(null);
	};

	/**
	 * [watch geofenceSearchParams in page scope, if changed trigger pageFleets in same scope]
	 * @param  $scope.geofenceSearchParams
	 * @return null
	 */
	$scope.$watchCollection('geofenceSearchParams', function() {
		if($scope.geofenceInit) {
			$scope.refreshList();
		}
	});

	/**
	 * geofence item selected
	 * 
	 * @param  {eventName}
	 * @param  handler function
	 */
	var itemChangeListener = $rootScope.$on('geofence-items-change', function(event, geofence) {
		$scope.resetGeofence();
		$scope.pageGeofences(null);
	});
	
  /**
   * Destroy Scope - RootScope Event Listener 정리 
   */
  $scope.$on('$destroy', function(event) {
    itemChangeListener();
  });

	/**
	 * Bind Search Button Click Event
	 */
	$element.find('#searchGeofences').bind("click", function() {
		$scope.pageGeofences(null);
	});

});