angular.module('fmsHr').directive('hrOverviewChart', function() { 
	return { 
		restrict: 'E',
		controller: 'hrOverviewCtrl',
		templateUrl: '/assets/hr/views/contents/overview.html',
		scope: {}
	}; 
})
.controller('hrOverviewCtrl', function($rootScope, $scope, $element) {

	$scope.items = [ {
		chartId: 'hr-overview-1',
		type:'Bar',
		title : 'Working Time By Driver', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series:['Driving Time (km)'],
		sort_field :'drive_time',
		labels :[],
		data : [[]]
	}, {
		chartId: 'hr-overview-2',
		type:'Line',
		title : 'Driving Distance By Driver', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Driving Distance (km)'],
		sort_field :'drive_dist',
		labels : [],
		data : [[]]
	}, {
		chartId: 'hr-overview-3',
		type:'Bar',
		title : 'Overspeed Count', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series:['Overspeed Count'],
		sort_field :'overspeed',
		labels : [],
		data : [[]]
	},{
		chartId: 'hr-overview-4',
		type:'Line',
		title : 'Geofence Count', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Impact Count'],
		sort_field :'geofence',
		labels :[],
		data : [[]]
	}, {
		chartId: 'hr-overview-5',
		type:'Bar',
		title : 'Impact Count', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		series:['Geofence Count'],
		sort_field :'impact',
		labels : [],
		data : [[]]
	}, {
		chartId: 'hr-overview-6',
		type:'Line',
		title : 'Emergency Count', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		series:['Emergency Count'],
		sort_field :'emergency',
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