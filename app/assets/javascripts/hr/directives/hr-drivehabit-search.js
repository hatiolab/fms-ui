angular.module('fmsHr').directive('hrDrivehabitSearch', function() {
	return { 
		restrict: 'E',
		controller: 'hrDrivehabitSearchCtrl',
		templateUrl: '/assets/hr/views/sidebars/drivehabit.html',
		scope: {},
		link : function(scope, element, attr, hrDrivehabitSearchCtrl) {
			var refreshButton = element.find('#btnHrDriveHabit');
			refreshButton.bind("click", function() {
				scope.search();
			});
		}
	}; 
})
.controller('hrDrivehabitSearchCtrl', function($rootScope, $scope, $element, GridUtils, FmsUtils, RestApi, ConstantReport) {

	/**
	 * 차트 바인딩 데이터 
	 */
	$scope.chartItems = [ {
		chartId : 'hr-drive-habit-1', sort_field :'speed_over', labels : [], data : []
	}, {
		chartId : 'hr-drive-habit-2', sort_field :'speed_slow', labels :[], data : []
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
	$scope.sort_field = 'speed_over';
	/**
	 * Sort value
	 * @type {String}
	 */
	$scope.sort_value = 'desc';
	/**
	 * TOP_RANK
	 * @type {Number}
	 */
	$scope.TOP_RANK = ConstantReport.TOP;

	/**
	 * 검색 조건 
	 *
	 * @param  {Object}
	 */
	$scope.normalizeSearchParams = function() {
		var formatDates = FmsUtils.formatFromToDate($scope.searchParams.from_date, $scope.searchParams.to_date);

		var params = { 
			from_date : formatDates[0],
			to_date : formatDates[1],
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
		$scope.sendChatData($scope.items);
		GridUtils.setGridContainerHieght('hr-drivehabit-table-container');
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
	$scope.sendChatData = function(items) {
		$scope.setChartData(items, $scope.chartItems[0], $scope.chartItems[0].sort_field);
		$scope.setChartData(items, $scope.chartItems[1], $scope.chartItems[1].sort_field);
		$scope.$emit('hr-drivehabit-items-change', $scope.chartItems);
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
			labels.push(currentItem.driver_name);
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
		$scope.searchParams['from_date'] = period[0];
		$scope.searchParams['to_date'] = period[1];
	};

	/**
	 * 검색 기간 설정 
	 */
	$scope.setSearchPeriod('week');

});