angular.module('fmsMonitor').directive('monitorSideFleets', function() {
	return {
		restrict: 'E',
		controller: 'sideFleetsCtrl',
		templateUrl: '/assets/monitor/views/sidebar/monitor-side-fleets.html',
		scope: {},
		link : function(scope, element, attr, sideFleetsCtrl) {
			// 버튼이 Directive Element 바깥쪽에 있어서 버튼 클릭함수를 이용 ...
			var refreshButton = angular.element('.panel-refresh');
			refreshButton.bind("click", function() {
				var fleetTab = angular.element('#fleetTab');
				// side-fleets 탭이 액티브 된 경우만 호출하도록 변경 ...
				if(fleetTab.hasClass('active')) {
					//sideFleetsCtrl.searchFleets(null);
					scope.fleetSearchParams(null);
				}
      });
		}
	};
})

.controller('sideFleetsCtrl', function($rootScope, $scope, $resource, $element, ConstantSpeed, FmsUtils, RestApi) {

	/**
	 * 폼 모델 초기화 
	 */
	$scope.fleetSearchParams = {};

	/**
	 * Rails Server의 스펙에 맞도록 파라미터 변경 ...
	 * TODO 폼 필드명을 직접 변경 ...
	 */
	this.convertSearchParams = function(params) {
		var searchParams = {};

		if(!params) {
			return searchParams;
		}

		if(params.fleet_group_id) {
			searchParams["_q[fleet_group_id-eq]"] = params.fleet_group_id;
		}

		// TODO Speed값 파라미터 변경 ...
		
		searchParams['_o[name]'] = 'asc';
		return searchParams;
	};

	$scope.normalizeSearchParams = this.convertSearchParams;

	/**
	 * Search Fleet Groups
	 */
  this.searchGroups = function(params) {
		RestApi.list('/fleet_groups.json', params, function(dataSet) {
			$scope.groups = dataSet;
		});
  };

	$scope.findGroups = this.searchGroups;

	/**
	 * Search Fleets
	 */
	this.searchFleets = function(params) {
		var searchParams = params;
		if(!params || params == {}) {
			searchParams = angular.copy($scope.fleetSearchParams);
			searchParams.fleet_group_id = searchParams.group ? searchParams.group.id : '';
		}

		searchParams = $scope.normalizeSearchParams(searchParams);
		RestApi.search('/fleets.json', searchParams, function(dataSet) {
			$scope.fleets = dataSet;
			$scope.fleetItems = dataSet.items;
			FmsUtils.setSpeedClasses($scope.fleetItems);
			$scope.speedRangeSummaries = FmsUtils.getSpeedSummaries($scope.fleetItems);
			$scope.$emit('monitor-fleet-list-change', $scope.fleets);
		});
	};

	$scope.findFleets = this.searchFleets;

	/**
	 * smart table object
	 */
	$scope.tablestate = null;
	/**
	 * call by pagination
	 */
	$scope.pageFleets = function(tablestate) {
		if(tablestate) {
			$scope.tablestate = tablestate;
			if($scope.tablestate.pagination.number < 20) {
				$scope.tablestate.pagination.number = 20;
			}
		}

		var searchParams = angular.copy($scope.fleetSearchParams);
		searchParams.fleet_group_id = searchParams.group ? searchParams.group.id : '';
		searchParams = $scope.normalizeSearchParams(searchParams);
		searchParams.start = $scope.tablestate.pagination.start;
		searchParams.limit = $scope.tablestate.pagination.number;

		RestApi.search('/fleets.json', searchParams, function(dataSet) {
			$scope.fleets = dataSet;
			$scope.fleetItems = dataSet.items;
			FmsUtils.setSpeedClasses($scope.fleetItems);
			$scope.speedRangeSummaries = FmsUtils.getSpeedSummaries($scope.fleetItems);
			$scope.tablestate.pagination.totalItemCount = dataSet.total;
			$scope.tablestate.pagination.numberOfPages = dataSet.total_page;
			$scope.$emit('monitor-fleet-list-change', $scope.fleets);
		});
	};

	/**
	 * show fleet info window to map
	 */
	$scope.showFleetInfo = function(fleet) {
		$scope.$emit('monitor-fleet-info-change', fleet);
	};

	/**
	 * show trip to map
	 */
	$scope.showTrip = function(fleet) {
		$scope.$emit('monitor-fleet-trip-change', fleet);
	};

	/**
	 * map refresh 
	 */	
	$rootScope.$on('monitor-refresh-fleet', function(evt, value) {
		//$scope.findFleets(null);
		$scope.pageFleets(null);
	});

	/**
	 * settings data all ready 
	 */
	//$scope.$on('settings-all-ready', function(evt, value) {
	//	$scope.init();
	//});

	/**
	 * 초기화 함수 
	 */
	$scope.init = function() {
		$scope.findGroups(null);
		//$scope.findFleets(null);
	};

	$scope.init();

});
