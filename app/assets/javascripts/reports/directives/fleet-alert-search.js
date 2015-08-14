angular.module('fmsReports').directive('fleetAlertSearch', function() {
	return { 
		restrict: 'E',
		controller: 'fleetAlertSearchCtrl',
		templateUrl: '/assets/reports/views/sidebars/fleet-alert.html',
		scope: {},
		link : function(scope, element, attr, fleetSearchCtrl) {
			var refreshButton = element.find('#reportSearchFleetAlert');
			refreshButton.bind("click", function() {
				scope.search(scope.tablestate);
			});
		}
	}; 
})
.controller('fleetAlertSearchCtrl', function($rootScope, $scope, $element, $compile, $timeout, GridUtils, FmsUtils, RestApi) {

	/**
	 * 기본 날짜 검색일 설정 
	 */
	var period = FmsUtils.getPeriodString(3);
	/**
	 * 검색 조건 모델 
	 *
	 * @type {Object}
	 */
	$scope.searchParams = { 'from_date' : period[0], 'to_date' : period[1] };
	/**
	 * 사이드 바 토글 변수
	 *
	 * @type {Boolean}
	 */
	$scope.isSidebarToggle = true;
	/**
	 * Group List
	 *
	 * @type {Array}
	 */
	$scope.items = [];
	/**
	 * Smart Table
	 *
	 * @type {Object}
	 */
	$scope.tablestate = null;
	/**
	 * 최초에 자동조회 하지 않는다.
	 * 
	 * @type {Boolean}
	 */
	$scope.searchEnabled = false;
	/**
	 * Fleet Group 모델 
	 * 
	 * @type {Array}
	 */
	$scope.groups = [];
	/**
	 * Chart Title
	 * 
	 * @type {String}
	 */
	$scope.chartTitle = 'Impact';

	/**
	 * Show Chart
	 * 
	 * @return N/A
	 */
	$scope.showChart = function(chartType) {
		// 기존 차트 삭제 
		var parent = $('div.report-content').parent();
		$('div.report-content').remove();
		var html = "<div class='report-content'>" + $scope.newChartHtml(chartType) + "</div>";
		var el = $compile(html)($scope);
	 	parent.append(el);

	 	// send data to chart scope
	 	$timeout.cancel();
   	$timeout($scope.sendChartData, 100);
	};

	/**
	 * 새로운 차트를 생성한다.
	 * 
	 * @return {String}
	 */
	$scope.newChartHtml = function(chartType) {
		return "<" + chartType + " class='col-xs-12 col-sm-12' title='" + $scope.chartTitle + "'></" + chartType + ">";
	};

	/**
	 * Send Chart Data
	 * 
	 * @return N/A
	 */
	$scope.sendChartData = function() {
		// Line Chart로 
	 	var lineChartData = { title : $scope.chartTitle, labels : [], data : [] };

		if($scope.chartTitle == 'Impact') {
			$scope.setChartData(lineChartData, 'impact', ['Impact Count']);
		} else if($scope.chartTitle == 'Overspeed') {
			$scope.setChartData(lineChartData, 'overspeed', ['Overspeed Count']);
		} else if($scope.chartTitle == 'Geofence') {
			$scope.setChartData(lineChartData, 'geofence', ['Geofence Count']);
		} else if($scope.chartTitle == 'Emergency') {
			$scope.setChartData(lineChartData, 'emergency', ['Emergency Count']);
		} else {
			return;
		}

		$scope.$emit('bar-chart-data-change', lineChartData);
	};

	 /**
	  * Set Chart Data
	  * 
	  * @param {Object}
	  * @param {String}
	  */
	 $scope.setChartData = function(chartData, field, series) {
	 	for(var i = 0 ; i < $scope.items.length ; i++) {
	 		var item = $scope.items[i];
	 		chartData.labels.push(item.fleet_name);
	 		chartData.data.push(Number(item[field]));
	 		chartData.series = series;
	 	};
	 };

	/**
	 * Search Fleet Groups
	 */
	$scope.findGroups = function(params) {
		RestApi.list('/fleet_groups.json', params, function(dataSet) {
			$scope.groups = dataSet;
		});
	};

	/**
	 * Rails Server의 스펙에 맞도록 파라미터 변경 ...
	 *
	 * @param  {Object}
	 */
	$scope.normalizeSearchParams = function(params) {
		var searchParams = {};

		if(!params || FmsUtils.isEmpty(params)) {
			return searchParams;
		} 

		searchParams["from_date"] = params.from_date;
		searchParams["to_date"] = params.to_date;

	 	if(params.group) {
	 		searchParams["group_id"] = params.group.id;
	 	}

		return searchParams;
	};

	/**
	 * Search
	 * 
	 * @param  {Object}
	 * @return N/A
	 */
	$scope.search = function(tablestate) {
		if(!$scope.checkSearch(tablestate)) {
			return;
		}

		var searchParams = $scope.beforeSearch();

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
		if($scope.tablestate && $scope.tablestate.pagination) {
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
	 	RestApi.search('/fleet_summaries/event_summary.json', params, function(dataSet) {
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
		FmsUtils.setGridContainerHieght('report-fleet-alert-table-container');
		$scope.sendChartData();
	 };

	/**
	 * [watch drivers SearchParams in page scope, if changed trigger pageFleets in same scope]
	 * @param  $scope.searchParams
	 * @return null
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
		 * init date picker1
		 */
		FmsUtils.initDatePicker('report-fleet-alert-datepicker1', $scope.searchParams, 'from_date', $scope.search);
		/**
		 * init date picker2
		 */
		FmsUtils.initDatePicker('report-fleet-alert-datepicker2', $scope.searchParams, 'to_date', $scope.search);
		/**
		 * 차량 그룹 데이터
		 */
		$scope.findGroups();
	};

	/**
	 * 초기화 
	 */
	$scope.init();

});