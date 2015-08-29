angular.module('fmsMonitor').directive('monitorSideFleets', function() {
	return {
		restrict: 'E',
		controller: 'sideFleetsCtrl',
		templateUrl: '/assets/monitor/views/sidebar/monitor-side-fleets.html',
		scope: {},
		link : function(scope, element, attr, sideFleetsCtrl) {
			// 버튼이 Directive Element 바깥쪽에 있어서 버튼 클릭함수를 이용 ...
			var refreshButton = angular.element('.panel-refresh');
			refreshButton.bind("click", function() {
				var fleetTab = angular.element('#fleetTab');
				// side-fleets 탭이 액티브 된 경우만 호출
				if(fleetTab.hasClass('active')) {
					scope.search(scope.tablestate);
				}
      });
		}
	};
})

.controller('sideFleetsCtrl', function($rootScope, $scope, $element, GridUtils, ConstantSpeed, GridUtils, FmsUtils, RestApi) {

	/**
	 * 처음 전체 페이지 로딩시는 fleet data 자동조회 하지 않는다.
	 */
	$scope.searchEnabled = false;
	/**
	 * 검색 조건 
	 */
	$scope.searchParams = {};
	/**
	 * smart table object
	 */
	$scope.tablestate = null;

	/**
	 * 조회 조건 파라미터 정규화 
	 */
	$scope.normalizeSearchParams = function(params) {
		var searchParams = { '_o[name]' : 'asc' };

		if(!params || FmsUtils.isEmpty(params)) {
			return searchParams;
		} 

		if(params.fleet_group_id) {
			searchParams["_q[fleet_group_id-eq]"] = params.fleet_group_id;
		}

		FmsUtils.getSpeedLangeCondition(params, searchParams);
		return searchParams;
	};

	/**
	 * 속도 구간 조건 설정 
	 * 
	 * @param {String}
	 */
	$scope.setSpeed = function(speedRange, id) {
		var anchor = $element.find('#' + id);
		var val = $scope.searchParams['speed_' + speedRange];

		if(val) {
			$scope.searchParams['speed_' + speedRange] = false;
			anchor.removeClass('active');
		} else {
			$scope.searchParams['speed_' + speedRange] = true;
			anchor.addClass('active');
		}
	};

	/**
	 * search events
	 */
	 $scope.search = function(tablestate) {
	 	if(!$scope.searchEnabled) {
	 		$scope.searchEnabled = true;
	 		$scope.tablestate = tablestate;
	 		$scope.tablestate.pagination.number = GridUtils.getGridCountPerPage();
	 	}

	 	if(tablestate) {
	 		$scope.tablestate = tablestate;
	 	}

 		var searchParams = $scope.beforeSearch();
		$scope.setPageQueryInfo(searchParams, $scope.tablestate.pagination, 0, GridUtils.getGridCountPerPage());

    $scope.doSearch(searchParams, function(dataSet) {
      $scope.numbering(dataSet.items, 1);
      $scope.items = dataSet.items;
      $scope.afterSearch(dataSet);
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
	 	for(var i = 0 ; i < items.length ; i++) {
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
	 };

	 /**
	  * 페이지네이션 결과 정보를 설정한다. 
	  * 
	  * @param {Number}
	  * @param {Number}
	  * @param {Number}
	  */
	 $scope.setPageReultInfo = function(total_count, total_page, current_page) {
		$scope.tablestate.pagination.totalItemCount = total_count;
		$scope.tablestate.pagination.numberOfPages = total_page;
		$scope.tablestate.pagination.currentPage = current_page; 		
	 };

	 /**
	  * infinite scorll directive에서 호출 
	  * 
	  * @return {Object}
	  */
	 $scope.beforeSearch = function() {
	 	var searchParams = angular.copy($scope.searchParams);
	 	searchParams.fleet_group_id = searchParams.group ? searchParams.group.id : '';
	 	$scope.isLoading = true;
	 	return $scope.normalizeSearchParams(searchParams);
	 };

	 /**
	  * infinite scorll directive에서 호출 
	  * 
	  * @param  {Object}
	  * @param  {Function}
	  * @return N/A
	  */
	 $scope.doSearch = function(params, callback) {
	 	RestApi.search('/fleets.json', params, function(dataSet) {
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
		FmsUtils.setSpeedClasses($scope.items);
		$scope.speedRangeSummaries = FmsUtils.getSpeedSummaries($scope.items);
		$scope.$emit('monitor-fleet-list-change', $scope.items);
		GridUtils.setGridContainerHieght('monitor-fleet-table-container');
		$scope.isLoading = false;
	 };	

	/**
	 * show fleet info window to map
	 */
	$scope.showFleetInfo = function(fleet) {
		if(!$scope.ignoreShowFleetInfo) {
			$scope.setActiveItem(fleet);
			$scope.$emit('monitor-fleet-info-change', fleet);
		} else {
			$scope.ignoreShowFleetInfo = false;			
		}
	};

	/**
	 * showFleetInfo를 무시할 지 여부 : Trip버튼 클릭시에는 showFleetInfo와 goTrip이 동시에 호출되므로 이 때는 showFleetInfo 무시 
	 */
	$scope.ignoreShowFleetInfo = false;

	/**
	 * show trip to map
	 */
	$scope.goTrip = function(fleet) {
		$scope.ignoreShowFleetInfo = true;
		$scope.setActiveItem(fleet);
		$scope.$emit('monitor-fleet-trip-change', fleet);
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
	 * map refresh 
	 */	
	var refreshListener = $rootScope.$on('monitor-refresh-fleet', function(evt, value) {
		// TODO Refresh는 Items Start ~ End No.로 조회한다.
		$scope.search($scope.tablestate);
	});

	/**
	 * [watch searchParams in page scope, if changed trigger pageFleets in same scope]
	 * @param  $scope.searchParams
	 * @return null
	 */
	$scope.$watchCollection('searchParams', function() {
		if($scope.searchEnabled) {
			$scope.search($scope.tablestate);
		}
	});

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		refreshListener();
	});	

	/**
	 * 초기화 함수 
	 */
	$scope.init = function() {
		$scope.isLoading = false;
	};

	$scope.init();

});
