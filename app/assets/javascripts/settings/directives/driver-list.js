angular.module('fmsSettings').directive('driverList', function() {
	return { 
		restrict: 'E',
		controller: 'driverListCtrl',
		templateUrl: '/assets/settings/views/sidebars/drivers.html',
		scope: {},
		link : function(scope, element, attr, driverListCtrl) {
			// 버튼이 Directive Element 바깥쪽에 있어서 버튼 클릭함수를 이용 ...
			// scope.findDrivers();
			scope.pageDrivers(null);
			var refreshButton = angular.element('button');
			refreshButton.bind("click", function() {
				// scope.findDrivers();
				scope.pageDrivers(null);
			});
		}
	}; 
})
.controller('driverListCtrl', function($rootScope, $scope, $resource, $element, FmsUtils, RestApi) {

	
	/**
	 * 사이드 바 토글 변수
	 */
	$scope.isSidebarToggle = true;

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
	 * 폼 모델 초기화 
	 */
	$scope.driverSearchParams = {};

	/**
	 * Rails Server의 스펙에 맞도록 파라미터 변경 ...
	 */
	this.convertSearchParams = function(params) {
		var searchParams = {};

		if(!params || FmsUtils.isEmpty(params)) {
			return searchParams;
		} 

		searchParams['_q[code-like]'] = params.code;
		searchParams['_q[division-like]'] = params.division;
		searchParams['_q[name-like]'] = params.name;
		searchParams['_o[code]'] = 'asc';
		return searchParams;
	};

	$scope.normalizeSearchParams = this.convertSearchParams;

	/**
	 * [search drivers master data]
	 * @param  {[object]} params [searchParams]
	 * @return N/A
	 */
	this.searchDrivers = function(params) {
		var searchParams = params;

		if(!$scope.driverInit){
			$scope.driverInit = true;
		}
		if(!params || params == {}) {
			searchParams = angular.copy($scope.driverSearchParams);
		}

		searchParams = $scope.normalizeSearchParams(searchParams);
		RestApi.search('/drivers.json', searchParams, function(dataSet) {
			$scope.drivers = dataSet;
			$scope.driverItems = dataSet.items;
			$scope.$emit('monitor-driver-list-change', $scope.drivers);
		});
	};

	$scope.findDrivers = this.searchDrivers;

	/**
	 * [tablestate smart table object]
	 * @type {[object]}
	 */
	$scope.tablestate = null;
	/**
	 * [drivers init 처음 전체 페이지 로딩시는 fleet data 자동조회 하지 않는다.]
	 * @type {Boolean}
	 */
	$scope.driverInit = false;

	/**
	 * [pagedrivers call search by pagenation]
	 * @param  {[object]} tablestate [smart table object]
	 * @return N/A
	 */
	$scope.pageDrivers = function(tablestate) {
		if(!$scope.driverInit){
			$scope.driverInit = true;
			$scope.tablestate = tablestate;
			$scope.tablestate.pagination.number = 3;
		}

		if(tablestate) {
			$scope.tablestate = tablestate;
		}

		var searchParams = angular.copy($scope.driverSearchParams);
		searchParams = $scope.normalizeSearchParams(searchParams);
		searchParams.start = $scope.tablestate.pagination.start;
		searchParams.limit = $scope.tablestate.pagination.number;

		RestApi.search('/drivers.json', searchParams, function(dataSet) {
			$scope.drivers = dataSet;
			$scope.driverItems = dataSet.items;
			console.log($scope.driverItems);
			$scope.tablestate.pagination.totalItemCount = dataSet.total;
			$scope.tablestate.pagination.numberOfPages = dataSet.total_page;
			$scope.$emit('monitor-driver-list-change', $scope.fleets);
		});
	};

	/**
	 * [show driver info to contents]
	 * @param  {[object]} driver [call driver information one by one]
	 * @return N/A
	 */
	$scope.goDriver = function(driver) {
		$scope.$emit('monitor-driver-info-change', driver);
	};

	/**
	 * [watch drivers SearchParams in page scope, if changed trigger pageFleets in same scope]
	 * @param  $scope.driverSearchParams
	 * @return null
	 */
	$scope.$watchCollection('driverSearchParams', function() {
		if($scope.driverInit) {
			//$scope.findDrivers(null);
			$scope.pageDrivers(null);
		}
	});


	/**
	 * 초기화 함수 
	 */
	$scope.init = function() {
		
	};

	$scope.init();

});