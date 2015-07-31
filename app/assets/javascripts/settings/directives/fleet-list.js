angular.module('fmsSettings').directive('fleetList', function() { 
	return { 
		restrict: 'E',
		controller: 'fleetListCtrl',
		templateUrl: '/assets/settings/views/sidebars/fleets.html',
		scope: {},
		link : function(scope, element, attr, fleetListCtrl) {
			// 버튼이 Directive Element 바깥쪽에 있어서 버튼 클릭함수를 이용 ...
			scope.findFleets();
			var refreshButton = angular.element('button');
			refreshButton.bind("click", function() {
				scope.findFleets();
				//scope.pageDrivers(null);
			});
		}	}; 
})
.controller('fleetListCtrl', function($rootScope, $scope, $resource, $element, FmsUtils, RestApi) {

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
		if(params.name) {
			searchParams["_q[name-like]"] = params.name;
		}
		if(params.driver) {
			searchParams["_q[driver_id-like]"] = params.driver;
		}
		if(params.carNo) {
			searchParams["_q[car_no-like]"] = params.carNo;
		}
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
		if(!$scope.fleetInit){
			$scope.fleetInit = true;
		}
		if(!params || params == {}) {
			searchParams = angular.copy($scope.fleetSearchParams);
			searchParams.fleet_group_id = searchParams.group ? searchParams.group.id : '';
		}

		searchParams = $scope.normalizeSearchParams(searchParams);
		RestApi.search('/fleets.json', searchParams, function(dataSet) {
			$scope.fleets = dataSet;
			$scope.fleetItems = dataSet.items;
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
		$scope.findFleets(null);
		//$scope.pageFleets(null);
	});

	/**
	 * [watch fleetSearchParams in page scope, if changed trigger pageFleets in same scope]
	 * @param  $scope.fleetSearchParams
	 * @return null
	 */
	$scope.$watchCollection('fleetSearchParams', function() {
		if($scope.fleetInit){
			$scope.findFleets(null);
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