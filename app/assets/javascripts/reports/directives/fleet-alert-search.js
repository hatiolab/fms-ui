angular.module('fmsReports').directive('fleetAlertSearch', function() {
	return { 
		restrict: 'E',
		controller: 'fleetAlertSearchCtrl',
		templateUrl: '/assets/reports/views/sidebars/fleet-alert.html',
		scope: {},
		link : function(scope, element, attr, fleetAlertSearchCtrl) {
			var refreshButton = element.find('#btnReportFleetAlert');
			refreshButton.bind("click", function() {
				scope.search(scope.tablestate);
			});
		}
	}; 
})
.controller('fleetAlertSearchCtrl', function($rootScope, $scope, $element, $compile, $timeout, GridUtils, FmsUtils, RestApi) {
	/**
	 * Chart Item
	 * @type {Object}
	 */
	$scope.chartItems = [ {
		chart_id : 'report-fleet-alert-1',
		type : 'Bar',		
		title : 'Impact', 
		sort_field : 'impact',
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Impact Count'],
		labels : [],
		data : []
	}, {
		chart_id : 'report-fleet-alert-2',
		type : 'Bar',
		sort_field : 'overspeed',
		title : 'Overspeed', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Overspeed Count'],
		labels : [],
		data : []
	}, {
		chart_id : 'report-fleet-alert-3',
		type : 'Bar',
		sort_field : 'geofence',
		title : 'Geofence', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Geofence Count'],
		labels : [],
		data : []
	}, {
		chart_id : 'report-fleet-alert-4',
		type : 'Bar',
		sort_field : 'emergency',
		title : 'Emergency', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Emergency Count'],
		labels : [],
		data : []
	} ];
	/**
	 * Selected Chart
	 * @type {Object}
	 */
	$scope.chartId = $scope.chartItems[0].chart_id;

	/**
	 * 테이블 바인딩 데이터 
	 * @type {Array}
	 */
	$scope.items = [];
	/**
	 * 검색 조건 모델 
	 * @type {Object}
	 */
	$scope.searchParams = { 'from_date' : '', 'to_date' : '' };
	/**
	 * Sort Field Name
	 * @type {String}
	 */
	$scope.sort_field = 'impact';
	/**
	 * Sort value
	 * @type {String}
	 */
	$scope.sort_value = 'desc';
	/**
	 * TOP_RANK
	 * @type {Number}
	 */
	$scope.TOP_RANK = 30;

	/**
	 * 검색 조건 
	 *
	 * @param  {Object}
	 */
	$scope.normalizeSearchParams = function() {
		var params = { 
			from_date : $scope.searchParams.from_date,
			to_date : $scope.searchParams.to_date,
			sort_field : $scope.sort_field,  
			sort_value : $scope.sort_value, 
			limit : $scope.TOP_RANK
		};

	 	if($scope.searchParams.group) {
	 		params.group_id = params.group.id;
	 	}

	 	return params;
	};

	/**
	 * 차트 데이터 조회  
	 *
	 * @param  {Object}
	 */
	$scope.search = function() {
		var searchParams = $scope.beforeSearch();
		$scope.doSearch(searchParams, function(dataSet) {
			$scope.afterSearch(dataSet);
		});
	}

	/**
	 * infinite scorll directive에서 호출 
	 * 
	 * @return {Object}
	 */
	$scope.beforeSearch = function() {
		return $scope.normalizeSearchParams();
	};

	/**
	 * 데이터 조회  
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
	 * 데이터 조회 후 ... 
	 * 
	 * @param  {Object}
	 * @return N/A
	 */
	$scope.afterSearch = function(dataSet) {
		$scope.numbering(dataSet.items);
		$scope.items = dataSet.items;
		$scope.showChart();
		FmsUtils.setGridContainerHieght('report-fleet-alert-table-container');
	};

	/**
	 * Items Numbering
	 * 
	 * @param  {Array}
	 * @return N/A
	 */
	$scope.numbering = function(items) {
		for(var i = 0 ; i < items.length ; i++) {
			items[i].no = i + 1;
		}
	};

	/**
	 * Show Chart
	 */
	$scope.showChart = function() {
		var chartItem = $scope.chartItems.filter(function(chartItem) {
			return $scope.chartId == chartItem.chart_id;
		});

		if(chartItem && chartItem.length > 0) {
			chartItem = chartItem[0];

			var labels = []; data = []; dataSize = $scope.items.length;
			for(var i = 0 ; i < $scope.items.length ; i++) {
				var currentItem = $scope.items[i];
				labels.push(currentItem.fleet_name);
				data.push(Number(currentItem[chartItem.sort_field]));
			};

			chartItem.labels = labels;
			chartItem.data[0] = data;		
			$scope.$emit('report-fleet-alert-item-change', chartItem);
		}		
	};

	/**
	 * Sort 이벤트 발생시 
	 * @param {String} 서버 측에 보낼 소트 필드 
	 */
	$scope.setsort = function(sort_field) {
		$scope.sort_field = sort_field;
		var sortClass = $element.find('#' + sort_field)[0].className;
		if(sortClass == "st-sort-ascent") {
			$scope.sort_value = "asc";
		} else if(sortClass == "st-sort-descent") {
			$scope.sort_value = "desc";
		} else {
			$scope.sort_value = "desc";
		}
	};
	
	/**
	 * SearchParams에 대한 Watch
	 */
	$scope.$watchCollection('searchParams', function() {
		$scope.search();
	});

	/**
	 * 검색 기간 설정 
	 * @param {String} Week, Month, Year
	 */
	$scope.setSearchPeriod = function(periodType) {
		var period = FmsUtils.getPeriodString(periodType);
		$scope.searchParams = { 'from_date' : period[0], 'to_date' : period[1] };
	};

	/**
	 * 검색 기간 설정 
	 */
	$scope.setSearchPeriod('week');

	// /**
	//  * 기본 날짜 검색일 설정 
	//  */
	// var period = FmsUtils.getPeriodString(3);
	// /**
	//  * 검색 조건 모델 
	//  *
	//  * @type {Object}
	//  */
	// $scope.searchParams = { 'from_date' : period[0], 'to_date' : period[1] };
	// /**
	//  * Group List
	//  *
	//  * @type {Array}
	//  */
	// $scope.items = [];
	// /**
	//  * Smart Table
	//  *
	//  * @type {Object}
	//  */
	// $scope.tablestate = null;
	// /**
	//  * 최초에 자동조회 하지 않는다.
	//  * 
	//  * @type {Boolean}
	//  */
	// $scope.searchEnabled = false;
	// /**
	//  * Chart Title
	//  * 
	//  * @type {String}
	//  */
	// $scope.chartTitle = 'Impact';

	// /**
	//  * Sort Field Name & Sort value
	//  * 
	//  * @type {String}
	//  */
	// $scope.sort_field = 'impact'
	// $scope.sort_value = 'desc'

	// /**
	//  * Show Chart
	//  * 
	//  * @return N/A
	//  */
	// $scope.showChart = function(chartType) {
	// 	// 기존 차트 삭제 
	// 	var parent = $('div.report-content').parent();
	// 	$('div.report-content').remove();
	// 	var html = "<div class='report-content'>" + $scope.newChartHtml(chartType) + "</div>";
	// 	var el = $compile(html)($scope);
	//  	parent.append(el);

	//  	// send data to chart scope
	//  	$timeout.cancel();
	// 	$timeout($scope.sendChartData, 100);
	// };

	// /**
	//  * 새로운 차트를 생성한다.
	//  * 
	//  * @return {String}
	//  */
	// $scope.newChartHtml = function(chartType) {
	// 	return "<" + chartType + " class='col-xs-12 col-sm-12' title='" + $scope.chartTitle + "'></" + chartType + ">";
	// };

	// /**
	//  * Send Chart Data
	//  * 
	//  * @return N/A
	//  */
	// $scope.sendChartData = function() {
	// 	// Line Chart로 
	//  	var lineChartData = { title : $scope.chartTitle, labels : [], data : [] };
	// 	if($scope.chartTitle == 'Impact') {
	// 		$scope.setChartData(lineChartData, 'impact', ['Impact Count']);
	// 	} else if($scope.chartTitle == 'Overspeed') {
	// 		$scope.setChartData(lineChartData, 'overspeed', ['Overspeed Count']);
	// 	} else if($scope.chartTitle == 'Geofence') {
	// 		$scope.setChartData(lineChartData, 'geofence', ['Geofence Count']);
	// 	} else if($scope.chartTitle == 'Emergency') {
	// 		$scope.setChartData(lineChartData, 'emergency', ['Emergency Count']);
	// 	} else {
	// 		return;
	// 	}

	// 	$scope.$emit('bar-chart-data-change', lineChartData);
	// };

	//  /**
	//   * Set Chart Data
	//   * 
	//   * @param {Object}
	//   * @param {String}
	//   */
	//  $scope.setChartData = function(chartData, field, series) {
	//  	for(var i = 0 ; i < $scope.items.length ; i++) {
	//  		var item = $scope.items[i];
	//  		chartData.labels.push(item.fleet_name);
	//  		chartData.data.push(Number(item[field]));
	//  		chartData.series = series;
	//  	};
	//  };

	//  /**
	//   * [sort condition setup]
	//   * @param  {[string]} the field you should sort from database
	//   * $scope.sort_field {[string]} the field you should sort from database
	//   * $scope.sort_value {[string]} asc/desc default asc
	//   */
	// $scope.setsort = function(sort_field){
	// 	var sortClass = $element.find('#' + sort_field)[0].className;
	// 	$scope.sort_value = {};
	// 	$scope.sort_field = sort_field;

	// 	if(sortClass == "st-sort-ascent") {
	// 		$scope.sort_value = "asc";
	// 	} else if(sortClass == "st-sort-descent") {
	// 		$scope.sort_value = "desc";
	// 	} else {
	// 		$scope.sort_value = "desc";
	// 	}
	// };
	
	// /**
	//  * Rails Server의 스펙에 맞도록 파라미터 변경 ...
	//  *
	//  * @param  {Object}
	//  */
	// $scope.normalizeSearchParams = function(params) {
	// 	var searchParams = { sort_field : $scope.sort_field, sort_value : $scope.sort_value };

	// 	if(!params || FmsUtils.isEmpty(params)) {
	// 		params = $scope.searchParams;
	// 	} 

	// 	searchParams["from_date"] = params.from_date;
	// 	searchParams["to_date"] = params.to_date;
	//  	if(params.group) {
	//  		searchParams["group_id"] = params.group.id;
	//  	}

	// 	return searchParams;
	// };

	// /**
	//  * Search
	//  * 
	//  * @param  {Object}
	//  * @return N/A
	//  */
	// $scope.search = function(tablestate) {
	// 	if(!$scope.checkSearch(tablestate)) {
	// 		return;
	// 	}

	// 	var searchParams = $scope.beforeSearch();

	// 	$scope.doSearch(searchParams, function(dataSet) {
	// 		$scope.numbering(dataSet.items, 1);
	// 		$scope.items = dataSet.items;
	// 		$scope.afterSearch(dataSet);
	// 	});
	// };

	// /**
	//  * Items Numbering
	//  * 
	//  * @param  {Array}
	//  * @param  {Number}
	//  * @return N/A
	//  */
	//  $scope.numbering = function(items, startNo) {
	//  	for(var i = 0 ; i < items.length ; i++) {
	//  		items[i].no = i + 1;
	//  	}
	//  };

	//  /**
	//   * 페이지네이션 검색 정보를 설정한다. 
	//   *
	//   * @param {Object}
	//   * @param {Object}
	//   * @param {Number}
	//   * @param {Number}
	//   */
	//  $scope.setPageQueryInfo = function(searchParams, pagination, start, limit) {
	//  	searchParams.start = start;
	//  	searchParams.limit = limit;
	//  	pagination.start = start;
	//  	pagination.number = limit;
	//  };

	//  /**
	//   * 페이지네이션 결과 정보를 설정한다. 
	//   * 
	//   * @param {Number}
	//   * @param {Number}
	//   * @param {Number}
	//   */
	// $scope.setPageReultInfo = function(total_count, total_page, current_page) {
	// 	if($scope.tablestate && $scope.tablestate.pagination) {
	// 		$scope.tablestate.pagination.totalItemCount = total_count;
	// 		$scope.tablestate.pagination.numberOfPages = total_page;
	// 		$scope.tablestate.pagination.currentPage = current_page;
	// 	}
	// };

	// /**
	//  * Check Search
	//  * 
	//  * @return {Boolean}
	//  */
	// $scope.checkSearch = function(tablestate) {
	// 	if(!$scope.searchEnabled) {
	// 		$scope.searchEnabled = true;
	// 		$scope.tablestate = tablestate;
	// 		$scope.tablestate.pagination.number = GridUtils.getGridCountPerPage();
	// 	}

	// 	if(tablestate) {
	// 		$scope.tablestate = tablestate;
	// 	}

	// 	return true;
	// };	

	//  /**
	//   * infinite scorll directive에서 호출 
	//   * 
	//   * @return {Object}
	//   */
	// $scope.beforeSearch = function() {
	//  	var searchParams = $scope.normalizeSearchParams($scope.searchParams);
	//  	$scope.setPageQueryInfo(searchParams, $scope.tablestate.pagination, 0, GridUtils.getGridCountPerPage());
	//  	return searchParams;
	// };

	//  /**
	//   * infinite scorll directive에서 호출 
	//   * 
	//   * @param  {Object}
	//   * @param  {Function}
	//   * @return N/A
	//   */
	// $scope.doSearch = function(params, callback) {
	//  	RestApi.search('/fleet_summaries/event_summary.json', params, function(dataSet) {
	//  		callback(dataSet);
	//  	});
	// };

	//  /**
	//   * infinite scorll directive에서 호출 
	//   * 
	//   * @param  {Object}
	//   * @return N/A
	//   */
	// $scope.afterSearch = function(dataSet) {
	//  	$scope.setPageReultInfo(dataSet.total, dataSet.total_page, dataSet.page);
	// 	FmsUtils.setGridContainerHieght('report-fleet-alert-table-container');
	// 	$scope.sendChartData();
	// };

	// /**
	//  * [watch drivers SearchParams in page scope, if changed trigger pageFleets in same scope]
	//  * @param  $scope.searchParams
	//  * @return null
	//  */
	// $scope.$watchCollection('searchParams', function() {
	// 	if($scope.searchEnabled) {
	// 		$scope.search($scope.tablestate);
	// 	}
	// });

});