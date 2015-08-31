angular.module('fmsReports').directive('fleetDriveSearch', function() {
	return { 
		restrict: 'E',
		controller: 'fleetDriveSearchCtrl',
		templateUrl: '/assets/reports/views/sidebars/fleet-drive.html',
		scope: {},
		link : function(scope, element, attr, fleetDriveSearchCtrl) {
			var refreshButton = element.find('#btnReportFleetDrive');
			refreshButton.bind("click", function() {
				scope.search();
			});
		}
	}; 
})
.controller('fleetDriveSearchCtrl', function($rootScope, $scope, $element, $compile, $timeout, $filter, GridUtils, FmsUtils, RestApi) {
	/**
	 * Time, Distance, Speed Unit
	 */
	var timeunit = $filter('timeunit')('');
	var distunit = $filter('distunit')('');
	var speedunit = $filter('speedunit')('');

	/**
	 * Chart Item
	 * @type {Object}
	 */
	$scope.chartItems = [ {
		chart_id : 'report-fleet-drive-1',
		type : 'Line',		
		title : 'Driving Time (' + timeunit + ')', 
		sort_field : 'drive_time',
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Driving Time (' + timeunit + ')'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#F69F40",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels : [],
		data : []
	}, {
		chart_id : 'report-fleet-drive-2',
		type : 'Line',
		sort_field : 'drive_dist',
		title : 'Driving Distance (' + distunit + ')',
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Driving Distance (' + distunit + ')'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#F69F40",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		filter : 'fmsdistance',
		labels : [],
		data : []
	}, {
		chart_id : 'report-fleet-drive-3',
		type : 'Line',
		sort_field : 'velocity',
		title : 'Average Velocity (' + speedunit + ')',
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Average Velocity (' + speedunit + ')'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#F69F40",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		filter : 'fmsvelocity',
		labels : [],
		data : []
	} ];
	/**
	 * Selected Chart
	 * @type {Object}
	 */
	$scope.chartId = $scope.chartItems[0].chart_id;
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
	$scope.TOP_RANK = 30;

	/**
	 * 검색 조건 
	 *
	 * @param  {Object}
	 */
	$scope.normalizeSearchParams = function() {
		var params = { 
			from_date : $scope.searchParams.from_date,
			to_date : $scope.searchParams.to_date,
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
	$scope.afterSearch = function(dataSet) {
		$scope.numbering(dataSet.items);
		$scope.items = dataSet.items;
		$scope.showChart();
		GridUtils.setGridContainerHieght('report-fleet-drive-table-container');
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
			items[i].velocity = Math.round(items[i].velocity);
		}
	};

	/**
	 * Show Chart
	 */
	$scope.showChart = function() {
		var chartItem = $scope.chartItems.filter(function(chartItem) {
			return $scope.chartId == chartItem.chart_id;
		});

		if(chartItem && chartItem.length > 0) {
			chartItem = chartItem[0];

			var labels = []; data = []; dataSize = $scope.items.length;
			for(var i = 0 ; i < $scope.items.length ; i++) {
				var currentItem = $scope.items[i];
				labels.push(currentItem.fleet_name);
				var val = Number(currentItem[chartItem.sort_field]);

				if(chartItem.filter) {
					data.push($filter(chartItem.filter)(val));
				} else {
					data.push(val);
				}
			};

			chartItem.labels = labels;
			chartItem.data[0] = data;		
			$scope.$emit('report-fleet-driver-item-change', chartItem);
		}		
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