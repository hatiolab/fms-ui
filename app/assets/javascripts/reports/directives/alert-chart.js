angular.module('fmsReports').directive('alertChart', function() { 
	return { 
		restrict: 'E',
		controller: 'alertChartCtrl',
		templateUrl: '/assets/reports/views/contents/alerts.html',
		scope: {}
	}; 
})
.controller('alertChartCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});