angular.module('fmsHr').directive('hrOverviewChart', function() { 
	return { 
		restrict: 'E',
		controller: 'hrOverviewCtrl',
		templateUrl: '/assets/hr/views/contents/overview.html',
		scope: {}
	}; 
})
.controller('hrOverviewCtrl', function($rootScope, $scope, $element, $filter, FmsUtils) {
	/**
	 * Unit
	 */
	var timeunit = $filter('timeunit')('');
	var distunit = $filter('distunit')('');

	$scope.items = [ {
		chartId: 'hr-overview-1',
		type:'Bar',
		title : 'Working Time By Driver (' + timeunit + ')',
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series:['Driving Time (' + timeunit + ')'],
		sort_field :'drive_time',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#80D1FA",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(220,220,220,1)"			
		} ],
		labels :[],
		data : [[]]
	}, {
		chartId: 'hr-overview-2',
		type:'Line',
		title : 'Driving Distance By Driver (' + distunit + ')',
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Driving Distance (' + distunit + ')'],
		sort_field :'drive_dist',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#4EBCAD",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels : [],
		data : [[]]
	}, {
		chartId: 'hr-overview-3',
		type:'Bar',
		title : 'Overspeed Count', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series:['Overspeed Count'],
		sort_field :'overspeed',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#84C867",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels : [],
		data : [[]]
	},{
		chartId: 'hr-overview-4',
		type:'Line',
		title : 'Geofence Count', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Impact Count'],
		sort_field :'geofence',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#FC787B",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels :[],
		data : [[]]
	}, {
		chartId: 'hr-overview-5',
		type:'Bar',
		title : 'Impact Count', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series:['Geofence Count'],
		sort_field :'impact',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#FFD600",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels : [],
		data : [[]]
	}, {
		chartId: 'hr-overview-6',
		type:'Line',
		title : 'Emergency Count', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Emergency Count'],
		sort_field :'emergency',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#F69F40",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels :[],
		data : [[]]
	} ];

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('hr-overview-item-change', function(event, item) {		
		var selectedItem = $scope.items.filter(function(element, index, array) {
			return element.chartId == item.chartId;
		});

		if(selectedItem && selectedItem.length > 0) {
			var activeItem = selectedItem[0];

			if(FmsUtils.isEmptyArray(item.data)) {
				$scope.setChartEmptyData(activeItem);
			} else {
				activeItem.data = item.data;
				activeItem.labels = item.labels;
			}
		}
	});

	/**
	 * Chart Empty Data
	 */
	$scope.setChartEmptyData = function(chartItem) {
		chartItem.labels = ['0'];
		chartItem.data[0] = [0];
	};

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		itemsChangeListener();
	});	

	// --------------------------- E N D ----------------------------
});