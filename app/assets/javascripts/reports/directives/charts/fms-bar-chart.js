angular.module('fmsReports').directive('fmsBarChart', function() {
	return { 
		restrict: 'E',
		controller: 'barChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-bar-chart.html',
    scope: { title : '@title' }
	}; 
})
.controller('barChartCtrl', function($rootScope, $scope, $element) {

  /**
   * Chart Title
   * 
   * @type {String}
   */
  $scope.title = "Bar Chart";
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
   * 값을 Bar 위에 표시하기 
   * 
   * @type {Object}
   */
  /*$scope.options = {
    showTooltips: true,

    tooltipTemplate: "<%= value %>",

    tooltipEvents: [],

    onAnimationComplete: function() {
      this.showTooltip(this.datasets[0].bars, true);
    }
  };*/

  var dataChangeListener = $rootScope.$on('bar-chart-data-change', function(evt, dataSet) {
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