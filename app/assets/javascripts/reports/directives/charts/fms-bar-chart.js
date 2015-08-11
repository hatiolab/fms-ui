angular.module('fmsReports').directive('fmsBarChart', function() {
	return { 
		restrict: 'E',
		controller: 'barChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-bar-chart.html'
	}; 
})
.controller('barChartCtrl', function($rootScope, $scope, $element) {

  $scope.title = "Bar Chart";
  $scope.labels = ['Group-A', 'Group-B', 'Group-C'];
  $scope.series = ['Driving Time (hour)'];
  $scope.data = [ [ 1256, 2341, 4597] ];

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

  /*$scope.options =  {

    // Sets the chart to be responsive
    responsive: true,

    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero : true,

    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - If there is a stroke on each bar
    barShowStroke : true,

    //Number - Pixel width of the bar stroke
    barStrokeWidth : 2,

    //Number - Spacing between each of the X value sets
    barValueSpacing : 5,

    //Number - Spacing between data sets within X values
    barDatasetSpacing : 1,

    //String - A legend template
    legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
  };*/

});