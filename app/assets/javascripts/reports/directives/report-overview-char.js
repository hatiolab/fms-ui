angular.module('fmsReports').directive('reportsOverviewChart', function() { 
	return { 
		restrict: 'E',
		controller: 'reportsOverviewCtrl',
		templateUrl: '/assets/reports/views/contents/overview.html',
		scope: {}
	}; 
})
.controller('reportsOverviewCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});