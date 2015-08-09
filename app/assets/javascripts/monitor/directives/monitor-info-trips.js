angular.module('fmsMonitor').directive('monitorInfoTrips', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorTripsCtrl',
		templateUrl: '/assets/monitor/views/infobar/monitor-info-trips.html',
		scope: {}
	}; 
})
.controller('monitorTripsCtrl', function($rootScope, $scope, $resource, $element, FmsUtils, RestApi) {
	/**
	 * 기본 날짜 검색일 설정 
	 */
	var toDateStr = FmsUtils.formatDate(new Date(), 'yyyy-MM-dd');
	var fromDate = FmsUtils.addDate(new Date(), -3);
	var fromDateStr = FmsUtils.formatDate(fromDate, 'yyyy-MM-dd');
	/**
	 * 폼 모델 초기화 
	 */
	$scope.searchParams = { 'etm_gte' : fromDateStr, 'etm_lte' : toDateStr };
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
	$scope.countPerPage = 4;
	/**
	 * Page Information - Total Record Count & Total Page
	 * 
	 * @type {Object}
	 */
	 $scope.pageInfo = { total : 0, total_page : 0, current_page : 0 };

	/**
	 * Date Picker
	 */
	$(function() {
		var fromDt = $('#monitor_info_trip_datepicker1').datetimepicker({
			language : 'en',
			pickTime : false,
			autoclose : true
		}).on('changeDate', function(fev) {
			$scope.searchParams.etm_gte = FmsUtils.formatDate(fev.date, 'yyyy-MM-dd');
			$scope.search($scope.tablestate);
			fromDt.data('datetimepicker').hide();
		});
	});

	$(function() {
		var toDt = $('#monitor_info_trip_datepicker2').datetimepicker({
			language : 'en',
			pickTime : false,
			autoclose : true
		}).on('changeDate', function(tev) {
			//FmsUtils.addDate(tev.date, -1);
			$scope.searchParams.etm_lte = FmsUtils.formatDate(tev.date, 'yyyy-MM-dd');
			$scope.search($scope.tablestate);
			toDt.data('datetimepicker').hide();
		});
	});

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
	 	var startNo = (!$scope.pageInfo || !$scope.pageInfo.current_page) ? 1 : ($scope.pageInfo.current_page - 1)* $scope.countPerPage + 1;

	 	for(var i = 0 ; i < items.length ; i++) {
	 		items[i].no = startNo + i;
	 	}
	 };

	/**
	 * Trip 선택 조회시
	 */
	$scope.$on('monitor-trip-info-change', function(evt, tripData) {
		if(!tripData.from || tripData.from != 'infobar') {
			$scope.trip = tripData;
			$scope.tablestate.pagination.start = 0;
			$scope.tablestate.pagination.number = $scope.countPerPage;
			$scope.search($scope.tablestate);
		}
	});

	/**
	 * Trip 선택시 
	 */
	$scope.goTrip = function(trip) {
		$scope.$emit('monitor-info-trip-change', trip);
	}

});