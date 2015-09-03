angular.module('fmsMonitor').directive('monitorSideInfoTripList', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorSideInfoTripListCtrl',
		templateUrl: '/assets/monitor/views/sidebar/monitor-side-info-trip-list.html',
		scope: {}
	}; 
})
.controller('monitorSideInfoTripListCtrl', function($rootScope, $scope, $resource, $element, GridUtils, FmsUtils, RestApi) {
	
	/**
	 * 기본 날짜 검색일 설정 
	 * @type {Array}
	 */
	var period = FmsUtils.getPeriodString(3);
	/**
	 * 폼 모델 초기화 
	 * @type {Object}
	 */
	$scope.searchParams = { 'etm_gte' : period[0], 'etm_lte' : period[1] };
	/**
	 * Fleet Trip List
	 * @type {Array}
	 */
	$scope.items = [];
	/**
	 * 현재 Trip Data
	 * @type {Object}
	 */
	$scope.trip = null;	
	/**
	 * smart table object
	 * @type {Object}
	 */
	$scope.tablestate = null;
	/**
	 * 처음 전체 페이지 로딩시는 event data 자동조회 하지 않는다.
	 * @type {Boolean}
	 */
	$scope.searchEnabled = false;
	/**
	 * Count per page 
	 * @type {Number}
	 */
	$scope.countPerPage = GridUtils.getGridCountPerPage();

	/**
	 * Normalize parameters
	 */
	$scope.normalizeSearchParams = function() {
		var searchParams = {
			"_q[fid-eq]" : $scope.trip.fid,
			"_o[etm]" : "desc",
			"start" : $scope.tablestate.pagination.start,
			"limit" : $scope.countPerPage
		};

		// convert date to number
		FmsUtils.buildDateConds(searchParams, 'etm', $scope.searchParams['etm_gte'], $scope.searchParams['etm_lte']);
		$scope.tablestate.pagination.number = searchParams.limit;
		return searchParams;		
	};

	/**
	 * 페이지네이션 결과 정보를 설정한다. 
	 * 
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 */
	$scope.setPageReultInfo = function(total_count, total_page, current_page) {
		if($scope.tablestate && $scope.tablestate.pagination) {
			$scope.tablestate.pagination.totalItemCount = total_count;
			$scope.tablestate.pagination.numberOfPages = total_page;
			$scope.tablestate.pagination.currentPage = current_page;
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
	 * Search
	 */
	$scope.search = function(tablestate) {
		if($scope.checkSearch(tablestate)) {
			var searchParams = $scope.beforeSearch();
			$scope.doSearch(searchParams, function(dataSet) {
				$scope.items = dataSet.items;
				$scope.afterSearch(dataSet);
			});
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
			$scope.tablestate.pagination.number = $scope.countPerPage;
		}

		if(tablestate) {
			$scope.tablestate = tablestate;
		}

		return $scope.trip ? true : false;
	};

	/**
	 * infinite scorll directive에서 호출 
	 * 
	 * @return {Object}
	 */
	$scope.beforeSearch = function() {
		var searchParams = $scope.normalizeSearchParams();
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
		RestApi.search('/trips.json', params, function(dataSet) {
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
		$scope.numbering(dataSet.items, 1);
		GridUtils.setGridContainerHieght('monitor-side-info-trip-table-container');
		$scope.setActiveItem($scope.trip);
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
			items[i].no = startNo + i;
		}
	};

	/**
	 * Trip 선택 조회시
	 */
	$scope.$on('monitor-trip-info-change', function(evt, tripData) {
		if(!$scope.trip || $scope.trip.id != tripData.id) {
			$scope.trip = tripData;
			var tripStartDate = FmsUtils.formatDate(tripData.stm, 'yyyy-MM-dd');

			// 검색 조건이 시작일이 트립의 날짜보다 크면 검색이 안 되므로 검색 시작일을 트립 날짜로 변경
			if(tripStartDate < $scope.searchParams.etm_gte) {
				$scope.searchParams.etm_gte = tripStartDate;
			}

			$scope.tablestate.pagination.start = 0;
			$scope.tablestate.pagination.number = $scope.countPerPage;
			$scope.search($scope.tablestate);
		}
	});

	/**
	 * active item
	 * 
	 * @param {Object}
	 */
	$scope.setActiveItem = function(item) {
		// 선택 아이템 변경 
		$scope.trip = item;		
		for (var i = 0; i < $scope.items.length; i++) {
			var item = $scope.items[i];
			item.active = (item.id == $scope.trip.id);
		}
	};	

	/**
	 * Trip 선택시 
	 */
	$scope.goTrip = function(trip) {
		$scope.setActiveItem(trip);
		$scope.$emit('monitor-info-trip-change', trip);
	};

	/**
	 * Watch SearchParams
	 */
	$scope.$watchCollection('searchParams', function() {
		if($scope.searchEnabled) {
			$scope.search($scope.tablestate);
		}
	});	

	/**
	 * 초기화 함수 
	 * 
	 * @return N/A
	 */
	$scope.init = function() {
		/**
		 * Table container size 설정 
		 */
		GridUtils.setGridContainerHieght('monitor-side-info-trip-table-container');
	};

	/**
	 * 초기화 
	 */
	$scope.init();	

});