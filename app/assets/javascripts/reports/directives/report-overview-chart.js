angular.module('fmsReports').directive('reportsOverviewChart', function() { 
	return { 
		restrict: 'E',
		controller: 'reportsOverviewCtrl',
		templateUrl: '/assets/reports/views/contents/overview.html',
		scope: {}
	}; 
})
.controller('reportsOverviewCtrl', function($rootScope, $scope, $element, $filter) {
	/**
	 * Distance & Time Unit
	 */
	var distunit = $filter('distunit')('');
	var timeunit = $filter('timeunit')('');

	$scope.items = [ {
		chartId: 'report-overview-1',
		title : 'Driving Time By Fleet (' + timeunit + ')', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		type : 'Bar',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#80D1FA",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(220,220,220,1)"			
		} ],
		series:['Driving Time (' + timeunit + ')'],
		data : [[]],
		labels :[]
	}, {
		chartId: 'report-overview-2',
		title : 'Driving Distance By Fleet (' + distunit + ')',
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		type : 'Line',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#4EBCAD",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],		
		series:['Driving Distance (' + distunit + ')'],
		labels : [],
		data : [[]]
	}, {
		chartId: 'report-overview-3',
		title : 'Overspeed Count', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		type : 'Bar',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#84C867",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],		
		series:['Overspeed Count'],
		labels : [],
		data : [[]],
	},{
		chartId: 'report-overview-4',
		title : 'Impact Count', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		type : 'Line',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#FC787B",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],		
		series:['Impact Count'],
		labels :[],
		data : [[]],
	}, {
		chartId: 'report-overview-5',
		title : 'Geofence Count', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-6',
		type : 'Bar',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#FFD600",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],		
		series:['Geofence Count'],
		labels : [],
		data : [[]],
	}, {
		chartId: 'report-overview-6',
		title : 'Emergency Count', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-6',
		type : 'Line',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#F69F40",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],		
		series:['Emergency Count'],
		labels : [],		
		data : [[]],
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