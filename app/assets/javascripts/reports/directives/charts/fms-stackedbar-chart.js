angular.module('fmsReports').directive('fmsStackedbarChart', function() {
	return { 
		restrict: 'E',
		controller: 'stackedbarChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-stackedbar-chart.html',
    scope: { title : '@title' }
	}; 
})
.controller('stackedbarChartCtrl', function($rootScope, $scope, $element) {

  $scope.title = "Stacked Bar Chart";
  $scope.labels = ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F'];
  $scope.series = ['Impact', 'Overspeed', 'Geofence', 'Emergency'];
  $scope.type = 'StackedBar';
  $scope.data = [
    [65, 59, 90, 81, 38, 56],
    [28, 48, 40, 19, 23, 32],
    [35, 78, 13, 59, 82, 13],
    [33, 12, 56, 73, 32, 35]
  ];

});