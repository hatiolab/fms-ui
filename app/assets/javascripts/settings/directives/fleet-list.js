angular.module('fmsSettings').directive('fleetList', function() { 
	return { 
		restrict: 'E',
		templateUrl: '/assets/settings/views/sidebars/fleets.html',
		scope: {}
	}; 
})
.controller('fleetListCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

});