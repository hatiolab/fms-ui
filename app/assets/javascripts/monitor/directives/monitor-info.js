angular.module('fmsMonitor').directive('monitorInfo', function() { 
	return { 
		restrict: 'E',
		controller: 'monitorInfoCtrl',
		templateUrl: '/assets/monitor/views/infobar/monitor-info.html',
		scope: {}
	}; 
})
.controller('monitorInfoCtrl', function($rootScope, $scope, $resource, $element) {

});