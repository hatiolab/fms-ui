angular.module('fmsSettings').directive('groupDetail', function() { 
	return { 
		restrict: 'E',
		templateUrl: '/assets/settings/views/contents/groups.html',
		scope: {}
	}; 
})
.controller('groupDetailCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

});