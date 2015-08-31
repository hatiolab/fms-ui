angular.module('fmsReports').directive('groupAlertChart', function() { 
	return { 
		restrict: 'E',
		controller: 'groupAlertChartCtrl',
		templateUrl: '/assets/reports/views/contents/group-alert.html',
		scope: {}
	}; 
})
.controller('groupAlertChartCtrl', function($rootScope, $scope, $element, FmsUtils) {

	$scope.items = [ {
		chartId : 'report-alert-group-1',
		type : 'Doughnut',
		title : 'Impact Count', 
		container_cls : 'panel panel-default type-pie col-xs-12 col-sm-6',
		series : ['Impact Count'],
		labels :[],
		data : []
	}, {
		chartId : 'report-alert-group-2',
		type : 'Pie',		
		title : 'Overspeed Count', 
		container_cls : 'panel panel-default type-pie col-xs-12 col-sm-6',
		series : ['Overspeed Count'],
		labels : [],
		data : []
	}, {
		chartId : 'report-alert-group-3',
		type : 'Bar',		
		title : 'Geofence Count', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series : ['Geofence Count'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#F69F40",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels : [],
		data : []
	},{
		chartId : 'report-alert-group-4',
		type : 'Line',
		title : 'Emergency Count', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Emergency Count'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#FC787B",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels :[],
		data : []
	} ];

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('report-group-alert-items-change', function(event, items) {		
		for(var i = 0 ; i < items.length ; i++) {
	 		var item = items[i]; chartItem = $scope.items[i];
	 		chartItem.labels = item.labels;

 			if(FmsUtils.isEmptyArray(item.data)) {
 				$scope.setChartEmptyData(chartItem);
 			} else {
 				if(chartItem.type == 'Bar' || chartItem.type == 'Line') {
					chartItem.data[0] = item.data;
				} else {
					chartItem.data = item.data;
				} 
 			}
	 	};
	});

	/**
	 * Chart Empty Data
	 */
	$scope.setChartEmptyData = function(chartItem, chartType) {
		chartItem.labels = ['0'];
		if(chartItem.type == 'Bar' || chartItem.type == 'Line') {
			chartItem.data[0] = [0];
		} else {
			chartItem.data = [0];
		}
	};	

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		itemsChangeListener();
	});

	// --------------------------- E N D ----------------------------
});