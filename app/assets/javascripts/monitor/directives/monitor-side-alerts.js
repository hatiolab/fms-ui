angular.module('fmsMonitor').directive('monitorSideAlerts', function() {
	return {
		restrict: 'E',
		controller: 'sideAlertsCtrl',
		templateUrl: '/assets/monitor/views/sidebar/monitor-side-alerts.html',
		scope: {}
	};
})

.controller('sideAlertsCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

  this.searchGroups = function(params) {
		RestApi.list('/fleet_groups.json', params, function(dataSet) {
			$scope.groups = dataSet;
		});
  };

	$scope.findGroups = this.searchGroups;

	this.searchAlerts = function(params) {
		RestApi.search('/events.json', params, function(dataSet) {
			$scope.alerts = dataSet;
			$scope.alertItems = dataSet.items;
			$scope.alertTypeSummaries = {
				geofence : 27,
				impact : 18,
				overspeed : 38,
				emergency : 5
			};
		});
	};

	$scope.findAlerts = this.searchAlerts;

	$scope.init = function() {
		$scope.findGroups({});
		$scope.findAlerts({});
	};

	$scope.init();

});