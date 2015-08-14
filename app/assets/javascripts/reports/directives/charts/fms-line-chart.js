angular.module('fmsReports').directive('fmsLineChart', function() {
	return { 
		restrict: 'E',
		controller: 'lineChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-line-chart.html',
		scope: { title : '@title' }
	}; 
})
.controller('lineChartCtrl', function($rootScope, $scope, $element) {
	
  /**
   * Chart Title
   * 
   * @type {String}
   */
  $scope.title = "Line Chart";
  /**
   * Chart Labels
   * 
   * @type {Array}
   */
  $scope.labels = [];
  /**
   * Chart Series
   * 
   * @type {Array}
   */
  $scope.series = [];
  /**
   * Chart Data
   * 
   * @type {Array}
   */
  $scope.data = [ [] ];

  /**
   * 값을 Line Point 위에 표시하기 
   * 
   * @type {Object}
   */
  /*$scope.options = {
    showTooltips: true,
    tooltipTemplate: "<%= value %>",
    tooltipEvents: [],
    onAnimationComplete: function() {
      this.showTooltip(this.datasets[0].points, true);
    }
  };*/

  $scope.onClick = function (points, evt) {
    //console.log(points, evt);
  };

  /**
   * Data Change Listener
   */
  var dataChangeListener = $rootScope.$on('line-chart-data-change', function(evt, dataSet) {
    if($scope.title == dataSet.title) {
      $scope.labels = dataSet.labels;
      $scope.data = [dataSet.data];
      $scope.series = dataSet.series;
    }
  });

  /**
   * Destroy Scope - RootScope Event Listener 정리 
   */
  $scope.$on('$destroy', function(event) {
    dataChangeListener();
  });

  /**
   * Element 제거시에 Scope도 같이 제거 
   */
  $element.on('$destroy', function() {
    $scope.$destroy();
  });  

});