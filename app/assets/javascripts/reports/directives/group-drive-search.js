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
	 * Data
	 */
	$scope.dataset = [ {
		labels :[],
		sort_field :'drive_time',
		data : [[]]
	}, {
		labels : [],
		sort_field :'drive_time',
		data : [[]]
	}, {
		labels : [],
		sort_field :'drive_dist',
		data : [[]]
	},{
		labels :[],
		sort_field :'drive_dist',
		data : [[]],
	}, {
		labels : [],
		sort_field :'velocity',
		data : [[]]
	}, {
		labels :[],
		sort_field :'velocity',
		data : [[]]
	} ];
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
	 * Sort Field Name & Sort value
	 * 
	 * @type {String}
	 */
	$scope.sort_field = 'drive_time'
	$scope.sort_value = 'desc'

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
		searchParams = angular.copy(params);
		//Sort Condition
		if($scope.sort_field&&$scope.sort_value){
			searchParams.sort_field= $scope.sort_field;
			searchParams.sort_value= $scope.sort_value;
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
		FmsUtils.setGridContainerHieght('report-group-drive-table-container');
		console.log(dataSet.items);
		$scope.sendDrivingChatData(dataSet.items);
	 };

	 /**
	  * Build Driving Time Chart Data 
	  * 
	  * @param  {Array}
	  * @return N/A
	  */
	 $scope.sendDrivingChatData = function(items) {
	 	$scope.setChartData(items,$scope.dataset[0],$scope.dataset[0].sort_field);
	 	$scope.setChartData(items,$scope.dataset[1],$scope.dataset[1].sort_field);
	 	$scope.setChartData(items,$scope.dataset[2],$scope.dataset[2].sort_field);
	 	$scope.setChartData(items,$scope.dataset[3],$scope.dataset[3].sort_field);
	 	$scope.setChartData(items,$scope.dataset[4],$scope.dataset[4].sort_field);
	 	$scope.setChartData(items,$scope.dataset[5],$scope.dataset[5].sort_field);
	 	$scope.$emit('report-drive-items-change', $scope.dataset);
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
	 		chartData.data[0].push(Number(rawItem[field]));
	 	};
	 };

	/**
	* [sort condition setup]
	* @param  {[string]} the field you should sort from database
	* $scope.sort_field {[string]} the field you should sort from database
	* $scope.sort_value {[string]} asc/desc default asc
	*/
	$scope.setsort = function(sort_field){
		var sortClass = $element.find('#'+sort_field)[0].className;
		$scope.sort_value= {};
		$scope.sort_field = sort_field;

		if(sortClass =="st-sort-ascent"){
			$scope.sort_value ="asc";
		}else if(sortClass =="st-sort-descent"){
			$scope.sort_value ="desc";
		}else{
			$scope.sort_value ="desc";
		}
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
		$scope.$emit('report-drive-items-change', $scope.dataset);
	};

	/**
	 * 초기화 
	 */
	$scope.init();

});