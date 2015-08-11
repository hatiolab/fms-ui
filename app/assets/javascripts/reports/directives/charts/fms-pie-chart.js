angular.module('fmsReports').directive('fmsPieChart', function() {
	return { 
		restrict: 'E',
		controller: 'pieChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-pie-chart.html',
		scope: {}
	}; 
})
.controller('pieChartCtrl', function($rootScope, $scope, $element) {

  $scope.title = "Pie Chart";
  $scope.labels = ["Group-A", "Group-B", "Group-C", "Group-D"];
  $scope.data = [85, 76, 55, 91];
  $scope.options = {
    showTooltips: true,
    tooltipEvents: [],
    tooltipTemplate: "<%= value %>",
    onAnimationComplete: function() {
        this.showTooltip(this.segments, true);
    }
  };

});