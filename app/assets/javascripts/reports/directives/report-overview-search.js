angular.module('fmsReports').directive('reportsOverviewSearch', function() {
	return { 
		restrict: 'E',
		controller: 'reportsOverviewSearchCtrl',
		templateUrl: '/assets/reports/views/sidebars/overview.html',
		scope: {},
		link : function(scope, element, attr, fleetSearchCtrl) {
			var refreshButton = element.find('#reportsSearchOverview');
			refreshButton.bind("click", function() {
				scope.searchByCharType();
			});
		}
	}; 
})
.controller('reportsOverviewSearchCtrl', function($rootScope, $scope, $element, $compile, $timeout, GridUtils, FmsUtils, RestApi) {

	$scope.items = [ {
		labels :[],
		sort_field :'drive_time',
		data : [[]]
	}, {
		labels : [],
		sort_field :'drive_dist',
		data : [[]]
	}, {
		labels : [],
		sort_field :'overspeed',
		data : [[]]
	},{
		labels :[],
		sort_field :'impact',
		data : [[]],
	}, {
		labels : [],
		sort_field :'emergency',
		data : [[]]
	}, {
		labels :[],
		sort_field :'geofence',
		data : [[]]
	} ];
	/**
	 * 기본 날짜 검색일 설정 
	 */
	var period = FmsUtils.getPeriodString(7);
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
	//$scope.items = [];
	/**
	 * 검색 가능한 지 여부 
	 * @type {Boolean}
	 */
	$scope.searchEnabled = true;
	/**
	 * Sort Field Name & Sort value
	 * 
	 * @type {String}
	 */
	$scope.sort_field = 'impact'
	$scope.sort_value = 'desc'

	$scope.setSearchPeriod = function(periodType){
		period = FmsUtils.getPeriodString(periodType);
		$scope.searchParams = { 'from_date' : period[0], 'to_date' : period[1] };
		$scope.searchByCharType();
	};

	/**
	 * 검색 조건 
	 *
	 * @param  {Object}
	 */
	$scope.normalizeSearchParams = function(params) {
		var searchParams = angular.copy(params);
		//Sort Condition
		searchParams.sort_field= $scope.sort_field;
		searchParams.sort_value= $scope.sort_value;
		searchParams.limit = 10;
		return searchParams;
	};

	$scope.searchByCharType=function(){
		for(var i=0; i<$scope.items.length; i++){
			$scope.sort_field = $scope.items[i].sort_field;
			$scope.search(i);
		}
		$scope.$emit('report-overview-items-change', $scope.items);
	}
	/**
	 * Search Drivers
	 * 
	 * @param  {Object}
	 * @return N/A
	 */
	$scope.search = function(target) {
		var searchParams = $scope.beforeSearch();

		$scope.doSearch(searchParams, function(dataSet) {
			// $scope.items[target].data = dataSet.items;
			$scope.afterSearch(dataSet,target);
		});
	};

	 /**
	  * infinite scorll directive에서 호출 
	  * 
	  * @return {Object}
	  */
	 $scope.beforeSearch = function() {
	 	return $scope.normalizeSearchParams($scope.searchParams);
	 };

	 /**
	  * infinite scorll directive에서 호출 
	  * 
	  * @param  {Object}
	  * @param  {Function}
	  * @return N/A
	  */
	 $scope.doSearch = function(params, callback) {
	 	RestApi.search('/fleet_summaries/summary.json', params, function(dataSet) {
	 		callback(dataSet);
	 	});
	 };

	 /**
	  * infinite scorll directive에서 호출 
	  * 
	  * @param  {Object}
	  * @return N/A
	  */
	 $scope.afterSearch = function(dataSet,target) {
	 	 $scope.setChartData(dataSet.items,$scope.items[target],$scope.sort_field);
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
	 		chartData.labels.push(rawItem.fleet_name);
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
	
	$scope.$watchCollection('searchParams', function() {
		$scope.searchByCharType($scope.tablestate);
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
		// FmsUtils.initDatePicker('hr-overview-datepicker1', $scope.searchParams, 'from_date', $scope.search);
		/**
		 * init date picker2
		 */
		// FmsUtils.initDatePicker('hr-overview-datepicker2', $scope.searchParams, 'to_date', $scope.search);

		$scope.searchByCharType();
	};

	/**
	 * 초기화 
	 */
	$scope.init();
	// --------------------------- E N D ----------------------------
});