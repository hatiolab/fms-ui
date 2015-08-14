angular.module('fmsReports').directive('groupDriveSearch', function() {
	return { 
		restrict: 'E',
		controller: 'groupDriveSearchCtrl',
		templateUrl: '/assets/reports/views/sidebars/group-drive.html',
		scope: {},
		link : function(scope, element, attr, groupSearchCtrl) {
			var refreshButton = element.find('#reportSearchGroupDrive');
			refreshButton.bind("click", function() {
				scope.search(scope.tablestate);
			});
		}
	}; 
})
.controller('groupDriveSearchCtrl', function($rootScope, $scope, $element, GridUtils, FmsUtils, RestApi) {
	/**
	 * 기본 날짜 검색일 설정 
	 */
	var period = FmsUtils.getPeriodString(3);
	/**
	 * 검색 조건 모델 
	 */
	$scope.searchParams = { 'from_date' : period[0], 'to_date' : period[1] };
	/**
	 * 사이드 바 토글 변수
	 */
	$scope.isSidebarToggle = true;
	/**
	 * Group List
	 */
	$scope.items = [];
	/**
	 * Smart Table
	 */
	$scope.tablestate = null;
	/**
	 * [drivers init 처음 전체 페이지 로딩시는 fleet data 자동조회 하지 않는다.]
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
	 * Search Fleet Groups
	 */
	$scope.findGroups = function(params) {
		RestApi.list('/fleet_groups.json', params, function(dataSet) {
			$scope.groups = dataSet;
		});
	};

	/**
	 * 검색 조건 
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
	 * Search Drivers
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
	 	RestApi.search('/fleet_group_summaries/summary.json', params, function(dataSet) {
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
		FmsUtils.setGridContainerHieght('report-group-table-container');

		// 1. Driving Time Chart Data - Bar && Donut
		$scope.sendDrivingTimeChatData('Driving Time', dataSet.items);
		// 2. Driving Distance Chart Data - Bar && Pie
		$scope.sendDrivingDistChartData('Driving Distance', dataSet.items);
		// 3. Velocity Chart Data - Line && Polararea
		$scope.sendVelocityChartData('Average Velocity', dataSet.items);
	 };

	 /**
	  * Build Driving Time Chart Data 
	  * 
	  * @param  {Array}
	  * @return N/A
	  */
	 $scope.sendDrivingTimeChatData = function(title, items) {
	 	// 1. Bar Chart
	 	var barChartData = { title : title, labels : [], data : [], series : ['Driving Time (min.)'] };
	 	$scope.setChartData(items, barChartData, 'drive_time');
	 	$scope.$emit('bar-chart-data-change', barChartData);
	 	
	 	// 2. Donought Chart
	 	var donutChartData = { title : title, labels : [], data : [] };
	 	$scope.setChartData(items, donutChartData, 'drive_time');
	 	$scope.$emit('donut-chart-data-change', donutChartData);
	 };

	 /**
	  * Build Driving Distance Chart Data 
	  * 
	  * @param  {Array}
	  * @return N/A
	  */
	 $scope.sendDrivingDistChartData = function(title, items) {
	 	// 1. Bar Chart
	 	var barChartData = { title : title, labels : [], data : [], series : ['Driving Distance (km)'] };
	 	$scope.setChartData(items, barChartData, 'drive_dist');
	 	$scope.$emit('bar-chart-data-change', barChartData);
	 	
	 	// 2. Donought Chart
	 	var pieChartData = { title : title, labels : [], data : [] };
	 	$scope.setChartData(items, pieChartData, 'drive_dist');
	 	$scope.$emit('pie-chart-data-change', pieChartData);
	 };

	 /**
	  * Build Velocity Chart Data 
	  * 
	  * @param  {Array}
	  * @return N/A
	  */
	 $scope.sendVelocityChartData = function(title, items) {
	 	// 1. Line Chart
	 	var lineChartData = { title : title, labels : [], data : [], series : ['Average Velocity'] };
	 	$scope.setChartData(items, lineChartData, 'velocity');
	 	$scope.$emit('line-chart-data-change', lineChartData);
	 	
	 	// 2. Donought Chart
	 	var polarareaChartData = { title : title, labels : [], data : [] };
	 	$scope.setChartData(items, polarareaChartData, 'velocity');
	 	$scope.$emit('polararea-chart-data-change', polarareaChartData);
	 };

	 /**
	  * Set Chart Data
	  * 
	  * @param {Array}
	  * @param {Object}
	  * @param {String}
	  * @return N/A
	  */
	 $scope.setChartData = function(rawItems, chartData, field) {
	 	for(var i = 0 ; i < rawItems.length ; i++) {
	 		var rawItem = rawItems[i];
	 		chartData.labels.push(rawItem.group_name);
	 		chartData.data.push(Number(rawItem[field]));
	 	};
	 };

	/**
	 * Watch drivers SearchParams in page scope, if changed trigger pageFleets in same scope
	 * 
	 * @param {Object}
	 * @return N/A
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
		FmsUtils.initDatePicker('report-group-datepicker1', $scope.searchParams, 'from_date', $scope.search);
		/**
		 * init date picker2
		 */
		FmsUtils.initDatePicker('report-group-datepicker2', $scope.searchParams, 'to_date', $scope.search);
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