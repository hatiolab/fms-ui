angular.module('fmsCore').directive('topProfile', function() { 
	return { 
		restrict: 'E',
		replace: true,
		transclude: true,
		templateUrl: '/assets/core/views/top-profile.html',
		scope: { username : '@username' }
	}; 
});
