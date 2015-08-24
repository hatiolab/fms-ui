angular.module('fmsHr').directive('hrDrivetimeSearch', function() {
	return { 
		restrict: 'E',
		controller: 'hrDrivetimeSearchCtrl',
		templateUrl: '/assets/hr/views/sidebars/drivetime.html',
		scope: {},
		link : function(scope, element, attr, fleetSearchCtrl) {
			var refreshButton = element.find('#hrDrivetime');
			refreshButton.bind("click", function() {
				scope.search(scope.tablestate);
			});
		}
	}; 
})
.controller('hrDrivetimeSearchCtrl', function($rootScope, $scope, $element, $compile, $timeout, GridUtils, FmsUtils, RestApi) {

  /**
   * 기본 날짜 검색일 설정 
   */
  var period = FmsUtils.getPeriodString(7);
  /**
   * 검색 조건 
   * 
   * @type {Object}
   */
	$scope.searchParams = { from_date : period[0], to_date : period[1] };
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
	 * 검색 Sort 필드 
	 * 
	 * @type {String}
	 */
	$scope.sort_field = 'drive_time';
	/**
	 * 검색 Sort 조건 
	 * 
	 * @type {String}
	 */
	$scope.sort_value = 'desc';
	/**
	 * Top 10만 조회 
	 * 
	 * @type {Number}
	 */
	$scope.limit = 10;
	/**
	 * Chart Title
	 * 
	 * @type {String}
	 */
	$scope.chartTitle = 'Working Time By Driver';

	/**
	 * Show Total Summary Chart
	 */
	$scope.showTotalChart = function(list) {
		// 선택 아이템 변경 
		$scope.item = null;
		$scope.chartTitle = "Working Time By Driver";

		// 기존 차트 삭제 
		var parent = $('div.report-content').parent();
		$('div.report-content').remove();
		var html = "<div class='report-content'><fms-bar-chart class='col-xs-12 col-sm-12' title='Working Time By Driver'></fms-bar-chart></div>";
		var el = $compile(html)($scope);
	 	parent.append(el);


	 	// send data to chart scope
	 	$timeout.cancel();
	   	$timeout($scope.sendTotalChartData, 250, true, list);
	};

	/**
	 * Send Chart Data
	 * 
	 * @return N/A
	 */
	$scope.sendTotalChartData = function(list) {
		$scope.chartTitle = 'Working Time By Driver';
	 	var barChartData = { title : $scope.chartTitle, labels : [], data : [] };
		$scope.setChartData(list, barChartData, ['drive_time'], ['Drive Time']);
		$scope.$emit('bar-chart-data-list-change', barChartData);
	};

	$scope.showItemChart = function(item) {
		$scope.setActiveItem(item);
		$scope.chartTitle = "Working Time Trend - " + item.driver_code + " (" + item.driver_name + ")";
		var params = { driver_id : item.driver_id, 
					   from_date : $scope.searchParams['from_date'], 
					   to_date : $scope.searchParams['to_date'],
					   sort_field : "date",
					   sort_value : "asc"}

		RestApi.list('/fleet_summaries/driver_summary.json', params, function(list) {
			// 기존 차트 삭제 
			var parent = $('div.report-content').parent();
			$('div.report-content').remove();
			var html = "<div class='report-content'><fms-bar-chart class='col-xs-12 col-sm-12' title='" + $scope.chartTitle + "'></fms-bar-chart></div>";
			var el = $compile(html)($scope);
		 	parent.append(el);
		 	// send data to chart scope
		 	$timeout.cancel();
	   	$timeout($scope.sendItemChartData, 250, true, list);
	 	});
	};

	/**
	 * Send Driver Chart Data
	 */
	$scope.sendItemChartData = function(list) {
	 	var barChartData = { title : $scope.chartTitle, labels : [], series : ['Drive time'], data : [] };
	 	for(var i = 0 ; i < list.length ; i++) {
	 		var item = list[i];
	 		barChartData.labels.push(item.date);
	 		barChartData.data.push(Number(item.drive_time));
	 	};
		$scope.$emit('bar-chart-data-change', barChartData);
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
	 	for(var i = 0 ; i <  $scope.items.length ; i++) {
	 		var item =  $scope.items[i];
	 		chartData.labels.push(item.driver_code+'/'+item.driver_name);
	 		chartData.series = series;
	 	}
	 	for(var i = 0 ; i < fieldList.length ; i++) {
	 		var field = fieldList[i];
	 		chartData.data.push([]);

			for(var j = 0 ; j <  $scope.items.length ; j++) {
				var item = $scope.items[j];
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
		searchParams["sort_field"]= $scope.sort_field;
		searchParams["sort_value"]= $scope.sort_value;
		searchParams.limit = $scope.limit;
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
		if($scope.checkSearch(tablestate)) {
			var searchParams = $scope.beforeSearch();
			$scope.doSearch(searchParams, function(dataSet) {
				$scope.numbering(dataSet.items, 1);
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
		FmsUtils.setGridContainerHieght('hr-drivetime-table-container');
		$scope.showTotalChart(dataSet.items);
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