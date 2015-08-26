angular.module('fmsHr').directive('hrDrivehabitSearch', function() {
	return { 
		restrict: 'E',
		controller: 'hrDrivehabitSearchCtrl',
		templateUrl: '/assets/hr/views/sidebars/drivehabit.html',
		scope: {},
		link : function(scope, element, attr, fleetSearchCtrl) {
			var refreshButton = element.find('#hrSearchDrivehabit');
			refreshButton.bind("click", function() {
				scope.search(scope.tablestate);
			});
		}
	}; 
})
.controller('hrDrivehabitSearchCtrl', function($rootScope, $scope, $element, $compile, $timeout, GridUtils, FmsUtils, RestApi) {

	/**
	 * 기본 날짜 검색일 설정 
	 */
	var period = FmsUtils.getPeriodString(7);

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
	 * 선택된 아이템
	 */
	$scope.item = null;
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
	 * Chart Title
	 * 
	 * @type {String}
	 */
	$scope.chartTitle = 'Driving Habit Total Summary';
	/**
	 * 검색 Sort 필드 
	 * 
	 * @type {String}
	 */
	$scope.sort_field = 'driver_code';
	/**
	 * 검색 Sort 조건 
	 * 
	 * @type {String}
	 */
	$scope.sort_value = 'desc';
	 /**
	  * [sort condition setup]
	  * @param  {[string]} the field you should sort from database
	  * $scope.sort_field {[string]} the field you should sort from database
	  * $scope.sort_value {[string]} asc/desc default asc
	  */
	$scope.setsort = function(sort_field){
		var sortClass = $element.find('#' + sort_field)[0].className;
		$scope.sort_value = {};
		$scope.sort_field = sort_field;

		if(sortClass == "st-sort-ascent") {
			$scope.sort_value = "asc";
		} else if(sortClass == "st-sort-descent") {
			$scope.sort_value = "desc";
		} else {
			$scope.sort_value = "desc";
		}
	};


	/**
	 * Show Total Summary Chart
	 */
	$scope.showTotalChart = function() {
		// 선택 아이템 변경 
		$scope.item = null;
		$scope.chartTitle = "Over Speed Total Summary";

		var params = { from_date : $scope.searchParams['from_date'], to_date : $scope.searchParams['to_date'],limit : 10};

		RestApi.list('/fleet_summaries/driver_summary.json', params, function(list) {
			// 기존 차트 삭제 
			var parent = $('div.report-content').parent();
			$('div.report-content').remove();
			var html = "<div class='report-content'><fms-bar-chart class='col-xs-12 col-sm-6' title='Driving Habit Speed Slow Summary'></fms-bar-chart><fms-bar-chart class='col-xs-12 col-sm-6' title='Driving Habit Speed High Summary'></fms-bar-chart></div>";
			var el = $compile(html)($scope);
		 	parent.append(el);

		 	// send data to chart scope
		 	$timeout.cancel();
	   		$timeout($scope.sendTotalChartData, 250, true, list);
	 	});
	};

	/**
	 * Send Chart Data
	 * 
	 * @return N/A
	 */
	$scope.sendTotalChartData = function(list) {
		$scope.chartTitle = 'Driving Habit Speed Slow Summary';
	 	var barChartData = { title : $scope.chartTitle, labels : [], data : [] };
		$scope.setChartData(list, barChartData, ['speed_slow'], ['Slow Speed Count']);
		$scope.$emit('bar-chart-data-list-change', barChartData);

		$scope.chartTitle = 'Driving Habit Speed High Summary';
	 	var barChartData = { title : $scope.chartTitle, labels : [], data : [] };
		$scope.setChartData(list, barChartData, ['speed_high'], ['High Speed Count']);
		$scope.$emit('bar-chart-data-list-change', barChartData);
	};

	 /**
	  * Set Chart Data
	  *
	  * @param {Array}
	  * @param {Object}
	  * @param {Array}
	  * @param {Array}
	  */
	$scope.setChartData = function(dataList, chartData, fieldList, series) {
	 	for(var i = 0 ; i < dataList.length ; i++) {
	 		var item = dataList[i];
	 		chartData.labels.push(item.driver_name);
	 		chartData.series = series;
	 	}
	 	for(var i = 0 ; i < fieldList.length ; i++) {
	 		var field = fieldList[i];
	 		chartData.data.push([]);

			for(var j = 0 ; j < dataList.length ; j++) {
				var item = dataList[j];
				chartData.data[i].push(Number(item[field]));
	 		}
	 	}
	};

	/**
	 * active item
	 * 
	 * @param {Object}
	 */
	$scope.setActiveItem = function(activeItem) {
		// 선택 아이템 변경 
		$scope.item = activeItem;		
		for (var i = 0; i < $scope.items.length; i++) {
			var item = $scope.items[i];
			item.active = (item.driver_id == $scope.item.driver_id);
		}
	};

	/**
	 * Show Item Chart
	 * 
	 * @return N/A
	 */
	$scope.showItemChart = function(item) {
		// 선택 아이템 변경 
		$scope.setActiveItem(item);
		$scope.chartTitle = "Driving Habit - (" + item.driver_code + " / " + item.driver_name + ")";

		// 기존 차트 삭제 
		var parent = $('div.report-content').parent();
		$('div.report-content').remove();
		var html = "<div class='report-content'><fms-radar-chart class='col-xs-12 col-sm-12' title='" + $scope.chartTitle + "'></fms-radar-chart></div>";
		var el = $compile(html)($scope);
	 	parent.append(el);

	 	// send data to chart scope
	 	$timeout.cancel();
   	$timeout($scope.sendItemChartData, 250);
	};

	/**
	 * Send Driver Chart Data
	 */
	$scope.sendItemChartData = function() {
		var item = $scope.item;
	 	var radarChartData = { 
	 		title : $scope.chartTitle, 
	 		series : [item.driver_code + '(' + item.driver_name + ')'], 
	 		labels : ['Slow Speed Count', 'Normal Speed Count', 'High Speed Count', 'Over Speed Count'], 
	 		data : [item.speed_slow, item.speed_normal, item.speed_high, item.speed_over]
	 	};
		$scope.$emit('radar-chart-data-change', radarChartData);
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
	 		var item = items[i];
	 		item.no = i + 1;
	 		item.velocity = Math.round(item.velocity);
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
	 	RestApi.search('/fleet_summaries/driver_summary.json', params, function(dataSet) {
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
		FmsUtils.setGridContainerHieght('hr-drivehabit-table-container');
		$scope.showTotalChart();
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

	};

	/**
	 * 초기화 
	 */
	$scope.init();

});