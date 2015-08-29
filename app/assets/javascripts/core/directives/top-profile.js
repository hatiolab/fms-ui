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
		login.locale = locale;
		$cookies.put('locale', locale);
		$window.location.reload();
	};

	// $scope.modeChange = function(locale) {
	// 	if(!$scope.multilangueMode){
	// 		$rootScope.$broadcast('start-multilangue-setting-mode');
	// 	}else{
	// 		$rootScope.$broadcast('end-multilangue-setting-mode');
	// 	}
	// };
});
