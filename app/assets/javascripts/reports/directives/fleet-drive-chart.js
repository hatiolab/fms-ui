angular.module('fmsReports').directive('fleetDriveChart', function() { 
	return { 
		restrict: 'E',
		controller: 'fleetDriveChartCtrl',
		templateUrl: '/assets/reports/views/contents/fleet-drive.html',
		scope: {}
	}; 
})
.controller('fleetDriveChartCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});