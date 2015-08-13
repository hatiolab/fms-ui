angular.module('fmsReports').directive('fmsLineChart', function() {
	return { 
		restrict: 'E',
		controller: 'lineChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-line-chart.html',
		scope: { title : '@title' }
	}; 
})
.controller('lineChartCtrl', function($rootScope, $scope, $element) {
	
  $scope.title = "Line Chart";
  $scope.labels = ["Group-A", "Group-B", "Group-C", "Group-D", "Group-E", "Group-F"];
  $scope.series = ['Driving Distance (km)'];
  $scope.data = [ [0, 0, 0, 0, 0, 0] ];

  /**
   * 값을 Line Point 위에 표시하기 
   * 
   * @type {Object}
   */
  $scope.options = {
    showTooltips: true,
    tooltipTemplate: "<%= value %>",
    tooltipEvents: [],
    onAnimationComplete: function() {
      this.showTooltip(this.datasets[0].points, true);
    }
  };

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };


  $rootScope.$on('line-chart-data-change', function(evt, dataSet) {
    if($scope.title == dataSet.title) {
      $scope.labels = dataSet.labels;
      $scope.data = [dataSet.data];
    }
  });

  $scope.$on('$destroy', function(event) {
    //alert('Scope (' + $scope.$id + ') destroy');
  });

});