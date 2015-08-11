angular.module('fmsReports').directive('fmsLineChart', function() {
	return { 
		restrict: 'E',
		controller: 'lineChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-line-chart.html',
		scope: {}
	}; 
})
.controller('lineChartCtrl', function($rootScope, $scope, $element) {
	
  $scope.title = "Line Chart";
  $scope.labels = ["Group-A", "Group-B", "Group-C", "Group-D"];
  $scope.series = ['Driving Distance (km)'];
  $scope.data = [ [2814, 4823, 4230, 1679] ];

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

});