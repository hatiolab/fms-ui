angular.module('fmsReports').directive('fmsStackedbarChart', function() {
	return { 
		restrict: 'E',
		controller: 'stackedbarChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-stackedbar-chart.html'
	}; 
})
.controller('stackedbarChartCtrl', function($rootScope, $scope, $element) {

  $scope.title = "Stacked Bar Chart";
  $scope.labels = ['Group-A', 'Group-B', 'Group-C', 'Group-D'];
  $scope.series = ['Impact', 'Geofence', 'Overspeed'];
  $scope.type = 'StackedBar';
  $scope.data = [
    [65, 59, 90, 81],
    [28, 48, 40, 19],
    [35, 78, 13, 59]
  ];

});