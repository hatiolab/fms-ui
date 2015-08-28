angular.module('fmsReports').directive('reportsOverviewChart', function() { 
	return { 
		restrict: 'E',
		controller: 'reportsOverviewCtrl',
		templateUrl: '/assets/reports/views/contents/overview.html',
		scope: {}
	}; 
})
.controller('reportsOverviewCtrl', function($rootScope, $scope, $element) {

	$scope.items = [ {
		chartId: 'report-overview-1',
		title : 'Driving Time By Fleet', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		type:'Bar',
		labels :[],
		sort_field :'drive_time',
		data : [[]],
		series:['Driving Time (km)']
	}, {
		chartId: 'report-overview-2',
		title : 'Driving Distance By Fleet', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		type:'Line',
		labels : [],
		sort_field :'drive_dist',
		data : [[]],
		series:['Driving Distance (km)']
	}, {
		chartId: 'report-overview-3',
		title : 'Overspeed Count', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		type:'Bar',
		labels : [],
		sort_field :'overspeed',
		data : [[]],
		series:['Overspeed Count']
	},{
		chartId: 'report-overview-4',
		title : 'Impact Count', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		type:'Line',
		labels :[],
		sort_field :'impact',
		data : [[]],
		series:['Impact Count']
	}, {
		chartId: 'report-overview-5',
		title : 'Geofence Count', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		type:'Bar',
		labels : [],
		sort_field :'emergency',
		data : [[]],
		series:['Geofence Count']
	}, {
		chartId: 'report-overview-6',
		title : 'Emergency Count', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		type:'Line',
		labels :[],
		sort_field :'geofence',
		data : [[]],
		series:['Emergency Count']
	} ];

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('report-overview-item-change', function(event, item) {		
		var selectedItem = $scope.items.filter(function(element, index, array) {
			return element.chartId == item.chartId;
		});

		if(selectedItem && selectedItem.length > 0) {
			selectedItem[0].labels = item.labels;
			selectedItem[0].data = item.data;
		}
	});

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		itemsChangeListener();
	});		
	// --------------------------- E N D ----------------------------
});