angular.module('fmsReports').directive('groupDriveChart', function() { 
	return { 
		restrict: 'E',
		controller: 'groupDriveChartCtrl',
		templateUrl: '/assets/reports/views/contents/group-drive.html',
		scope: {}
	}; 
})
.controller('groupDriveChartCtrl', function($rootScope, $scope, $element, $filter, FmsUtils) {

	/**
	 * Distance & Time Unit
	 */
	var distunit = $filter('distunit')('');
	var timeunit = $filter('timeunit')('');
	var speedunit = $filter('speedunit')('');

	$scope.items = [ {
		chartId : 'report-driver-group-1',
		type : 'Bar',
		title : 'Driving Time (' + timeunit + ')',
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series : ['Driving Time (' + timeunit + ')'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#80D1FA",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(220,220,220,1)"			
		} ],
		labels :[],
		data : [[]]
	}, {
		chartId : 'report-driver-group-2',
		type : 'Line',		
		title : 'Driving Time (' + timeunit + ')',
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series : ['Driving Time (' + timeunit + ')'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#4EBCAD",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels : [],
		data : [[]]
	}, {
		chartId : 'report-driver-group-3',
		type : 'Bar',		
		title : 'Driving Distance (' + distunit + ')', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series : ['Driving Distance (' + distunit + ')'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#84C867",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],	
		labels : [],
		data : [[]]
	},{
		chartId : 'report-driver-group-4',
		type : 'Line',
		title : 'Driving Distance (' + distunit + ')', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Driving Distance (' + distunit + ')'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#FC787B",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels :[],
		data : [[]]
	}, {
		chartId : 'report-driver-group-5',
		type : 'Bar',
		title : 'Average Velocity (' + speedunit + ')', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series : ['Average Velocity (' + speedunit + ')'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#FFD600",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],	
		labels : [],
		data : [[]]
	}, {
		chartId : 'report-driver-group-6',
		type : 'Line',
		title : 'Average Velocity (' + speedunit + ')', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Average Velocity (' + speedunit + ')'],
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
	var itemsChangeListener = $rootScope.$on('report-group-driver-items-change', function(event, items) {		
		for(var i = 0 ; i < items.length ; i++) {
	 		var item = items[i]; activeItem = $scope.items[i];

	 		if(FmsUtils.isEmptyArray(item.data)) {
	 			$scope.setChartEmptyData(activeItem);
	 		} else {
	 			activeItem.labels = item.labels;
	 			activeItem.data[0] = item.data;
	 		}
	 	};
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