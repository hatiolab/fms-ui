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
					scope.findFleets(null);
					//scope.pageFleets(null);
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
	 */
	this.convertSearchParams = function(params) {
		var searchParams = {};

		if(!params || FmsUtils.isEmpty(params)) {
			return searchParams;
		} 

		if(params.fleet_group_id) {
			searchParams["_q[fleet_group_id-eq]"] = params.fleet_group_id;
		}

		FmsUtils.getSpeedLangeCondition(params, searchParams);
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
			// grid container를 새로 설정한다.
			FmsUtils.setGridContainerHieght('monitor-fleet-table-container');
		});
	};

	$scope.findFleets = this.searchFleets;

	/**
	 * smart table object
	 */
	$scope.tablestate = null;
	/**
	 * 처음 전체 페이지 로딩시는 fleet data 자동조회 하지 않는다.
	 */
	$scope.fleetInit = false;
	/**
	 * call by pagination
	 */
	$scope.pageFleets = function(tablestate) {
		if(!$scope.fleetInit){
			$scope.fleetInit = true;
			$scope.tablestate = tablestate;
			$scope.tablestate.pagination.number = 20;
		}

		if(tablestate) {
			$scope.tablestate = tablestate;
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
			// grid container를 새로 설정한다.
			FmsUtils.setGridContainerHieght('monitor-fleet-table-container');
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
	 * [watch fleetSearchParams in page scope, if changed trigger pageFleets in same scope]
	 * @param  $scope.fleetSearchParams
	 * @return null
	 */
	$scope.$watchCollection('fleetSearchParams', function() {
		if($scope.fleetInit){
			$scope.pageFleets(null);
		}
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
