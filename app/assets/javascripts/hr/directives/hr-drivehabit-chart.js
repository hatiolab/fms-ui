angular.module('fmsHr').directive('hrDrivehabitChart', function() { 
	return { 
		restrict: 'E',
		controller: 'hrDrivehabitCtrl',
		templateUrl: '/assets/hr/views/contents/drivehabit.html',
		scope: {}
	}; 
})
.controller('hrDrivehabitCtrl', function($rootScope, $scope, $element) {
	/**
	 * Chart Binding
	 * @type {Array}
	 */
	$scope.items = [ {
		chartId : 'hr-drive-habit-1',
		type : 'Bar',		
		title : 'Driving Habit Speed High Summary', 
		container_cls : 'panel panel-default type-line col-xs-12 col-sm-12',
		series : ['High Speed Count'],
		labels : [],
		data : [[]]
	}, {
		chartId : 'hr-drive-habit-2',
		type : 'Bar',
		title : 'Driving Habit Speed Slow Summary', 
		container_cls : 'panel panel-default type-bar col-xs-12 col-sm-12',
		series : ['Slow Speed Count'],
		labels :[],
		data : [[]]
	} ];

	/**
	 * Report Item이 변경되었을 경우
	 */
	var itemsChangeListener = $rootScope.$on('hr-drivehabit-items-change', function(event, items) {		
		for(var i = 0 ; i < items.length ; i++) {
	 		var item = items[i];
	 		$scope.items[i].labels = item.labels;
	 		$scope.items[i].data[0] = item.data;
	 	};
	});

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		itemsChangeListener();
	});
	// --------------------------- E N D ----------------------------
});