angular.module('fmsSettings').directive('groupList', function() { 
	return { 
		restrict: 'E',
		controller: 'groupListCtrl',
		templateUrl: '/assets/settings/views/sidebars/groups.html',
		scope: {},
		link : function(scope, element, attr, groupListCtrl) {
			// 버튼이 Directive Element 바깥쪽에 있어서 버튼 클릭함수를 이용 ...
			scope.findGroups();
			var refreshButton = angular.element('button');
			refreshButton.bind("click", function() {
				scope.findGroups();
				//scope.pageDrivers(null);
			});
		}
	}; 
})
.controller('groupListCtrl', function($rootScope, $scope, $resource, $element, FmsUtils, RestApi) {
$scope.groupSearchParams = {};

	/**
	 * Rails Server의 스펙에 맞도록 파라미터 변경 ...
	 */
	this.convertSearchParams = function(params) {
		var searchParams = {};

		if(!params || FmsUtils.isEmpty(params)) {
			return searchParams;
		} 

		if(params.name) {
			searchParams["_q[name-like]"] = params.name;
		}
		if(params.description) {
			searchParams["_q[description-like]"] = params.description;
		}
		searchParams['_o[name]'] = 'asc';
		return searchParams;
	};

	$scope.normalizeSearchParams = this.convertSearchParams;


	/**
	 * Search groupList
	 */
	this.searchGroups = function(params) {
		var searchParams = params;
		if(!$scope.groupInit){
			$scope.groupInit = true;
		}	
		if(!params || params == {}) {
			searchParams = angular.copy($scope.groupSearchParams);
		}

		searchParams = $scope.normalizeSearchParams(searchParams);
		RestApi.search('/fleet_groups.json', searchParams, function(dataSet) {
			$scope.groups = dataSet;
			$scope.groupItems = dataSet.items;
			$scope.$emit('monitor-group-list-change', $scope.groups);
			// grid container를 새로 설정한다.
			FmsUtils.setGridContainerHieght('monitor-group-table-container');
		});
	};

	$scope.findGroups = this.searchGroups;

	/**
	 * smart table object
	 */
	$scope.tablestate = null;
	/**
	 * 처음 전체 페이지 로딩시는 group data 자동조회 하지 않는다.
	 */
	$scope.groupInit = false;
	/**
	 * call by pagination
	 */
	$scope.pageGroups = function(tablestate) {
		if(!$scope.groupInit){
			$scope.groupInit = true;
			$scope.tablestate = tablestate;
			$scope.tablestate.pagination.number = 20;
		}

		if(tablestate) {
			$scope.tablestate = tablestate;
		}

		var searchParams = angular.copy($scope.groupSearchParams);
		searchParams.group_group_id = searchParams.group ? searchParams.group.id : '';
		searchParams = $scope.normalizeSearchParams(searchParams);
		searchParams.start = $scope.tablestate.pagination.start;
		searchParams.limit = $scope.tablestate.pagination.number;

		RestApi.search('/fleet_groups.json', searchParams, function(dataSet) {
			$scope.groups = dataSet;
			$scope.groupItems = dataSet.items;
			$scope.tablestate.pagination.totalItemCount = dataSet.total;
			$scope.tablestate.pagination.numberOfPages = dataSet.total_page;
			$scope.$emit('monitor-group-list-change', $scope.groups);
			// grid container를 새로 설정한다.
			FmsUtils.setGridContainerHieght('monitor-group-table-container');
		});
	};

	/**
	 * show group info window to map
	 */
	$scope.showgroupInfo = function(group) {
		$scope.$emit('monitor-group-info-change', group);
	};

	/**
	 * show trip to map
	 */
	$scope.showTrip = function(group) {
		$scope.$emit('monitor-group-trip-change', group);
	};

	/**
	 * map refresh 
	 */	
	$rootScope.$on('monitor-refresh-group', function(evt, value) {
		$scope.findGroups(null);
		//$scope.pagegroups(null);
	});

	/**
	 * [watch groupSearchParams in page scope, if changed trigger pagegroups in same scope]
	 * @param  $scope.groupSearchParams
	 * @return null
	 */
	$scope.$watchCollection('groupSearchParams', function() {
		if($scope.groupInit){
			$scope.findGroups(null);
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
		//$scope.findgroups(null);
	};

	$scope.init();
});