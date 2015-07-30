angular.module('fmsSettings').directive('fleetDetail', function() { 
	return { 
		restrict: 'E',
		templateUrl: '/assets/settings/views/contents/fleets.html',
		scope: {}
	}; 
})
.controller('fleetDetailCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

});