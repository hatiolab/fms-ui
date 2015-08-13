angular.module('fmsReports').directive('fleetAlertChart', function() { 
	return { 
		restrict: 'E',
		controller: 'fleetAlertChartCtrl',
		templateUrl: '/assets/reports/views/contents/fleet-alert.html',
		scope: {}
	}; 
})
.controller('fleetAlertChartCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});