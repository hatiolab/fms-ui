angular.module('fmsReports').directive('fleetChart', function() { 
	return { 
		restrict: 'E',
		controller: 'fleetChartCtrl',
		templateUrl: '/assets/reports/views/contents/fleets.html',
		scope: {}
	}; 
})
.controller('fleetChartCtrl', function($rootScope, $scope, $resource, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});