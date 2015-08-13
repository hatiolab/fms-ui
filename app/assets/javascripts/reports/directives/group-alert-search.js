angular.module('fmsReports').directive('groupAlertSearch', function() {
	return { 
		restrict: 'E',
		controller: 'groupAlertSearchCtrl',
		templateUrl: '/assets/reports/views/sidebars/group-alert.html',
		scope: {},
		link : function(scope, element, attr, fleetSearchCtrl) {
			var refreshButton = element.find('#reportSearchAlerts');
			refreshButton.bind("click", function() {
				scope.search(scope.tablestate);
			});
		}
	}; 
})
.controller('groupAlertSearchCtrl', function($rootScope, $scope, $element, GridUtils, FmsUtils, RestApi) {

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
	 * Chart Name
	 * 
	 * @type {String}
	 */
	$scope.chartName = 'Impact';
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
	 	RestApi.search('/fleet_group_summaries/event_summary.json', params, function(dataSet) {
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
		FmsUtils.setGridContainerHieght('report-group-alert-table-container');
		// 1. Impact Alert Chart Data - doughnut
		$scope.sendImpactAlertChatData(dataSet.items);
		// 2. Overspeed Alert Chart Data - pie
		$scope.sendOverspeedAlertChartData(dataSet.items);
		// 3. Geofence Alert Chart Data - bar
		$scope.sendGeofenceAlertChartData(dataSet.items);
		// 4. Emergency Alert Chart Data - polararea
		$scope.sendEmergencyAlertChartData(dataSet.items);
	 };
	/**
	 * [ Impact Alert Chart Data - doughnut]
	 * @param  {[type]} dataSet [description]
	 */
	$scope.sendImpactAlertChatData = function(items){
	 	var donutChartData = { title : 'Impact Count', labels : [], data : [] };
	 	$scope.setChartData(items, donutChartData, 'impact');
	 	$scope.$emit('donut-chart-data-change', donutChartData);
	}

	/**
	 * [ Overspeed Alert Chart Data - pie]
	 * @param  {[type]} dataSet [description]
	 */
	$scope.sendOverspeedAlertChartData = function(items){
		var pieChartData = { title : 'Overspeed Count', labels : [], data : [] };
	 	$scope.setChartData(items, pieChartData, 'overspeed');
	 	$scope.$emit('pie-chart-data-change', pieChartData);
	}

	/**
	 * [ Geofence Alert Chart Data - bar]
	 * @param  {[type]} dataSet [description]
	 */
	$scope.sendGeofenceAlertChartData = function(items){
	 	var barChartData = { title : 'Geofence Count', labels : [], data : [] };
	 	$scope.setChartData(items, barChartData, 'geofence');
	 	$scope.$emit('bar-chart-data-change', barChartData);
	}

	/**
	 * [ Emergency Alert Chart Data - polararea]
	 * @param  {[type]} dataSet [description]
	 */
	$scope.sendEmergencyAlertChartData = function(items){
	 	var polarareaChartData = { title : 'Emergency Count', labels : [], data : [] };
	 	$scope.setChartData(items, polarareaChartData, 'emergency');
	 	$scope.$emit('polararea-chart-data-change', polarareaChartData);
	}
	
	$scope.setChartData = function(rawItems, barChartData, field) {
	 	for(var i = 0 ; i < rawItems.length ; i++) {
	 		var rawItem = rawItems[i];
	 		barChartData.labels.push(rawItem.group_name);
	 		barChartData.data.push(Number(rawItem[field]));
	 	};
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
		FmsUtils.initDatePicker('report-group-alert-datepicker1', $scope.searchParams, 'from_date', $scope.search);
		/**
		 * init date picker2
		 */
		FmsUtils.initDatePicker('report-group-alert-datepicker2', $scope.searchParams, 'to_date', $scope.search);
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