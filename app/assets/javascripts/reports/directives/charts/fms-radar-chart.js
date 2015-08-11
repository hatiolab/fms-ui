angular.module('fmsReports').directive('fmsRadarChart', function() {
	return { 
		restrict: 'E',
		controller: 'radarChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-radar-chart.html',
		scope: { title : '@title' }
	}; 
})
.controller('radarChartCtrl', function($rootScope, $scope, $element) {

	$scope.title = "Radar Chart";
	
  $scope.labels =["Group-A", "Group-B", "Group-C", "Group-D", "Group-E", "Group-F"];

  $scope.series = ['Driving Time (hour)', 'Driving Distance (km)', 'Average Velocity (km/h)'];

  $scope.data = [
    [65, 59, 90, 81, 56, 55],
    [28, 48, 40, 19, 96, 98],
    [39, 84, 72, 23, 45, 88]
  ];

});