angular.module('fmsReports').directive('groupDriveChart', function() { 
	return { 
		restrict: 'E',
		controller: 'groupDriveChartCtrl',
		templateUrl: '/assets/reports/views/contents/group-drive.html',
		scope: {}
	}; 
})
.controller('groupDriveChartCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});