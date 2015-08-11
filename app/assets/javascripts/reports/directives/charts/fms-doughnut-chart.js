angular.module('fmsReports').directive('fmsDoughnutChart', function() {
	return { 
		restrict: 'E',
		controller: 'doughnutChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-doughnut-chart.html',
		scope: {}
	}; 
})
.controller('doughnutChartCtrl', function($rootScope, $scope, $element) {

  $scope.title = "Doughnut Chart";
  $scope.labels = ["Group-A", "Group-B", "Group-C", "Group-D"];
  $scope.data = [85, 76, 55, 91];

});