angular.module('fmsHr').directive('hrDrivedistanceChart', function() { 
	return { 
		restrict: 'E',
		controller: 'hrDrivedistanceChartCtrl',
		templateUrl: '/assets/hr/views/contents/drivedistance.html',
		scope: {}
	}; 
})
.controller('hrDrivedistanceChartCtrl', function($rootScope, $scope, $element, $filter, FmsUtils) {

	/**
	 * Distance Unit
	 */
	var distunit = $filter('distunit')('');
	/**
	 * Chart Item
	 * @type {Object}
	 */
	$scope.item = {
		chart_id : 'hr-drive-dist-1',
		type : 'Bar',		
		title : 'Driving Distance By Driver (' + distunit + ')', 
		sort_field : 'drive_dist',
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		colors : [ {
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#F69F40",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(151,187,205,1)"			
		} ],
		series : ['Driving Distance (' + distunit + ')'],
		labels : [],
		data : [[]]
	};

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('hr-drivedist-item-change', function(event, item) {
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