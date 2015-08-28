angular.module('fmsReports').directive('groupDriveChart', function() { 
	return { 
		restrict: 'E',
		controller: 'groupDriveChartCtrl',
		templateUrl: '/assets/reports/views/contents/group-drive.html',
		scope: {}
	}; 
})
.controller('groupDriveChartCtrl', function($rootScope, $scope, $element) {

	$scope.items = [ {
		chartId : 'report-driver-group-1',
		type : 'Bar',
		title : 'Driving Time', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series : ['Driving Time (km)'],
		labels :[],
		data : [[]]
	}, {
		chartId : 'report-driver-group-2',
		type : 'Line',		
		title : 'Driving Time', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series : ['Driving Time (min.)'],
		labels : [],
		data : [[]]
	}, {
		chartId : 'report-driver-group-3',
		type : 'Bar',		
		title : 'Driving Distance', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series : ['Driving Distance (km)'],
		labels : [],
		data : [[]]
	},{
		chartId : 'report-driver-group-4',
		type : 'Line',
		title : 'Driving Distance', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Driving Distance (km)'],
		labels :[],
		data : [[]]
	}, {
		chartId : 'report-driver-group-5',
		type : 'Bar',
		title : 'Average Velocity', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series : ['Average Velocity'],
		labels : [],
		data : [[]]
	}, {
		chartId : 'report-driver-group-6',
		type : 'Line',
		title : 'Average Velocity', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Average Velocity'],
		labels :[],
		data : [[]]
	} ];

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('report-group-driver-items-change', function(event, items) {		
		for(var i = 0 ; i < items.length ; i++) {
	 		var item = items[i];
	 		$scope.items[i].labels = item.labels;
	 		$scope.items[i].data[0] = item.data;
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