fmsApp.directive('monitorInfo', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorInfoCtrl',
		templateUrl: '/assets/views/monitor/monitor-info.html',
		scope: {}
	}; 
})
.controller('monitorInfoCtrl', function($rootScope, $scope, $resource, $element) {

});