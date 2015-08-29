angular.module('fmsHr').directive('hrDrivedistanceSearch', function() {
	return { 
		restrict: 'E',
		controller: 'hrDrivedistanceSearchCtrl',
		templateUrl: '/assets/hr/views/sidebars/drivedistance.html',
		scope: {},
		link : function(scope, element, attr, hrDrivedistanceSearchCtrl) {
			var refreshButton = element.find('#btnHrDriveDistance');
			refreshButton.bind("click", function() {
				scope.search();
			});
		}
	}; 
})
.controller('hrDrivedistanceSearchCtrl', function($rootScope, $scope, $element, $compile, $timeout, GridUtils, FmsUtils, RestApi) {

	/**
	 * Chart Item
	 * @type {Object}
	 */
	$scope.chartItem = {
		chart_id : 'hr-drive-dist-1',
		type : 'Bar',		
		title : 'Driving Distance By Driver', 
		sort_field : 'drive_dist',
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Driving Distance (km)'],
		labels : [],
		data : []
	};
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
	$scope.sort_field = 'drive_dist';
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
	 		params.group_id = $scope.searchParams.group.id;
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
		RestApi.search('/fleet_summaries/driver_summary.json', params, function(dataSet) {
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
		GridUtils.setGridContainerHieght('hr-drivedist-table-container');
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
		var labels = []; data = []; dataSize = $scope.items.length;
		var chartItem = $scope.chartItem;

		for(var i = 0 ; i < $scope.items.length ; i++) {
			var currentItem = $scope.items[i];
			labels.push(currentItem.driver_name);
			data.push(Number(currentItem[chartItem.sort_field]));
		};

		chartItem.labels = labels;
		chartItem.data[0] = data;		
		$scope.$emit('hr-drivedist-item-change', chartItem);
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

 //  /**
 //   * 기본 날짜 검색일 설정 
 //   */
 //  var period = FmsUtils.getPeriodString(7);
 //  /**
 //   * 검색 조건 
 //   * 
 //   * @type {Object}
 //   */
	// $scope.searchParams = { from_date : period[0], to_date : period[1] };
	// /**
	//  * Group List
	//  *
	//  * @type {Array}
	//  */
	// $scope.items = [];
	// /**
	//  * 선택된 아이템
	//  */
	// $scope.item = null;
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
	//  * Top 10만 조회 
	//  * 
	//  * @type {Number}
	//  */
	// $scope.limit      = 10;
	// /**
	//  * Chart Title
	//  * 
	//  * @type {String}
	//  */
	// $scope.chartTitle = 'Driving Distance By Driver';
	// /**
	//  * 검색 Sort 필드 
	//  * 
	//  * @type {String}
	//  */
	// $scope.sort_field = 'drive_dist';
	// /**
	//  * 검색 Sort 조건 
	//  * 
	//  * @type {String}
	//  */
	// $scope.sort_value = 'desc';
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
	//  * Show Total Summary Chart
	//  */
	// $scope.showTotalChart = function(list) {
	// 	// 선택 아이템 변경 
	// 	$scope.item = null;
	// 	$scope.chartTitle = "Driving Distance By Driver";

	// 	// 기존 차트 삭제 
	// 	var parent = $('div.report-content').parent();
	// 	$('div.report-content').remove();
	// 	var html = "<div class='report-content'><fms-bar-chart class='col-xs-12 col-sm-12' title='Driving Distance By Driver'></fms-bar-chart></div>";
	// 	var el = $compile(html)($scope);
	//  	parent.append(el);
	//  	// send data to chart scope
	//  	$timeout.cancel();
 //   		$timeout($scope.sendTotalChartData, 250, true, list);
	// };

	// /**
	//  * Send Chart Data
	//  * 
	//  * @return N/A
	//  */
	// $scope.sendTotalChartData = function(list) {
	// 	$scope.chartTitle = 'Driving Distance By Driver';
	//  	var barChartData = { title : $scope.chartTitle, labels : [], data : [] };
	// 	$scope.setChartData(list, barChartData, ['drive_dist'], ['Drive distance']);
	// 	$scope.$emit('bar-chart-data-list-change', barChartData);
	// };

	//  /**
	//   * Set Chart Data
	//   *
	//   * @param {Array}
	//   * @param {Object}
	//   * @param {Array}
	//   * @param {Array}
	//   */
	// $scope.setChartData = function(dataList, chartData, fieldList, series) {
	//  	for(var i = 0 ; i <  $scope.items.length ; i++) {
	//  		var item =  $scope.items[i];
	//  		chartData.labels.push(item.driver_name);
	//  		chartData.series = series;
	//  	}
	 	
	//  	for(var i = 0 ; i < fieldList.length ; i++) {
	//  		var field = fieldList[i];
	//  		chartData.data.push([]);

	// 		for(var j = 0 ; j <  $scope.items.length ; j++) {
	// 			var item = $scope.items[j];
	// 			chartData.data[i].push(Number(item[field]));
	//  		}
	//  	}
	// };

	// /**
	//  * active item
	//  * 
	//  * @param {Object}
	//  */
	// $scope.setActiveItem = function(activeItem) {
	// 	// 선택 아이템 변경 
	// 	$scope.item = activeItem;		
	// 	for (var i = 0; i < $scope.items.length; i++) {
	// 		var item = $scope.items[i];
	// 		item.active = (item.driver_id == $scope.item.driver_id);
	// 	}
	// };

	// /**
	//  * Show Selected Item Chart
	//  * 
	//  * @return N/A
	//  */
	// $scope.showItemChart = function(item) {
	// 	$scope.setActiveItem(item);
	// 	$scope.chartTitle = "Drive Distance Trend - " + item.driver_code + " (" + item.driver_name + ")";
	// 	var params = { driver_id : item.driver_id, 
	// 				   from_date : $scope.searchParams['from_date'], 
	// 				   to_date : $scope.searchParams['to_date'],
	// 				   sort_field : "date",
	// 				   sort_value : "asc"}

	// 	RestApi.list('/fleet_summaries/driver_summary.json', params, function(list) {
	// 		// 기존 차트 삭제 
	// 		var parent = $('div.report-content').parent();
	// 		$('div.report-content').remove();
	// 		var html = "<div class='report-content'><fms-bar-chart class='col-xs-12 col-sm-12' title='" + $scope.chartTitle + "'></fms-bar-chart></div>";
	// 		var el = $compile(html)($scope);
	// 	 	parent.append(el);
	// 	 	// send data to chart scope
	// 	 	$timeout.cancel();
	//    	$timeout($scope.sendItemChartData, 250, true, list);
	//  	});
	// };

	// /**
	//  * Send Driver Chart Data
	//  */
	// $scope.sendItemChartData = function(list) {
	//  	var barChartData = { title : $scope.chartTitle, labels : [], series : ['Over Speed Count'], data : [] };
	//  	for(var i = 0 ; i < list.length ; i++) {
	//  		var item = list[i];
	//  		barChartData.labels.push(item.date);
	//  		barChartData.data.push(Number(item.drive_dist));
	//  	};
	// 	$scope.$emit('bar-chart-data-change', barChartData);
	// };

	// /**
	//  * Rails Server의 스펙에 맞도록 파라미터 변경 ...
	//  *
	//  * @param  {Object}
	//  */
	// $scope.normalizeSearchParams = function(params) {
	// 	var searchParams = {};

	// 	if(!params || FmsUtils.isEmpty(params)) {
	// 		params = $scope.searchParams;
	// 	} 

	// 	searchParams["from_date"] = params.from_date;
	// 	searchParams["to_date"] = params.to_date;
	// 	searchParams["sort_field"]= $scope.sort_field;
	// 	searchParams["sort_value"]= $scope.sort_value;
	// 	searchParams.limit = $scope.limit;
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
	// 	if($scope.checkSearch(tablestate)) {
	// 		var searchParams = $scope.beforeSearch();
	// 		$scope.doSearch(searchParams, function(dataSet) {
	// 			$scope.numbering(dataSet.items, 1);
	// 			$scope.items = dataSet.items;
	// 			$scope.afterSearch(dataSet);
	// 		});
	// 	}
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
	//  		var item = items[i];
	//  		item.no = i + 1;
	//  		item.velocity = Math.round(item.velocity);
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
	//  $scope.beforeSearch = function() {
	//  	var searchParams = $scope.normalizeSearchParams($scope.searchParams);
	//  	$scope.setPageQueryInfo(searchParams, $scope.tablestate.pagination, 0, GridUtils.getGridCountPerPage());
	//  	return searchParams;
	//  };

	//  /**
	//   * infinite scorll directive에서 호출 
	//   * 
	//   * @param  {Object}
	//   * @param  {Function}
	//   * @return N/A
	//   */
	//  $scope.doSearch = function(params, callback) {
	//  	RestApi.search('/fleet_summaries/driver_summary.json', params, function(dataSet) {
	//  		callback(dataSet);
	//  	});
	//  };

	//  /**
	//   * infinite scorll directive에서 호출 
	//   * 
	//   * @param  {Object}
	//   * @return N/A
	//   */
	//  $scope.afterSearch = function(dataSet) {
	//  	$scope.setPageReultInfo(dataSet.total, dataSet.total_page, dataSet.page);
	// 	GridUtils.setGridContainerHieght('hr-drivedist-table-container');
	// 	$scope.showTotalChart(dataSet.items);
	//  };

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


	// /**
	//  * 초기화 함수 
	//  * 
	//  * @return N/A
	//  */
	// $scope.init = function() {
	// };

	// /**
	//  * 초기화 
	//  */
	// $scope.init();

});