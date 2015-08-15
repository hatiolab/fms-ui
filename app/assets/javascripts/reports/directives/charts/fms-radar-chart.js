angular.module('fmsReports').directive('fmsRadarChart', function() {
	return { 
		restrict: 'E',
		controller: 'radarChartCtrl',
		templateUrl: '/assets/reports/views/charts/fms-radar-chart.html',
		scope: { title : '@title' }
	}; 
})
.controller('radarChartCtrl', function($rootScope, $scope, $element) {

	/**
	 * Radar Chart Title
	 */
	$scope.title = "Radar Chart";
	/**
	 * Radar Chart Labels
	 */
  $scope.labels = [];
  /**
   * Radar Chart Series
   */
  $scope.series = [];
  /**
   * Radar Chart Data
   */
  $scope.data = [[]];

  /**
   * Series가 하나인 Data Change Listener
   */
  var dataChangeListener = $rootScope.$on('radar-chart-data-change', function(evt, dataSet) {
    if($scope.title == dataSet.title) {
      $scope.labels = dataSet.labels;
      $scope.data = [dataSet.data];
      $scope.series = dataSet.series;
    }
  });

  /**
   * Series가 여럿인 Data List Change Listener
   */
  var dataListChangeListener = $rootScope.$on('radar-chart-data-list-change', function(evt, dataSet) {
    if($scope.title == dataSet.title) {
      $scope.labels = dataSet.labels;
      $scope.data = dataSet.data;
      $scope.series = dataSet.series;
    }
  });

     /**
   * Destroy Scope - RootScope Event Listener 정리 
   */
  $scope.$on('$destroy', function(event) {
    dataChangeListener();
    dataListChangeListener();
  });

  /**
   * Element 제거시에 Scope도 같이 제거 
   */
  $element.on('$destroy', function() {
    $scope.$destroy();
  });

});