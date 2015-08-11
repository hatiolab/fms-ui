angular.module('fmsReports').directive('fmsDoughnutChart', function() {
	return { 
		restrict: 'E',
		controller: 'doughnutChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-doughnut-chart.html',
		scope: { title : '@title' }
	}; 
})
.controller('doughnutChartCtrl', function($rootScope, $scope, $element) {

  $scope.title = "Doughnut Chart";
  $scope.labels = ["Group-A", "Group-B", "Group-C", "Group-D", "Group-E", "Group-F"];
  $scope.data = [85, 76, 55, 91, 65, 49];

});