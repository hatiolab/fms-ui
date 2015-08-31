angular.module('fmsHr').directive('hrOverspeedChart', function() { 
	return { 
		restrict: 'E',
		controller: 'hrOverspeedCtrl',
		templateUrl: '/assets/hr/views/contents/overspeed.html',
		scope: {}
	}; 
})
.controller('hrOverspeedCtrl', function($rootScope, $scope, $element, FmsUtils) {
	/**
	 * Chart Item
	 * @type {Object}
	 */
	$scope.item = {
		chart_id : 'hr-overspeed-1',
		type : 'Bar',		
		title : 'Over Speed Total Summary', 
		sort_field : 'overspeed',
		colors : [{
			strokeColor: "rgba(151,187,205,0.5)",
			fillColor: "#80D1FA",
			highlightFill: "rgba(151,187,205,0.75)",
			highlightStroke: "rgba(220,220,220,1)"			
		}],
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['Over Speed Count'],
		labels : [],
		data : [[]]
	};

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('hr-overspeed-item-change', function(event, item) {
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