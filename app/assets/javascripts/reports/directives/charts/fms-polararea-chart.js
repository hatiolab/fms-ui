angular.module('fmsReports').directive('fmsPolarareaChart', function() {
	return { 
		restrict: 'E',
		controller: 'fmsPolarAreaChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-polararea-chart.html',
		scope: {}
	}; 
})
.controller('fmsPolarAreaChartCtrl', function($rootScope, $scope, $element) {

  $scope.title = "Polar Area Chart";
  $scope.labels = ["Group-A", "Group-B", "Group-C", "Group-D"];
  $scope.data = [2814, 4823, 4230, 1679];

});