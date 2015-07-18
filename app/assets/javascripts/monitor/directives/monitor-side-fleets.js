angular.module('fmsMonitor').directive('monitorSideFleets', function() {
	return {
		restrict: 'E',
		controller: 'sideFleetsCtrl',
		templateUrl: '/assets/monitor/views/sidebar/monitor-side-fleets.html',
		scope: {},
		link : function($rootScope, $scope, $element, sideFleetsCtrl) {
			/*var refreshButton = angular.element('.panel-refresh');
			refreshButton.bind("click", function() {
				sideFleetsCtrl.searchFleets({});
      });*/
		}
	};
})

.controller('sideFleetsCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

  this.searchGroups = function(params) {
		RestApi.list('/fleet_groups.json', params, function(dataSet) {
			$scope.groups = dataSet;
		});
  };

	$scope.findGroups = this.searchGroups;

	this.searchFleets = function(params) {
		RestApi.search('/fleets.json', params, function(dataSet) {
			$scope.fleets = dataSet;
			$scope.fleetItems = dataSet.items;
			$scope.speedRangeSummaries = {
				speed_off : 1,
				speed_idle : 3,
				speed_slow : 2,
				speed_normal : 4,
				speed_high : 3,
				speed_over : 1
			};
		});
	};

	$scope.findFleets = this.searchFleets;

	$scope.init = function() {
		$scope.findGroups({});
		$scope.findFleets({});
	};

	$scope.init();
});
