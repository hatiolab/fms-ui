angular.module('fmsSettings').directive('driverSearch', function() {
	return { 
		restrict: 'E',
		controller: 'driverSearchCtrl',
		templateUrl: '/assets/settings/views/sidebars/driver-search.html',
		scope: {},
		link : function(scope, element, attr, driverSearchCtrl) {
			// 버튼이 Directive Element 바깥쪽에 있어서 버튼 클릭함수를 이용 ...
			var refreshButton = angular.element('#btnSearchDriver');
			refreshButton.bind("click", function() {
				scope.searchDrivers();
			});
		}
	}; 
})
.controller('driverSearchCtrl', function($rootScope, $scope, $resource, $element, RestApi) {

	/**
	 * Drivers Data Set 
	 */
	$scope.drivers = null;
	/**
	 * Driver List
	 */
	$scope.driverItems = [];
	/**
	 * Smart Table
	 */
	$scope.tablestate = null;

	/**
	 * Smart Table - Call by pagination
	 */
	/*$scope.searchDrivers = function(tablestate) {
		if(tablestate) {
			$scope.tablestate = tablestate;
		}

		var searchParams = {
			"start" : $scope.tablestate.pagination.start,
			"limit" : $scope.tablestate.pagination.number
		};

		RestApi.search('/drivers.json', searchParams, function(dataSet) {
			$scope.drivers = dataSet;
			$scope.driverItems = dataSet.items;
			$scope.tablestate.pagination.totalItemCount = dataSet.total;
			$scope.tablestate.pagination.numberOfPages = dataSet.total_page;
		});
	};*/

	/**
	 * Smart Table - Call by pagination
	 */
	$scope.searchDrivers = function() {
		var searchParams = {
			"start" : 0,
			"limit" : 20
		};

		RestApi.search('/drivers.json', searchParams, function(dataSet) {
			$scope.drivers = dataSet;
			$scope.driverItems = dataSet.items;
			$scope.tablestate.pagination.totalItemCount = dataSet.total;
			$scope.tablestate.pagination.numberOfPages = dataSet.total_page;
		});
	};

});