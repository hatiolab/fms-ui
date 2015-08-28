angular.module('fmsReports').directive('groupAlertChart', function() { 
	return { 
		restrict: 'E',
		controller: 'groupAlertChartCtrl',
		templateUrl: '/assets/reports/views/contents/group-alert.html',
		scope: {}
	}; 
})
.controller('groupAlertChartCtrl', function($rootScope, $scope, $element) {

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
		labels : [],
		data : []
	},{
		chartId : 'report-alert-group-4',
		type : 'Line',
		title : 'Emergency Count', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Emergency Count'],
		labels :[],
		data : []
	} ];

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('report-group-alert-items-change', function(event, items) {		
		for(var i = 0 ; i < items.length ; i++) {
	 		var item = items[i];
	 		var chartItem = $scope.items[i];
	 		chartItem.labels = item.labels;

	 		if(chartItem.type == 'Bar' || chartItem.type == 'Line') {
	 			chartItem.data[0] = item.data;	
	 		} else {
	 			chartItem.data = item.data;
	 		}
	 	};
	});

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		itemsChangeListener();
	});

	// --------------------------- E N D ----------------------------
});