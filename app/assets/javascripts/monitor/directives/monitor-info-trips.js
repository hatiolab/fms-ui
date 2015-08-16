angular.module('fmsMonitor').directive('monitorInfoTrips', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorTripsCtrl',
		templateUrl: '/assets/monitor/views/infobar/monitor-info-trips.html',
		scope: {}
	}; 
})
.controller('monitorTripsCtrl', function($rootScope, $scope, $resource, $element, GridUtils, FmsUtils, RestApi) {
	/**
	 * 기본 날짜 검색일 설정 
	 */
	var period = FmsUtils.getPeriodString(3);
	/**
	 * 폼 모델 초기화 
	 */
	$scope.searchParams = { 'etm_gte' : period[0], 'etm_lte' : period[1] };
	/**
	 * Fleet Trip List
	 */
	$scope.items = [];
	/**
	 * 현재 Trip Data
	 */
	$scope.trip = null;	
	/**
	 * smart table object
	 */
	$scope.tablestate = null;
	/**
	 * 처음 전체 페이지 로딩시는 event data 자동조회 하지 않는다.
	 */
	$scope.searchEnabled = false;
	 /**
	  * count per page 
	  * @type {Number}
	  */
	$scope.countPerPage = 5;
	/**
	 * Page Information - Total Record Count & Total Page
	 * 
	 * @type {Object}
	 */
	 $scope.pageInfo = { total : 0, total_page : 0, current_page : 0 };

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
 		$scope.pageInfo.total = total_count;
 		$scope.pageInfo.total_page = total_page;
 		$scope.pageInfo.current_page = current_page;

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
	 * Check Search
	 * 
	 * @return {Boolean}
	 */
	$scope.checkSearch = function(tablestate) {
		var isOk = $scope.searchEnabled ? true : false;

		if(!$scope.searchEnabled) {
			$scope.searchEnabled = true;
			$scope.tablestate = tablestate;
			$scope.tablestate.pagination.number = $scope.countPerPage;
		}

		if(tablestate) {
			$scope.tablestate = tablestate;
		}

		return isOk;
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
	 	$scope.numbering(dataSet.items);
		FmsUtils.setGridContainerHieght('monitor-info-trip-table-container');
	 };

	/**
	 * Items Numbering
	 * 
	 * @param  {Array}
	 * @param  {Number}
	 * @return N/A
	 */
	 $scope.numbering = function(items) {
	 	var startNo = (!$scope.pageInfo || !$scope.pageInfo.current_page) ? 1 : ($scope.pageInfo.current_page - 1) * $scope.countPerPage + 1;

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
		//$scope.setActiveItem(trip);
		$scope.$emit('monitor-info-trip-change', trip);
	};

	/**
	 * 초기화 함수 
	 * 
	 * @return N/A
	 */
	$scope.init = function() {
		/**
		 * init date picker1
		 */
		FmsUtils.initDatePicker('monitor_info_trip_datepicker1', $scope.searchParams, 'etm_gte', $scope.search);
		/**
		 * init date picker2
		 */
		FmsUtils.initDatePicker('monitor_info_trip_datepicker2', $scope.searchParams, 'etm_lte', $scope.search);
	};

	/**
	 * 초기화 
	 */
	$scope.init();	

});