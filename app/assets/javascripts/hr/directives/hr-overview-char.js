angular.module('fmsHr').directive('hrOverviewChart', function() { 
	return { 
		restrict: 'E',
		controller: 'hrOverviewCtrl',
		templateUrl: '/assets/hr/views/contents/overview.html',
		scope: {}
	}; 
})
.controller('hrOverviewCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});