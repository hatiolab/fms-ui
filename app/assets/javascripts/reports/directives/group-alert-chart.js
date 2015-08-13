angular.module('fmsReports').directive('groupAlertChart', function() { 
	return { 
		restrict: 'E',
		controller: 'groupAlertChartCtrl',
		templateUrl: '/assets/reports/views/contents/group-alert.html',
		scope: {}
	}; 
})
.controller('groupAlertChartCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});