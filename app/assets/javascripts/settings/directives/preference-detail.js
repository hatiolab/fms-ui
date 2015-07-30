angular.module('fmsSettings').directive('preferenceDetail', function() { 
	return { 
		restrict: 'E',
		templateUrl: '/assets/settings/views/contents/preferences.html',
		scope: {}
	}; 
})
.controller('preferenceDetailCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

});