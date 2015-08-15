angular.module('fmsHr').directive('hrDrivehabitChart', function() { 
	return { 
		restrict: 'E',
		controller: 'hrDrivehabitCtrl',
		templateUrl: '/assets/hr/views/contents/drivehabit.html',
		scope: {}
	}; 
})
.controller('hrDrivehabitCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {

	// --------------------------- E N D ----------------------------
});