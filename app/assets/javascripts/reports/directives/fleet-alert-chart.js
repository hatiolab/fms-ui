angular.module('fmsReports').directive('fleetAlertChart', function() { 
	return { 
		restrict: 'E',
		controller: 'fleetAlertChartCtrl',
		templateUrl: '/assets/reports/views/contents/fleet-alert.html',
		scope: {}
	}; 
})
.controller('fleetAlertChartCtrl', function($rootScope, $scope, $element, FmsUtils) {

	/**
	 * Chart Item
	 * @type {Object}
	 */
	$scope.item = {
		chart_id : 'report-fleet-alert-1',
		type : 'Bar',		
		title : 'Impact Count', 
		sort_field : 'impact',
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Impact Count'],
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#84C867",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		labels : [],
		data : [[]]
	};

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('report-fleet-alert-item-change', function(event, item) {
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