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
	var fromDate = FmsUtils.addDate(new Date(), -2);
	var fromDateStr = FmsUtils.formatDate(fromDate, 'yyyy-MM-dd');
	/**
	 * 폼 모델 초기화 
	 */
	$scope.tripSearchParams = { 'ctm_gte' : fromDateStr, 'ctm_lte' : toDateStr };
	/**
	 * Fleet Trip Data Set
	 */
	$scope.fleetTripDataSet = {};
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
	$scope.eventInit = false;	

	/**
	 * Date Picker
	 */
	$(function() {
		var fromDt = $('#info_trip_datepicker1').datetimepicker({
			language : 'en',
			pickTime : false,
			autoclose : true
		}).on('changeDate', function(fev) {
			$scope.tripSearchParams.ctm_gte = FmsUtils.formatDate(fev.date, 'yyyy-MM-dd');
			fromDt.data('datetimepicker').hide();
		});
	});

	$(function() {
		var toDt = $('#info_trip_datepicker2').datetimepicker({
			language : 'en',
			pickTime : false,
			autoclose : true
		}).on('changeDate', function(tev) {
			FmsUtils.addDate(tev.date, -1);
			$scope.tripSearchParams.ctm_lte = FmsUtils.formatDate(tev.date, 'yyyy-MM-dd');
			toDt.data('datetimepicker').hide();
		});
	});

	/**
	 * call by pagination
	 */
	$scope.pageTrips = function(tablestate) {
		if(!$scope.eventInit) {
			$scope.eventInit = true;
			$scope.tablestate = tablestate;
			$scope.tablestate.pagination.number = 3;
			return;
		}
		
		if(tablestate) {
			$scope.tablestate = tablestate;
		}

		var searchParams = {
			"_q[fid-eq]" : $scope.trip.fid,
			"_q[ctm-gte]" : new Date($scope.tripSearchParams['ctm_gte']).getTime(),
			"_q[ctm-lte]" : new Date($scope.tripSearchParams['ctm_lte']).getTime(),
			"_o[ctm]" : "desc",
			"start" : $scope.tablestate.pagination.start,
			"limit" : $scope.tablestate.pagination.number
		};

		RestApi.search('/trips.json', searchParams, function(dataSet) {
			$scope.fleetTripDataSet = dataSet;
			$scope.fleetTripItems = dataSet.items;
			$scope.tablestate.pagination.totalItemCount = dataSet.total;
			$scope.tablestate.pagination.numberOfPages = dataSet.total_page;
		});
	};	

	/**
	 * Trip 선택 조회시
	 */
	$scope.$on('monitor-trip-info-change', function(evt, tripData) {
		$scope.trip = tripData;
		$scope.pageTrips();
	});

});