angular.module('fmsReports').directive('groupDriveChart', function() { 
	return { 
		restrict: 'E',
		controller: 'groupDriveChartCtrl',
		templateUrl: '/assets/reports/views/contents/group-drive.html',
		scope: {}
	}; 
})
.controller('groupDriveChartCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {
	$scope.items = [ {
		chartId: 'report-overview-1',
		title : 'Driving Time', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		type:'Bar',
		labels :[],
		sort_field :'drive_time',
		data : [[]],
		series:['Driving Time (km)']
	}, {
		chartId: 'report-overview-2',
		title : 'Driving Time', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		type:'Line',
		labels : [],
		sort_field :'drive_time',
		data : [[]],
		series:['Driving Time (min.)']
	}, {
		chartId: 'report-overview-3',
		title : 'Driving Distance', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		type:'Bar',
		labels : [],
		sort_field :'drive_dist',
		data : [[]],
		series:['Driving Distance (km)']
	},{
		chartId: 'report-overview-4',
		title : 'Driving Distance', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		type:'Line',
		labels :[],
		sort_field :'drive_dist',
		data : [[]],
		series:['Driving Distance (km)']
	}, {
		chartId: 'report-overview-5',
		title : 'Average Velocity', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		type:'Line',
		labels : [],
		sort_field :'velocity',
		data : [[]],
		series:['Average Velocity']
	}, {
		chartId: 'report-overview-6',
		title : 'Average Velocity', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		type:'Bar',
		labels :[],
		sort_field :'velocity',
		data : [[]],
		series:['Average Velocity']
	} ];

	var itemsChangeListener = $rootScope.$on('report-drive-items-change', function(event, items) {
		for(var i = 0 ; i < items.length ; i++) {
	 		var item = items[i];
	 		$scope.items[i].labels = item.labels;
	 		$scope.items[i].data=item.data;
	 	};
	 	console.log($scope.items);
	});

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		itemsChangeListener();
	});
	// --------------------------- E N D ----------------------------
});