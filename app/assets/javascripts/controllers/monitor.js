fmsApp.controller('MonitorCtrl', function($scope, $resource) {

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
	},

	$scope.findFleets = function(params) {
		var Fleets = $resource('/fleets.json', {});
		Fleets.get({}, function(fleets, response) {
			$scope.fleets = {
				items : fleets.items,
				total : fleets.total,
				// FIXME
				page : 1,
				start : 0,
				limit : 30,
				total_page : 1
			};

			$scope.speedRangeSummaries = {
				speed_off : 0,
				speed_idle : 1,
				speed_slow : 2,
				speed_normal : 3,
				speed_high : 3,
				speed_over : 2
			};
		});
	},

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
		});		
	},

	$scope.findGroups({});

	$scope.findFleets({});

	$scope.findAlerts({});

});