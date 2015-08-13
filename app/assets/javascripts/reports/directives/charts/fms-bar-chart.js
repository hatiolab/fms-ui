angular.module('fmsReports').directive('fmsBarChart', function() {
	return { 
		restrict: 'E',
		controller: 'barChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-bar-chart.html',
    scope: { title : '@title' }
	}; 
})
.controller('barChartCtrl', function($rootScope, $scope, $element) {

  $scope.chartId = 'chart-' + $scope.$id;
  $scope.labels = ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F'];
  $scope.series = ['Driving Time (hour)'];
  $scope.data = [[ 11, 23, 27, 19, 14, 9]];

  /**
   * 값을 Bar 위에 표시하기 
   * 
   * @type {Object}
   */
  $scope.options = {
    showTooltips: true,

    tooltipTemplate: "<%= value %>",

    tooltipEvents: [],

    onAnimationComplete: function() {
      this.showTooltip(this.datasets[0].bars, true);
    }
  };

  $rootScope.$on('bar-chart-data-change', function(evt, dataSet) {
    if($scope.title == dataSet.title) {
      $scope.labels = dataSet.labels;
      $scope.data = [dataSet.data];
    }
  });

});