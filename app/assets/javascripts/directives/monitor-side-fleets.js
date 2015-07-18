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

.controller('sideFleetsCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

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

  this.searchGroups = function(params) {
		RestApi.search('/fleet_groups.json', params, function(dataSet) {
			$scope.groups = dataSet;
			console.log($scope.groups);
		});
  };

	$scope.findGroups = this.searchGroups;

	this.searchFleets = function(params) {
		RestApi.search('/fleets.json', params, function(dataSet) {
			$scope.fleets = dataSet;
			$scope.gridOptionsForFleets.data = $scope.fleets.items;
			console.log($scope.fleets);
		});
	};

	$scope.findFleets = this.searchFleets;

	$scope.init = function() {
		$scope.findGroups({});
		$scope.findFleets({});
	};

	$scope.init();
});
