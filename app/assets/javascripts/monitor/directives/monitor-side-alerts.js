angular.module('fmsMonitor').directive('monitorSideAlerts', function() {
	return {
		restrict: 'E',
		controller: 'sideAlertsCtrl',
		templateUrl: '/assets/monitor/views/sidebar/monitor-side-alerts.html',
		scope: {}
	};
})

.controller('sideAlertsCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

  $scope.gridOptionsForAlerts = {
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 25,
      columnDefs: [
          { name: 'vehicle' },
          { name: 'datetime' },
          { name: 'type' },
          { name: 'trip' }
      ]
  };

  this.searchGroups = function(params) {
		RestApi.search('/fleet_groups.json', params, function(dataSet) {
			$scope.groups = dataSet;
			console.log($scope.groups);
		});
  };

	$scope.findGroups = this.searchGroups;

	this.searchAlerts = function(params) {
		RestApi.search('/events.json', params, function(dataSet) {
			$scope.alerts = dataSet;
			$scope.alertTypeSummaries = {
				geofence : 27,
				impact : 18,
				overspeed : 38,
				emergency : 5
			};
			
			$scope.gridOptionsForAlerts.data = $scope.alerts.items;
			console.log($scope.alerts);
		});
	};

	$scope.findAlerts = this.searchAlerts;

	$scope.init = function() {
		$scope.findGroups({});
		$scope.findAlerts({});
	};

	$scope.init();

});