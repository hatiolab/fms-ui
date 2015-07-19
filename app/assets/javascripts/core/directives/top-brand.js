angular.module('fmsCore').directive('topBrand', function() { 
  return { 
    restrict: 'E',
    controller: 'CoreCtrl',
    templateUrl: '/assets/core/views/top-brand.html'
  }; 
});
