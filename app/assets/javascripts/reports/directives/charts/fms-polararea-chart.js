angular.module('fmsReports').directive('fmsPolarareaChart', function() {
	return { 
		restrict: 'E',
		controller: 'fmsPolarAreaChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-polararea-chart.html',
		scope: { title : '@title' }
	}; 
})
.controller('fmsPolarAreaChartCtrl', function($rootScope, $scope, $element) {

 /**
   * Chart Title
   * 
   * @type {String}
   */
  $scope.title = "Polar Area Chart";
  /**
   * Chart Labels
   * 
   * @type {Array}
   */
  $scope.labels = [];
  /**
   * Chart Data
   * 
   * @type {Array}
   */
  $scope.data = [];

  /*$scope.options = {
    showTooltips: true,
    tooltipEvents: [],
    tooltipTemplate: "<%= value %>",
    onAnimationComplete: function() {
      this.showTooltip(this.segments, true);
    }
  };*/
  
  var dataChangeListener = $rootScope.$on('polararea-chart-data-change', function(evt, dataSet) {
    if($scope.title == dataSet.title) {
      $scope.labels = dataSet.labels;
      $scope.data = dataSet.data;
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