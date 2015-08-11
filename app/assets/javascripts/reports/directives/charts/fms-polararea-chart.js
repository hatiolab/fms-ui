angular.module('fmsReports').directive('fmsPolarareaChart', function() {
	return { 
		restrict: 'E',
		controller: 'fmsPolarAreaChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-polararea-chart.html',
		scope: { title : '@title' }
	}; 
})
.controller('fmsPolarAreaChartCtrl', function($rootScope, $scope, $element) {

  $scope.title = "Polar Area Chart";
  $scope.labels = ["Group-A", "Group-B", "Group-C", "Group-D", "Group-E", "Group-F"];
  $scope.data = [2814, 4823, 4230, 1679, 2832,1837];

});