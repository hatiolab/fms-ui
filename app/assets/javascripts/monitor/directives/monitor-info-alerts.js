angular.module('fmsMonitor').directive('monitorInfoAlerts', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorAlertsCtrl',
		templateUrl: '/assets/monitor/views/infobar/monitor-info-alerts.html',
		scope: {}
	}; 
})
.controller('monitorAlertsCtrl', function($rootScope, $scope, $resource, $element, FmsUtils, RestApi) {
	/**
	 * 기본 날짜 검색일 설정 
	 */
	var toDateStr = FmsUtils.formatDate(new Date(), 'yyyy-MM-dd');
	var fromDate = FmsUtils.addDate(new Date(), -2);
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
	$scope.eventInit = false;
	/**
	 * 폼 모델 초기화 
	 */
	$scope.alertSearchParams = { 'ctm_gte' : fromDateStr, 'ctm_lte' : toDateStr };
	/**
	 * Trip Alert Data Set
	 */
	$scope.tripAlertDataSet = {};

	/**
	 * Date Picker
	 */
	$(function() {
		var fromDt = $('#info_datepicker1').datetimepicker({
			language : 'en',
			pickTime : false,
			autoclose : true
		}).on('changeDate', function(fev) {
			$scope.alertSearchParams.ctm_gte = FmsUtils.formatDate(fev.date, 'yyyy-MM-dd');
			fromDt.data('datetimepicker').hide();
		});
	});

	$(function() {
		var toDt = $('#info_datepicker2').datetimepicker({
			language : 'en',
			pickTime : false,
			autoclose : true
		}).on('changeDate', function(tev) {
			FmsUtils.addDate(tev.date, -1);
			$scope.alertSearchParams.ctm_lte = FmsUtils.formatDate(tev.date, 'yyyy-MM-dd');
			toDt.data('datetimepicker').hide();
		});
	});

	/**
	 * call by pagination
	 */
	$scope.pageAlerts = function(tablestate) {
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
			"_q[tid-eq]" : $scope.tripId,
			"_q[ctm-gte]" : new Date($scope.alertSearchParams['ctm_gte']).getTime(),
			"_q[ctm-lte]" : new Date($scope.alertSearchParams['ctm_lte']).getTime(),
			"_o[etm]" : "desc",
			"start" : $scope.tablestate.pagination.start,
			"limit" : $scope.tablestate.pagination.number
		};

		RestApi.search('/events.json', searchParams, function(dataSet) {
			$scope.tripAlertDataSet = dataSet;
			$scope.tripAlertItems = dataSet.items;
			FmsUtils.setEventTypeClasses($scope.tripAlertItems);
			FmsUtils.setEventTypeNames($scope.tripAlertItems);
			$scope.tablestate.pagination.totalItemCount = dataSet.total;
			$scope.tablestate.pagination.numberOfPages = dataSet.total_page;
		});
	};

	/**
	 * Trip 선택 조회시
	 */
	$scope.$on('monitor-trip-info-change', function(evt, tripData) {
		$scope.tripId = tripData.id;
		$scope.tablestate.pagination.start = 0;
		$scope.tablestate.pagination.number = 3;
		$scope.pageAlerts();
	});

});
