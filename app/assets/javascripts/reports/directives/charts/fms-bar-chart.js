angular.module('fmsReports').directive('fmsBarChart', function() {
	return { 
		restrict: 'E',
		controller: 'barChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-bar-chart.html'
	}; 
})
.controller('barChartCtrl', function($rootScope, $scope, $element) {

  $scope.title = "Bar Chart";
  $scope.labels = ['Group-A', 'Group-B', 'Group-C', 'Group-D', 'Group-E', 'Group-F'];
  $scope.series = ['Driving Time (hour)'];
  $scope.data = [ [ 1256, 2341, 4597, 2342, 3420, 7623] ];

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

});