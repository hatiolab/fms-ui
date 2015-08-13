angular.module('fmsReports').directive('fmsPieChart', function() {
	return { 
		restrict: 'E',
		controller: 'pieChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-pie-chart.html',
		scope: { title : '@title' }
	}; 
})
.controller('pieChartCtrl', function($rootScope, $scope, $element) {

  $scope.title = "Pie Chart";
  $scope.labels = ["Group-A", "Group-B", "Group-C", "Group-D", "Group-E", "Group-F"];
  $scope.data = [85, 76, 55, 91, 76, 55];

  /*$scope.options = {
    showTooltips: true,
    tooltipEvents: [],
    tooltipTemplate: "<%= value %>",
    onAnimationComplete: function() {
      this.showTooltip(this.segments, true);
    }
  };*/

  $rootScope.$on('pie-chart-data-change', function(evt, dataSet) {
    if($scope.title == dataSet.title) {
      $scope.labels = dataSet.labels;
      $scope.data = dataSet.data;
    }
  });

});