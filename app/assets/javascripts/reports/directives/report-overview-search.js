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
	$scope.items = [];
	/**
	 * [drivers init 처음 전체 페이지 로딩시는 fleet data 자동조회 하지 않는다.]
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
	}


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
		$scope.items['drive_dist']= {};
		$scope.sort_field = 'drive_dist';
		$scope.search('drive_dist');

		$scope.items['drive_time']= {};
		$scope.sort_field = 'drive_time';
		$scope.search('drive_time');

		$scope.items['overspeed']= {};
		$scope.sort_field = 'overspeed';
		$scope.search('overspeed');

		$scope.items['impact']= {};
		$scope.sort_field = 'impact';
		$scope.search('impact');

		$scope.items['emergency']= {};
		$scope.sort_field = 'emergency';
		$scope.search('emergency');

		$scope.items['geofence']= {};
		$scope.sort_field = 'geofence';
		$scope.search('geofence');
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
			$scope.items[target] = dataSet.items;
			$scope.afterSearch($scope.items);
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
	 $scope.afterSearch = function(dataSet) {
		$scope.sendDrivingTimeChatData('Working Time By Driver', dataSet.drive_time);
		$scope.sendDrivingDistChartData('Driving distance By Driver', dataSet.drive_dist);
		$scope.sendOverspeedChartData('Overspeed', dataSet.overspeed);
		$scope.sendImpactChartData('Impact Count', dataSet.impact);
		$scope.sendGeofenceChartData('Geofence Count', dataSet.geofence);
		$scope.sendEmergencyChartData('Emergency Count', dataSet.emergency);
	 };

	 /**
	  * Build Driving Time Chart Data 
	  * 
	  * @param  {Array}
	  * @return N/A
	  */
	 $scope.sendDrivingTimeChatData = function(title, items) {
	 	// 1. Bar Chart
	 	var barChartData = { title : title, labels : [], data : [], series : ['Driving Time (km)'] };
	 	$scope.setChartData(items, barChartData, 'drive_time');

	 	// send data to chart scope
		$timeout(function() {$scope.$emit('bar-chart-data-change', barChartData)}, 200);
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
	 	// send data to chart scope
		$timeout(function() {$scope.$emit('bar-chart-data-change', barChartData)}, 200);
	 };

	 /**
	  * Build Over Speed Chart Data 
	  * 
	  * @param  {Array}
	  * @return N/A
	  */
	 $scope.sendOverspeedChartData = function(title, items) {
	 	var barChartData = { title : title, labels : [], data : [], series : ['Overspeed'] };
	 	$scope.setChartData(items, barChartData, 'speed_over');
	 	// send data to chart scope
		$timeout(function() {$scope.$emit('bar-chart-data-change', barChartData)}, 200);
	 };

	 /**
	  * Build Over Speed Chart Data 
	  * 
	  * @param  {Array}
	  * @return N/A
	  */
	 $scope.sendImpactChartData = function(title, items) {
	 	var lineChartData = { title : title, labels : [], data : [], series : ['Impact'] };
	 	$scope.setChartData(items, lineChartData, 'impact');
	 	// send data to chart scope
		$timeout(function() {$scope.$emit('line-chart-data-change', lineChartData)}, 200);
	 };

	 /**
	  * Build Over Speed Chart Data 
	  * 
	  * @param  {Array}
	  * @return N/A
	  */
	 $scope.sendEmergencyChartData = function(title, items) {
	 	var lineChartData = { title : title, labels : [], data : [], series : ['Emergency'] };
	 	$scope.setChartData(items, lineChartData, 'emergency');
	 	// send data to chart scope
		$timeout(function() {$scope.$emit('line-chart-data-change', lineChartData)}, 200);
	 };

	 /**
	  * Build Over Speed Chart Data 
	  * 
	  * @param  {Array}
	  * @return N/A
	  */
	 $scope.sendGeofenceChartData = function(title, items) {
	 	var lineChartData = { title : title, labels : [], data : [], series : ['Geofence'] };
	 	$scope.setChartData(items, lineChartData, 'geofence');
	 	// send data to chart scope
		$timeout(function() {$scope.$emit('line-chart-data-change', lineChartData)}, 200);
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
	 		chartData.data.push(Number(rawItem[field]));
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
	 * 초기화 함수 
	 * 
	 * @return N/A
	 */
	$scope.init = function() {
		/**
		 * init date picker1
		 */
		FmsUtils.initDatePicker('hr-overview-datepicker1', $scope.searchParams, 'from_date', $scope.search);
		/**
		 * init date picker2
		 */
		FmsUtils.initDatePicker('hr-overview-datepicker2', $scope.searchParams, 'to_date', $scope.search);

		$scope.searchByCharType();
	};

	/**
	 * 초기화 
	 */
	$scope.init();
	// --------------------------- E N D ----------------------------
});