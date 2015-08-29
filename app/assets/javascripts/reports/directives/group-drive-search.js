angular.module('fmsReports').directive('groupDriveSearch', function() {
	return { 
		restrict: 'E',
		controller: 'groupDriveSearchCtrl',
		templateUrl: '/assets/reports/views/sidebars/group-drive.html',
		scope: {},
		link : function(scope, element, attr, groupDriveSearchCtrl) {
			var refreshButton = element.find('#btnReportGroupDrive');
			refreshButton.bind("click", function() {
				scope.search();
			});
		}
	}; 
})
.controller('groupDriveSearchCtrl', function($rootScope, $scope, $element, GridUtils, FmsUtils, RestApi) {
	/**
	 * 차트 바인딩 데이터 
	 */
	$scope.chartItems = [ {
		chartId : 'report-driver-group-1', sort_field :'drive_time', labels :[], data : []
	}, {
		chartId : 'report-driver-group-2', sort_field :'drive_time', labels : [], data : []
	}, {
		chartId : 'report-driver-group-3', sort_field :'drive_dist', labels : [], data : []
	},{
		chartId : 'report-driver-group-4', sort_field :'drive_dist', labels :[], data : []
	}, {
		chartId : 'report-driver-group-5', sort_field :'velocity', labels : [], data : []
	}, {
		chartId : 'report-driver-group-6', sort_field :'velocity', labels :[], data : []
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
	$scope.sort_field = 'drive_time';
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
		RestApi.search('/fleet_group_summaries/summary.json', params, function(dataSet) {
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
		$scope.sendDrivingChatData($scope.items);
		GridUtils.setGridContainerHieght('report-group-drive-table-container');
	};

	/**
	 * Items Numbering
	 * 
	 * @param  {Array}
	 * @return N/A
	 */
	$scope.numbering = function(items) {
		for(var i = 0 ; i < items.length ; i++) {
			var item = items[i];
			item.no = i + 1;
			item.velocity = Math.round(item.velocity);
		}
	};

	/**
	 * Build Driving Time Chart Data 
	 * 
	 * @param  {Array}
	 * @return N/A
	 */
	$scope.sendDrivingChatData = function(items) {
		$scope.setChartData(items, $scope.chartItems[0], $scope.chartItems[0].sort_field);
		$scope.setChartData(items, $scope.chartItems[1], $scope.chartItems[1].sort_field);
		$scope.setChartData(items, $scope.chartItems[2], $scope.chartItems[2].sort_field);
		$scope.setChartData(items, $scope.chartItems[3], $scope.chartItems[3].sort_field);
		$scope.setChartData(items, $scope.chartItems[4], $scope.chartItems[4].sort_field);
		$scope.setChartData(items, $scope.chartItems[5], $scope.chartItems[5].sort_field);
		$scope.$emit('report-group-driver-items-change', $scope.chartItems);
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