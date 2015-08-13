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
  
  $scope.options = {
    showTooltips: true,
    tooltipEvents: [],
    tooltipTemplate: "<%= value %>",
    onAnimationComplete: function() {
        this.showTooltip(this.segments, true);
    }
  };

  $rootScope.$on('donut-chart-data-change', function(evt, dataSet) {
    if($scope.title == dataSet.title) {
      $scope.labels = dataSet.labels;
      $scope.data = dataSet.data;
    }
  });

});