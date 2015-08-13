angular.module('fmsReports').directive('fmsLineChart', function() {
	return { 
		restrict: 'E',
		controller: 'lineChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-line-chart.html',
		scope: { title : '@title' }
	}; 
})
.controller('lineChartCtrl', function($rootScope, $scope, $element) {
	
  $scope.title = "Line Chart";
  $scope.labels = ["Group-A", "Group-B", "Group-C", "Group-D", "Group-E", "Group-F"];
  $scope.series = ['Driving Distance (km)'];
  $scope.data = [ [2814, 4823, 4230, 1679, 2311, 1987] ];

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };


  $rootScope.$on('line-chart-data-change', function(evt, dataSet) {
    if($scope.title == dataSet.title) {
      $scope.labels = dataSet.labels;
      $scope.data = [dataSet.data];
    }
  });

});