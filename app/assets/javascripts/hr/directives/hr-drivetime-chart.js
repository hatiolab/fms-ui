angular.module('fmsHr').directive('hrDrivetimeChart', function() { 
	return { 
		restrict: 'E',
		controller: 'hrDrivetimeCtrl',
		templateUrl: '/assets/hr/views/contents/drivetime.html',
		scope: {}
	}; 
})
.controller('hrDrivetimeCtrl', function($rootScope, $scope, $element, FmsUtils) {
	/**
	 * Chart Item
	 * @type {Object}
	 */
	$scope.item = {
		chart_id : 'hr-drive-time-1',
		type : 'Bar',		
		title : 'Working Time By Driver', 
		sort_field : 'drive_time',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#4EBCAD",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Drive Time (min.)'],
		labels : [],
		data : [[]]
	};

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('hr-drivetime-item-change', function(event, item) {
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