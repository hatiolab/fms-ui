angular.module('fmsReports').directive('reportsOverviewSearch', function() {
	return { 
		restrict: 'E',
		controller: 'reportsOverviewSearchCtrl',
		templateUrl: '/assets/reports/views/sidebars/overview.html',
		scope: {},
		link : function(scope, element, attr, reportsOverviewSearchCtrl) {
			var refreshButton = element.find('#btnReportOverview');
			refreshButton.bind("click", function() {
				scope.search();
			});
		}
	}; 
})
.controller('reportsOverviewSearchCtrl', function($rootScope, $scope, $element, $filter, FmsUtils, RestApi, ConstantReport) {
	/**
	 * 차트 바인딩 데이터 
	 */
	$scope.items = [ {
		chartId : 'report-overview-1', sort_field :'drive_time', labels :[], data : [], filter : 'fmsworktime'
	}, {
		chartId : 'report-overview-2', sort_field :'drive_dist', labels : [], data : [], filter : 'fmsdistance'
	}, {
		chartId : 'report-overview-3', sort_field :'overspeed', labels : [], data : []
	},{
		chartId : 'report-overview-4', sort_field :'impact', labels :[], data : []
	}, {
		chartId : 'report-overview-5', sort_field :'geofence', labels : [], data : []
	}, {
		chartId : 'report-overview-6', sort_field :'emergency', labels :[], data : []
	} ];
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
	$scope.TOP_RANK = ConstantReport.OVERVIEW_TOP;

	/**
	 * 검색 조건 
	 *
	 * @param  {Object}
	 */
	$scope.normalizeSearchParams = function() {
		var formatDates = FmsUtils.formatFromToDate($scope.searchParams.from_date, $scope.searchParams.to_date);

		return { 
			from_date : formatDates[0],
			to_date : formatDates[1],
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
		for(var i = 0; i < $scope.items.length; i++) {
			$scope.sort_field = $scope.items[i].sort_field;
			$scope.searchByCharType(i);
		}
	}

	/**
	 * Search Drivers
	 * 
	 * @param  {Object}
	 * @return N/A
	 */
	$scope.searchByCharType = function(index) {
		var searchParams = $scope.beforeSearch();
		$scope.doSearch(searchParams, function(dataSet) {
			$scope.afterSearch(dataSet, index);
		});
	};

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
		RestApi.search('/fleet_summaries/summary.json', params, function(dataSet) {
			callback(dataSet);
		});
	};

	/**
	 * 데이터 조회 후 ... 
	 * 
	 * @param  {Object}
	 * @return N/A
	 */
	$scope.afterSearch = function(dataSet, index) {
		$scope.setChartData(dataSet.items, index, $scope.items[index].sort_field);
	};

	/**
	 * Set Chart Data
	 * 
	 * @param {Array}
	 * @param {Object}
	 * @param {String}
	 * @return N/A
	 */
	$scope.setChartData = function(dataList, index, field) {
		var chartModel = $scope.items[index];
		if(!chartModel) {
			console.log(index + "'th data is empty!");
			return;
		}

		var labels = []; data = []; dataSize = dataList.length;
		for(var i = 0 ; i < dataSize ; i++) {
			var currentItem = dataList[i];
			labels.push(currentItem.fleet_name);
			var val = Number(currentItem[field]);
			val = chartModel.filter ? $filter(chartModel.filter)(val) : val;
			data.push(val);
		};

		chartModel.labels = labels; chartModel.data[0] = data;
		$scope.$emit('report-overview-item-change', chartModel);
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

	// --------------------------- E N D ----------------------------
});