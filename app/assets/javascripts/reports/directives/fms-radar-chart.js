angular.module('fmsReports').directive('fmsRadarChart', function() {
	return { 
		restrict: 'E',
		controller: 'radarChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-radar-chart.html',
		scope: {}
	}; 
})
.controller('radarChartCtrl', function($rootScope, $scope, $element) {

  $scope.labels =["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];

  $scope.data = [
    [65, 59, 90, 81, 56, 55, 40],
    [28, 48, 40, 19, 96, 27, 100]
  ];

});