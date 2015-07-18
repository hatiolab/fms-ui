fmsApp.directive('monitorSideAlerts', function() {
	return {
		restrict: 'E',
		controller: 'sideAlertsCtrl',
		templateUrl: '/assets/views/monitor/monitor-side-alerts.html',
		scope: {}
	};
})
.controller('sideAlertsCtrl', function($rootScope, $scope, $resource, $element) {

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

	$scope.findGroups = function(params) {
		var Groups = $resource('/fleet_groups.json', {});
		Groups.get({}, function(groups, response) {
			$scope.groups = {
				items : groups.items,
				total : groups.total,
				// FIXME
				page : 1,
				start : 0,
				limit : 30,
				total_page : 1
			};
		});
	};

	$scope.findAlerts = function(params) {
		var Events = $resource('/events.json', {});
		Events.get({}, function(events, response) {
			$scope.alerts = {
				items : events.items,
				total : events.total,
				// FIXME
				page : 1,
				start : 0,
				limit : 30,
				total_page : 1
			};

			$scope.alertTypeSummaries = {
				geofence : 27,
				impact : 18,
				overspeed : 38,
				emergency : 5
			};

            $scope.gridOptionsForAlerts.data = $scope.alerts;
		});
	};

	$scope.init = function() {
		$scope.findGroups({});
		$scope.findAlerts({});
	};

	$scope.init();
});
