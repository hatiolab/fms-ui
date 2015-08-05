angular.module('fmsSettings').directive('driverList', function() {
	return { 
		restrict: 'E',
		controller: 'driverListCtrl',
		templateUrl: '/assets/settings/views/sidebars/drivers.html',
		scope: {},
		link : function(scope, element, attr, driverListCtrl) {
			var refreshButton = element.find('#searchDrivers');
			refreshButton.bind("click", function() {
				scope.searchDrivers(scope.tablestate);
			});
		}
	}; 
})
.controller('driverListCtrl', function($rootScope, $scope, $resource, $element, FmsUtils, RestApi) {

	/**
	 * 사이드 바 토글 변수
	 */
	$scope.isSidebarToggle = true;
	/**
	 * Driver List
	 */
	$scope.items = [];
	/**
	 * Smart Table
	 */
	$scope.tablestate = null;
	/**
	 * 폼 모델 초기화 
	 */
	$scope.searchParams = {};
	/**
	 * [drivers init 처음 전체 페이지 로딩시는 fleet data 자동조회 하지 않는다.]
	 * @type {Boolean}
	 */
	$scope.driverInit = false;

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

		searchParams['_q[code-like]'] = params.code;
		searchParams['_q[division-like]'] = params.division;
		searchParams['_q[name-like]'] = params.name;
		searchParams['_o[code]'] = 'asc';
		return searchParams;
	};

	/**
	 * Search Drivers
	 * 
	 * @param  {Object}
	 * @return N/A
	 */
	$scope.searchDrivers = function(tablestate) {
		if(!$scope.driverInit) {
			$scope.driverInit = true;
			$scope.tablestate = tablestate;
			$scope.tablestate.pagination.number = 20;
		}

		if(tablestate) {
			$scope.tablestate = tablestate;
		}

		searchParams = angular.copy($scope.searchParams);
		searchParams = $scope.normalizeSearchParams(searchParams);
		$scope.setPageQueryInfo(searchParams, $scope.tablestate.pagination, 0, 20);

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
	 }

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
		FmsUtils.setGridContainerHieght('setting-driver-table-container');
	 };

	/**
	 * Show driver info to contents
	 * 
	 * @param  {Object}
	 * @return N/A
	 */
	$scope.goDriver = function(driver) {
		$scope.$emit('setting-driver-item-change', driver);
	};

	/**
	 * Driver items changed so the list must be refreshed
	 * 
	 * @param  {String}
	 * @param  handler function
	 */
	$rootScope.$on('setting-driver-items-change', function(event) {
		$scope.searchDrivers($scope.tablestate);
	});

	/**
	 * [watch drivers SearchParams in page scope, if changed trigger pageFleets in same scope]
	 * @param  $scope.searchParams
	 * @return null
	 */
	$scope.$watchCollection('searchParams', function() {
		if($scope.driverInit) {
			$scope.searchDrivers(null);
		}
	});

});