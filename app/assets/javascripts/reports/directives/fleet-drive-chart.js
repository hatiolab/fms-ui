angular.module('fmsReports').directive('fleetDriveChart', function() { 
	return { 
		restrict: 'E',
		controller: 'fleetDriveChartCtrl',
		templateUrl: '/assets/reports/views/contents/fleet-drive.html',
		scope: {}
	}; 
})
.controller('fleetDriveChartCtrl', function($rootScope, $scope, $element, FmsUtils) {

	/**
	 * Chart Item
	 * @type {Object}
	 */
	$scope.item = {
		chartId : 'report-fleet-drive-1',
		type : 'Line',		
		title : 'Driving Time', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Driving Time (min.)'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#F69F40",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels : [],
		data : [[]]
	};

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('report-fleet-driver-item-change', function(event, item) {
	 	if(FmsUtils.isEmptyArray(item.data)) {
	 		$scope.item.labels = ['0'];
	 		$scope.item.data[0] = [0];
	 	} else {
	 		$scope.item = item;
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