angular.module('fmsReports').directive('groupChart', function() { 
	return { 
		restrict: 'E',
		controller: 'groupChartCtrl',
		templateUrl: '/assets/reports/views/contents/groups.html',
		scope: {}
	}; 
})
.controller('groupChartCtrl', function($rootScope, $scope, $resource, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});