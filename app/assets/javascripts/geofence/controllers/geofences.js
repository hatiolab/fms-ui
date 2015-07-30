angular.module('fmsGeofence',['uiGmapgoogle-maps'])
.controller('Geofences', function($rootScope, $scope, $resource, $element, ConstantSpeed, FmsUtils, RestApi) {
	
	/**
	 * 사이드 바 토글 변수
	 */
	$scope.isSidebarToggle = true;
	/**
	 * 폼 모델 초기화 
	 */
	$scope.geofenceSearchParams = {};

	/**
	 * Rails Server의 스펙에 맞도록 파라미터 변경 ...
	 */
	this.convertSearchParams = function(params) {
		var searchParams = {};

		if(!params || FmsUtils.isEmpty(params)) {
			return searchParams;
		} 

		searchParams['_q[name-like]'] = params.name;
		searchParams['_q[description-like]'] = params.description;
		searchParams['_o[name]'] = 'asc';
		return searchParams;
	};

	$scope.normalizeSearchParams = this.convertSearchParams;

	/**
	 * [search geofences]
	 * @param  {[object]} params [searchParams]
	 * @return N/A
	 */
	this.searchgeofences = function(params) {
		var searchParams = params;
		if(!params || params == {}) {
			searchParams = angular.copy($scope.geofenceSearchParams);
		}

		searchParams = $scope.normalizeSearchParams(searchParams);
		RestApi.search('/geofences.json', searchParams, function(dataSet) {
			$scope.geofences = dataSet;
			$scope.geofenceItems = dataSet.items;
			$scope.$emit('monitor-geofence-list-change', $scope.geofences);
		});
	};

	$scope.findgeofences = this.searchgeofences;

	/**
	 * [tablestate smart table object]
	 * @type {[object]}
	 */
	$scope.tablestate = null;
	/**
	 * [fleetInit 처음 전체 페이지 로딩시는 fleet data 자동조회 하지 않는다.]
	 * @type {Boolean}
	 */
	$scope.geofenceInit = false;

	/**
	 * [pagegeofences call search by pagenation]
	 * @param  {[object]} tablestate [smart table object]
	 * @return N/A
	 */
	$scope.pageGeofences = function(tablestate) {
		if(!$scope.geofenceInit){
			$scope.geofenceInit = true;
			$scope.tablestate = tablestate;
			$scope.tablestate.pagination.number = 20;
		}

		if(tablestate) {
			$scope.tablestate = tablestate;
		}

		var searchParams = angular.copy($scope.geofenceSearchParams);
		searchParams = $scope.normalizeSearchParams(searchParams);
		searchParams.start = $scope.tablestate.pagination.start;
		searchParams.limit = $scope.tablestate.pagination.number;

		RestApi.search('/geofences.json', searchParams, function(dataSet) {
			$scope.geofences = dataSet;
			$scope.geofenceItems = dataSet.items;
			$scope.tablestate.pagination.totalItemCount = dataSet.total;
			$scope.tablestate.pagination.numberOfPages = dataSet.total_page;
			$scope.$emit('monitor-geofence-list-change', $scope.fleets);
		});
	};

	/**
	 * [showgeofenceInfo show geofence info window to map]
	 * @param  {[object]} geofence [call geofence information one by one]
	 * @return N/A
	 */
	$scope.goGeofence = function(geofence) {
		$scope.$emit('monitor-geofence-info-change', geofence);
	};

	/**
	 * [watch geofenceSearchParams in page scope, if changed trigger pageFleets in same scope]
	 * @param  $scope.geofenceSearchParams
	 * @return null
	 */
	$scope.$watchCollection('geofenceSearchParams', function() {
		if($scope.geofenceInit) {
			$scope.pageGeofences(null);
		}
	});


	/**
	 * 초기화 함수 
	 */
	$scope.init = function() {
		
	};

	$scope.init();
});