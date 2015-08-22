angular.module('fmsHr').directive('hrDrivetimeChart', function() { 
	return { 
		restrict: 'E',
		controller: 'hrDrivetimeCtrl',
		templateUrl: '/assets/hr/views/contents/drivetime.html',
		scope: {}
	}; 
})
.controller('hrDrivetimeCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});