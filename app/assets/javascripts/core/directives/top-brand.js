angular.module('fmsCore').directive('topBrand', function() { 
  return { 
    restrict: 'E',
    controller: 'topBrandCtrl',
    templateUrl: '/assets/core/views/top-brand.html'
  }; 
})
.controller('topBrandCtrl', function($rootScope, $scope, $element) {
	$rootScope.sidebarSwitch =true;
	$scope.hidSidbar = function(){
		$rootScope.sidebarSwitch = !$rootScope.sidebarSwitch;
		$rootScope.$broadcast('togglebar-change');
	}
});
