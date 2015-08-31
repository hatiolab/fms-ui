angular.module('fmsCore').directive('topBrand', function() { 
  return { 
    restrict: 'E',
    controller: 'topBrandCtrl',
    templateUrl: '/assets/core/views/top-brand.html'
  }; 
})
.controller('topBrandCtrl', function($rootScope, $scope) {
	
	/**
	 * Sidebar 토글 변수  
	 * @type {Boolean}
	 */
	$rootScope.sidebarSwitch = true;

	/**
	 * Sidebar Toggle Show / Hide
	 */
	$scope.toggleSidebar = function(){
		$rootScope.sidebarSwitch = !$rootScope.sidebarSwitch;
		$rootScope.$broadcast('togglebar-change');
	}
});
