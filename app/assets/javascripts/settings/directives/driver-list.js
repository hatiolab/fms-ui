angular.module('fmsSettings').directive('driverList', function() {
	return { 
		restrict: 'E',
		controller: 'driverListCtrl',
		templateUrl: '/assets/settings/views/sidebars/drivers.html',
		scope: {},
		link : function(scope, element, attr, driverListCtrl) {
			var refreshButton = element.find('#searchDrivers');
			refreshButton.bind("click", function() {
				scope.search(scope.tablestate);
			});
		}
	}; 
})
.controller('driverListCtrl', function($rootScope, $scope, $element, GridUtils, FmsUtils, RestApi) {

	/**
	 * Driver List
	 */
	 $scope.items = [];
	/**
	 * Smart Table
	 */
	 $scope.tablestate = null;
	/**
	 * 검색 조건 모델 
	 */
	 $scope.searchParams = {};
	/**
	 * [drivers init 처음 전체 페이지 로딩시는 fleet data 자동조회 하지 않는다.]
	 * @type {Boolean}
	 */
	 $scope.searchEnabled = false;

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
	 * Check Search
	 * 
	 * @return {Boolean}
	 */
	 $scope.checkSearch = function(tablestate) {
	 	if(!$scope.searchEnabled) {
	 		$scope.searchEnabled = true;
	 		$scope.tablestate = tablestate;
	 		$scope.tablestate.pagination.number = $scope.countPerPage;
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
		GridUtils.setGridContainerHieght('setting-driver-table-container');
	 };

	/**
	 * Show driver info to contents
	 * 
	 * @param  {Object}
	 * @return N/A
	 */
	 $scope.goItem = function(item) {
	 	$scope.setActiveItem(item);
	 	$scope.$emit('setting-driver-item-change', item);
	 };

	/**
	 * active item
	 * 
	 * @param {Object}
	 */
	 $scope.setActiveItem = function(activeItem) {
	 	for(var i = 0 ; i < $scope.items.length ; i++) {
	 		var item = $scope.items[i];
	 		item.active = (item.id == activeItem.id);
	 	}
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
	 * Driver items changed so the list must be refreshed
	 * 
	 * @param  {String}
	 * @param  handler function
	 */
	 var driversChangeListener = $rootScope.$on('setting-driver-items-change', function(event) {
	 	$scope.search($scope.tablestate);
	 });	

  /**
   * Destroy Scope - RootScope Event Listener 정리 
   */
   $scope.$on('$destroy', function(event) {
   	driversChangeListener();
   });

 });