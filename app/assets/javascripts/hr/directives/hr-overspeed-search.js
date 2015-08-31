angular.module('fmsHr').directive('hrOverspeedSearch', function() {
	return { 
		restrict: 'E',
		controller: 'hrOverspeedSearchCtrl',
		templateUrl: '/assets/hr/views/sidebars/overspeed.html',
		scope: {},
		link : function(scope, element, attr, hrOverspeedSearchCtrl) {
			var refreshButton = element.find('#btnHrOverspeed');
			refreshButton.bind("click", function() {
				scope.search();
			});
		}
	}; 
})
.controller('hrOverspeedSearchCtrl', function($rootScope, $scope, $element, $compile, $timeout, GridUtils, FmsUtils, RestApi) {
	/**
	 * Chart Item
	 * @type {Object}
	 */
	$scope.chartItem = {
		chart_id : 'hr-overspeed-1',
		type : 'Bar',		
		title : 'Over Speed Total Summary', 
		sort_field : 'overspeed',
		colors : [{
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#80D1FA",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(220,220,220,1)"			
		}],
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Over Speed Count'],
		labels : [],
		data : []
	};
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
	$scope.sort_field = 'overspeed';
	/**
	 * Sort value
	 * @type {String}
	 */
	$scope.sort_value = 'desc';
	/**
	 * TOP_RANK
	 * @type {Number}
	 */
	$scope.TOP_RANK = 30;

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
		$scope.showChart();
		GridUtils.setGridContainerHieght('hr-overspeed-table-container');
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
	 * Show Chart
	 */
	$scope.showChart = function() {
		var labels = []; data = []; dataSize = $scope.items.length;
		var chartItem = $scope.chartItem;

		for(var i = 0 ; i < $scope.items.length ; i++) {
			var currentItem = $scope.items[i];
			labels.push(currentItem.driver_name);
			data.push(Number(currentItem[chartItem.sort_field]));
		};

		chartItem.labels = labels;
		chartItem.data[0] = data;		
		$scope.$emit('hr-overspeed-item-change', chartItem);
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