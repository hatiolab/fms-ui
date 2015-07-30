angular.module('fmsSettings').directive('driverDetail', function() { 
	return { 
		restrict: 'E',
		templateUrl: '/assets/settings/views/contents/driver-detail.html',
		scope: {}
	}; 
})
.controller('driverDetailCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

});