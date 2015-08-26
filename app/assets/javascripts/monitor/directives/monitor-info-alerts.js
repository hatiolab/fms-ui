angular.module('fmsMonitor').directive('monitorInfoAlerts', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorAlertsCtrl',
		templateUrl: '/assets/monitor/views/infobar/monitor-info-alerts.html',
		scope: {}
	}; 
})
.controller('monitorAlertsCtrl', function($rootScope, $scope, $resource, $element, GridUtils, FmsUtils, RestApi) {
	/**
	 * 기본 날짜 검색일 설정 
	 */
	var toDateStr = FmsUtils.formatDate(new Date(), 'yyyy-MM-dd');
	var fromDate = FmsUtils.addDate(new Date(), -3);
	var fromDateStr = FmsUtils.formatDate(fromDate, 'yyyy-MM-dd');

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
	$scope.searchParams = { 'ctm_gte' : fromDateStr, 'ctm_lte' : toDateStr };
	/**
	 * Page Information - Total Record Count & Total Page
	 * 
	 * @type {Object}
	 */
	 $scope.pageInfo = { total : 0, total_page : 0, current_page : 0 };
	 /**
	  * count per page 
	  * @type {Number}
	  */
	 $scope.countPerPage = 4;
	/**
	 * Alert list items
	 * 
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
	 	if(!$scope.searchEnabled) {
	 		$scope.searchEnabled = true;
	 		$scope.tablestate = tablestate;
	 		$scope.tablestate.pagination.number = $scope.countPerPage;
	 		return;
	 	}

	 	if(tablestate) {
	 		$scope.tablestate = tablestate;
	 	}

 		var searchParams = $scope.beforeSearch();

    $scope.doSearch(searchParams, function(dataSet) {
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
	 $scope.numbering = function(items) {
	 	var startNo = (!$scope.pageInfo || !$scope.pageInfo.current_page) ? 1 : ($scope.pageInfo.current_page - 1)* $scope.countPerPage + 1;

	 	for(var i = 0 ; i < items.length ; i++) {
	 		items[i].no = startNo + i;
	 	}
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
	 	$scope.numbering(dataSet.items);
		FmsUtils.setEventTypeClasses($scope.items);
		FmsUtils.setEventTypeNames($scope.items);
		FmsUtils.setGridContainerHieght('monitor-info-alert-table-container');
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
	 * Trip 선택시 
	 */
	$scope.goTrip = function(alert) {
		$scope.$emit('monitor-event-trip-change', alert);
	};

	/**
	 * Alert 선택시 
	 */
	$scope.showAlertWindow = function(alert) {
		alert.from = 'infobar';
		$rootScope.$broadcast('monitor-event-info-change', alert);
	};

});