angular.module('fmsCore').directive('topProfile', function() { 
	return { 
		restrict : 'E',
		replace : true,
		controller : 'topProfileCtrl',
		templateUrl : '/assets/core/views/top-profile.html',
		scope : { username : '@username' }
	}; 
})
.controller('topProfileCtrl', function($scope, $window, UserPopup) {

	/**
	 * Profile 팝업 
	 */
	$scope.showProfile = function() {
		login.domain_name = currentDomain.name;
		UserPopup.show(login);
	}

});
