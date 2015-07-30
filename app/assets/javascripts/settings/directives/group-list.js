angular.module('fmsSettings').directive('groupList', function() { 
	return { 
		restrict: 'E',
		templateUrl: '/assets/settings/views/sidebars/groups.html',
		scope: {}
	}; 
})
.controller('groupListCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

});