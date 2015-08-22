angular.module('fmsHr').directive('hrDrivedistanceChart', function() { 
	return { 
		restrict: 'E',
		controller: 'hrDrivedistanceChartCtrl',
		templateUrl: '/assets/hr/views/contents/drivedistance.html',
		scope: {}
	}; 
})
.controller('hrDrivedistanceChartCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});