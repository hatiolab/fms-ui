angular.module('fmsHr').directive('hrOverspeedChart', function() { 
	return { 
		restrict: 'E',
		controller: 'hrOverspeedCtrl',
		templateUrl: '/assets/hr/views/contents/overspeed.html',
		scope: {}
	}; 
})
.controller('hrOverspeedCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});