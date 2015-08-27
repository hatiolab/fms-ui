angular.module('fmsCore').directive('topProfile', function() { 
	return { 
		restrict: 'E',
		replace: true,
		controller: 'topProfileCtrl',
		templateUrl: '/assets/core/views/top-profile.html',
		scope: { username : '@username' }
	}; 
})
.controller('topProfileCtrl', function($rootScope, $scope, $element, $window, $cookies) {
	$scope.changeLocale = function(locale) {
		$cookies.put('locale', locale);
		$window.location.reload();
	};
});
