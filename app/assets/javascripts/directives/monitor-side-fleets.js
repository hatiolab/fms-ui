fmsApp.directive('monitorSideFleets', function() {
	return {
		restrict: 'E',
		controller: 'sideFleetsCtrl',
		templateUrl: '/assets/views/monitor/monitor-side-fleets.html',
		scope: {},
		link : function($rootScope, $scope, $element) {
			var refreshButton = angular.element('.panel-refresh');
			refreshButton.bind("click", function() {
				alert('refresh clicked');
      });
		}
	};
})
.controller('sideFleetsCtrl', function($rootScope, $scope, $resource, $element) {

    $scope.gridOptionsForFleets = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        columnDefs: [
            { name: 'driver' },
            { name: 'vehicle' },
            { name: 'speed' },
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

			console.log($scope.groups);
		});
	};

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

            $scope.gridOptionsForFleets.data = $scope.fleets.items;
		});
	};

	/*console.log('Side Fleets Element');
	console.log($element);

	$scope.$on('searchFleetEvent', function(e) {
		alert('Monitor Side Fleets Directive Received SearchFleetEvent');
		$scope.findFleets({});
	});*/

	$scope.init = function() {
		$scope.findGroups({});
		$scope.findFleets({});
	};

	$scope.init();
});
