angular.module('fmsReports').directive('groupAlertSearch', function() {
	return { 
		restrict: 'E',
		controller: 'groupAlertSearchCtrl',
		templateUrl: '/assets/reports/views/sidebars/group-alert.html',
		scope: {},
		link : function(scope, element, attr, groupAlertSearchCtrl) {
			var refreshButton = element.find('#btnReportGroupAlert');
			refreshButton.bind("click", function() {
				scope.search();
			});
		}
	}; 
})
.controller('groupAlertSearchCtrl', function($rootScope, $scope, $element, GridUtils, FmsUtils, RestApi) {
	/**
	 * 차트 바인딩 데이터 
	 */
	$scope.chartItems = [ {
		chartId : 'report-alert-group-1', sort_field :'impact', labels :[], data : []
	}, {
		chartId : 'report-alert-group-2', sort_field :'overspeed', labels : [], data : []
	}, {
		chartId : 'report-alert-group-3', sort_field :'geofence', labels : [], data : []
	},{
		chartId : 'report-alert-group-4', sort_field :'emergency', labels :[], data : []
	} ];
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
	$scope.sort_field = 'impact';
	/**
	 * Sort value
	 * @type {String}
	 */
	$scope.sort_value = 'desc';
	/**
	 * TOP_RANK
	 * @type {Number}
	 */
	$scope.TOP_RANK = 100;

	/**
	 * 검색 조건 
	 *
	 * @param  {Object}
	 */
	$scope.normalizeSearchParams = function() {
		return { 
			from_date : $scope.searchParams.from_date,
			to_date : $scope.searchParams.to_date,
			sort_field : $scope.sort_field,  
			sort_value : $scope.sort_value, 
			limit : $scope.TOP_RANK
		};
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
		RestApi.search('/fleet_group_summaries/event_summary.json', params, function(dataSet) {
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
		$scope.sendAlertChatData($scope.items);
		FmsUtils.setGridContainerHieght('report-group-alert-table-container');
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
	 * Build Driving Time Chart Data 
	 * 
	 * @param  {Array}
	 * @return N/A
	 */
	$scope.sendAlertChatData = function(items) {
		$scope.setChartData(items, $scope.chartItems[0], $scope.chartItems[0].sort_field);
		$scope.setChartData(items, $scope.chartItems[1], $scope.chartItems[1].sort_field);
		$scope.setChartData(items, $scope.chartItems[2], $scope.chartItems[2].sort_field);
		$scope.setChartData(items, $scope.chartItems[3], $scope.chartItems[3].sort_field);
		$scope.$emit('report-group-alert-items-change', $scope.chartItems);
	};

	/**
	 * Set Chart Data
	 * 
	 * @param {Array}
	 * @param {Object}
	 * @param {String}
	 * @return N/A
	 */
	$scope.setChartData = function(dataList, chartData, field) {
		var labels = []; data = []; dataSize = dataList.length;
		
		for(var i = 0 ; i < dataSize ; i++) {			
			var currentItem = dataList[i];
			labels.push(currentItem.group_name);
			data.push(Number(currentItem[field]));
		};

		chartData.labels = labels; 
		chartData.data = data;
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

});