angular.module('fmsReports').directive('fleetDriveChart', function() { 
	return { 
		restrict: 'E',
		controller: 'fleetDriveChartCtrl',
		templateUrl: '/assets/reports/views/contents/fleet-drive.html',
		scope: {}
	}; 
})
.controller('fleetDriveChartCtrl', function($rootScope, $scope, $element) {

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
		labels : [],
		data : [[]]
	};

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('report-fleet-driver-item-change', function(event, item) {
	 	$scope.item = item;
	});

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		itemsChangeListener();
	});	

	// --------------------------- E N D ----------------------------
});