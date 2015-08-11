angular.module('fmsReports').directive('groupSearch', function() {
	return { 
		restrict: 'E',
		controller: 'groupSearchCtrl',
		templateUrl: '/assets/reports/views/sidebars/groups.html',
		scope: {},
		link : function(scope, element, attr, groupSearchCtrl) {
			var refreshButton = element.find('#reportSearchGroups');
			refreshButton.bind("click", function() {
				scope.search(scope.tablestate);
			});
		}
	}; 
})
.controller('groupSearchCtrl', function($rootScope, $scope, $element, GridUtils, FmsUtils, RestApi) {
	/**
	 * 기본 날짜 검색일 설정 
	 */
	var period = FmsUtils.getPeriodString(3);
	/**
	 * 검색 조건 모델 
	 */
	$scope.searchParams = { 'ctm_gte' : period[0], 'ctm_lte' : period[1] };
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
	 * Rails Server의 스펙에 맞도록 파라미터 변경 ...
	 *
	 * @param  {Object}
	 */
	$scope.normalizeSearchParams = function(params) {
		var searchParams = {'_o[code]' : 'asc'};

		if(!params || FmsUtils.isEmpty(params)) {
			return searchParams;
		} 

		searchParams['_q[code-like]'] = params.code;
		searchParams['_q[division-like]'] = params.division;
		searchParams['_q[name-like]'] = params.name;
		return searchParams;
	};

	/**
	 * Search Drivers
	 * 
	 * @param  {Object}
	 * @return N/A
	 */
	$scope.search = function(tablestate) {
		if(!$scope.searchEnabled) {
			$scope.searchEnabled = true;
			$scope.tablestate = tablestate;
			$scope.tablestate.pagination.number = GridUtils.getGridCountPerPage();
		}

		if(tablestate) {
			$scope.tablestate = tablestate;
		}

		searchParams = angular.copy($scope.searchParams);
		searchParams = $scope.normalizeSearchParams(searchParams);
		$scope.setPageQueryInfo(searchParams, $scope.tablestate.pagination, 0, GridUtils.getGridCountPerPage());

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
	  * infinite scorll directive에서 호출 
	  * 
	  * @return {Object}
	  */
	 $scope.beforeSearch = function() {
	 	var searchParams = angular.copy($scope.searchParams);
	 	return $scope.normalizeSearchParams(searchParams);
	 };

	 /**
	  * infinite scorll directive에서 호출 
	  * 
	  * @param  {Object}
	  * @param  {Function}
	  * @return N/A
	  */
	 $scope.doSearch = function(params, callback) {
	 	RestApi.search('/drivers.json', params, function(dataSet) {
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
		// grid container를 새로 설정한다.
		FmsUtils.setGridContainerHieght('report-group-table-container');
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
		FmsUtils.initDatePicker('report-group-datepicker1', $scope.searchParams, 'ctm_gte', $scope.search);
		/**
		 * init date picker2
		 */
		FmsUtils.initDatePicker('report-group-datepicker2', $scope.searchParams, 'ctm_lte', $scope.search);
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