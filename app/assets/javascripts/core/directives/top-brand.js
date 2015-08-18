angular.module('fmsCore').directive('topBrand', function() { 
  return { 
    restrict: 'E',
    controller: 'topBrandCtrl',
    templateUrl: '/assets/core/views/top-brand.html'
  }; 
})
.controller('topBrandCtrl', function($scope, $element) {
	
});
