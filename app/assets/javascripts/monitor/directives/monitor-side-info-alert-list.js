angular.module('fmsMonitor').directive('monitorSideInfoAlertList', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorSideInfoAlertListCtrl',
		templateUrl: '/assets/monitor/views/sidebar/monitor-side-info-alert-list.html',
		scope: {}
	}; 
})
.controller('monitorSideInfoAlertListCtrl', function($rootScope, $scope, $element, GridUtils, FmsUtils, RestApi) {
	/**
	 * 기본 날짜 검색일 설정 
	 */
	var period = FmsUtils.getPeriodString(3);	
	/**
	 * 현재 선택된 trip id
	 */
	$scope.tripId = null;
	/**
	 * smart table object
	 */
	$scope.tablestate = null;
	/**
	 * 처음 전체 페이지 로딩시는 event data 자동조회 하지 않는다.
	 */
	$scope.searchEnabled = false;
	/**
	 * 폼 모델 초기화 
	 */
	$scope.searchParams = { 'ctm_gte' : period[0], 'ctm_lte' : period[1] };
	/**
	 * count per page 
	 * @type {Number}
	 */
	$scope.countPerPage = GridUtils.getGridCountPerPage();
	/**
	 * Alert list items
	 * @type {Array}
	 */
	$scope.items = [];

	/**
	 * Normalize parameters
	 */
	$scope.normalizeSearchParams = function() {
		var searchParams = {
			"_q[tid-eq]" : $scope.tripId,
			"_o[etm]" : "desc",
			"start" : $scope.tablestate.pagination.start,
			"limit" : $scope.countPerPage
		};

		$scope.tablestate.pagination.number = searchParams.limit;
		// convert date to number
		FmsUtils.buildDateConds(searchParams, 'ctm', $scope.searchParams['ctm_gte'], $scope.searchParams['ctm_lte']);
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
	 * call by pagination
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

		return $scope.tripId ? true : false;
	};

	/**
	 * infinite scorll directive에서 호출 
	 * 
	 * @return {Object}
	 */
	$scope.beforeSearch = function() {
		return $scope.normalizeSearchParams();
	};

	/**
	 * infinite scorll directive에서 호출 
	 * 
	 * @param  {Object}
	 * @param  {Function}
	 * @return N/A
	 */
	$scope.doSearch = function(params, callback) {
		RestApi.search('/events.json', params, function(dataSet) {
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
		FmsUtils.setEventTypeClasses($scope.items);
		FmsUtils.setEventTypeNames($scope.items);
		GridUtils.setGridContainerHieght('monitor-side-info-alert-table-container');
	};

	/**
	 * Sidebar에서 Trip 선택시 이벤트 
	 */
	$scope.$on('monitor-trip-info-change', function(evt, tripData) {
		if(!tripData.from || tripData.from != 'infobar') {
			$scope.tripId = tripData.id;
			$scope.tablestate.pagination.start = 0;
			$scope.tablestate.pagination.number = $scope.countPerPage;
			$scope.search();
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
	$scope.goTrip = function(alert) {
		$scope.setActiveItem(alert);
		$scope.$emit('monitor-event-trip-change', alert);
	};

	/**
	 * Alert 선택시 
	 */
	$scope.showAlertWindow = function(alert) {
		alert.from = 'infobar';
		$rootScope.$broadcast('monitor-event-info-change', alert);
	};

	/**
	 * 초기화 함수 
	 * 
	 * @return N/A
	 */
	$scope.init = function() {
		/**
		 * Table container size 설정 
		 */
		GridUtils.setGridContainerHieght('monitor-side-info-alert-table-container');
	};
	
	$scope.$watchCollection('searchParams', function() {
		if($scope.searchEnabled) {
			$scope.search($scope.tablestate);
		}
	});
	/**
	 * 초기화 
	 */
	$scope.init();	

});