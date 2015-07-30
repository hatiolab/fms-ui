angular.module('fmsSettings').directive('preferenceList', function() { 
	return { 
		restrict: 'E',
		templateUrl: '/assets/settings/views/sidebars/preferences.html',
		scope: {}
	}; 
})
.controller('preferenceListCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

});