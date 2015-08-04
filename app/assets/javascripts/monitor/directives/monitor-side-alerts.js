angular.module('fmsMonitor').directive('monitorSideAlerts', function() {
	return {
		restrict: 'E',
		controller: 'sideAlertsCtrl',
		templateUrl: '/assets/monitor/views/sidebar/monitor-side-alerts.html',
		scope: {},
		link : function(scope, element, attr, sideAlertsCtrl) {
			// 버튼이 Directive Element 바깥쪽에 있어서 버튼 클릭함수를 이용 ...
			var refreshButton = angular.element('.panel-refresh');
			refreshButton.bind("click", function() {
				var fleetTab = angular.element('#alertTab');
				// side-fleets 탭이 액티브 된 경우만 호출하도록 변경 ...
				if(fleetTab.hasClass('active')) {
					scope.searchEvents(null);
				}
			});
		}
	};
})

.controller('sideAlertsCtrl', function($rootScope, $scope, $resource, $element, FmsUtils, RestApi) {

	/**
	 * 기본 날짜 검색일 설정 
	 */
	 var toDateStr = FmsUtils.formatDate(new Date(), 'yyyy-MM-dd');
	 var fromDate = FmsUtils.addDate(new Date(), -6);
	 var fromDateStr = FmsUtils.formatDate(fromDate, 'yyyy-MM-dd');

	/**
	 * 조회 조건
	 */
	 $scope.searchParams = {'ctm_gte' : fromDateStr, 'ctm_lte' : toDateStr};
	/**
	 * Search DataSet
	 * 
	 * @type {Object}
	 */
	 $scope.items = [];
	/**
	 * Page Information - Total Record Count & Total Page
	 * 
	 * @type {Object}
	 */
	 $scope.pageInfo = { total : 0, total_page : 0, current_page : 0 };
	/**
	 * smart table object
	 */
	 $scope.tablestate = null;
	/**
	 * 처음 전체 페이지 로딩시는 event data 자동조회 하지 않는다.
	 */
	 $scope.eventInit = false;

	 /**
	  * Date Picker Handling
	  * 
	  * @param  {[type]}
	  * @return {[type]}
	  */
	 $(function() {
	 	var fromDt = $('#monitor-side-alert-datepicker1').datetimepicker({
	 		language : 'en',
	 		pickTime : false,
	 		autoclose : true
	 	}).on('changeDate', function(fev) {
	 		$scope.searchParams["ctm_gte"] = FmsUtils.formatDate(fev.date, 'yyyy-MM-dd');
	 		fromDt.data('datetimepicker').hide();
	 	});
	 });

	 $(function() {
	 	var toDt = $('#monitor-side-alert-datepicker2').datetimepicker({
	 		language : 'en',
	 		pickTime : false,
	 		autoclose : true
	 	}).on('changeDate', function(tev) {
	 		$scope.searchParams["ctm_lte"] = FmsUtils.formatDate(tev.date, 'yyyy-MM-dd');
	 		toDt.data('datetimepicker').hide();
	 	});
	 });

	/**
	 * Rails Server의 스펙에 맞도록 파라미터 변경 ...
	 */
	 $scope.normalizeSearchParams = function(params) {

	 	var searchParams = {};

	 	if(!params) {
	 		return searchParams;
	 	}

	 	if(params.fleet_group_id) {
	 		searchParams["_q[fleet_group_id-eq]"] = params.fleet_group_id;
	 	}

	 	if(params.fleet_id) {
	 		searchParams["_q[fid-eq]"] = params.fleet_id;
	 	}

	 	var typeArr = [];

	 	if(params['typ_impact']) {
	 		typeArr.push(params['typ_impact']);
	 	}

	 	if(params['typ_speed']) {
	 		typeArr.push(params['typ_speed']);
	 	}

	 	if(params['typ_geofence']) {
	 		typeArr.push('I');
	 		typeArr.push('O');
	 	}

	 	if(params['typ_emergency']) {
	 		typeArr.push(params['typ_emergency']);
	 	}

	 	if(typeArr.length == 1) {
	 		searchParams["_q[typ-eq]"] = typeArr[0];

	 	} else if(typeArr.length > 1) {
	 		searchParams["_q[typ-in]"] = typeArr.join(',');
	 	}

		// convert date to number
		FmsUtils.buildDateConds(searchParams, 'ctm', params['ctm_gte'], params['ctm_lte']);
		// sort
		searchParams['_o[ctm]'] = 'desc';
		return searchParams;
	};

	/**
	 * find groups
	 */
	 $scope.findGroups = function(params) {
	 	RestApi.list('/fleet_groups.json', params, function(dataSet) {
	 		$scope.groups = dataSet;
	 	});
	 };

	/**
	 * find fleets
	 */
	 $scope.findFleets = function(params) {
	 	params = params || {};
	 	params["_o[name]"] = "asc";
	 	RestApi.list('/fleets.json', params, function(dataSet) {
	 		$scope.fleets = dataSet;
	 	});
	 };

	/**
	 * search events
	 */
	 $scope.searchEvents = function(tablestate) {
	 	if(!$scope.eventInit) {
	 		$scope.eventInit = true;
	 		$scope.tablestate = tablestate;
	 		$scope.tablestate.pagination.number = 20;
	 		return;
	 	}

	 	if(tablestate) {
	 		$scope.tablestate = tablestate;
	 	}

 		var searchParams = $scope.beforeSearch();
		$scope.setPageQueryInfo(searchParams, $scope.tablestate.pagination, 0, 20);

    $scope.doSearch(searchParams, function(dataSet) {
      $scope.numbering(dataSet.items, 1);
      $scope.items = dataSet.items;
      scope.afterSearch(dataSet);
    });
	 };

	/**
	 * Items Numbering
	 * 
	 * @param  {Array}
	 * @param  {Number}
	 * @return N/A
	 */
	 $scope.numbering = function(items, startNo) {
	 	for(var i = 0 ; i < items.length ; i++) {
	 		items[i].no = i + 1;
	 	}
	 };

	 /**
	  * 페이지네이션 검색 정보를 설정한다. 
	  *
	  * @param {Object}
	  * @param {Object}
	  * @param {Number}
	  * @param {Number}
	  */
	 $scope.setPageQueryInfo = function(searchParams, pagination, start, limit) {
	 	searchParams.start = start;
	 	searchParams.limit = limit;
	 	pagination.start = start;
	 	pagination.number = limit;
	 }

	 /**
	  * 페이지네이션 결과 정보를 설정한다. 
	  * 
	  * @param {Number}
	  * @param {Number}
	  * @param {Number}
	  */
	 $scope.setPageReultInfo = function(total_count, total_page, current_page) {
 		$scope.pageInfo.total = total_count;
 		$scope.pageInfo.total_page = total_page;
 		$scope.pageInfo.current_page = current_page;

 		if($scope.tablestate && $scope.tablestate.pagination) {
 			$scope.tablestate.pagination.totalItemCount = total_count;
 			$scope.tablestate.pagination.numberOfPages = total_page;
 			$scope.tablestate.pagination.currentPage = current_page;
 		}
	 };

	 /**
	  * infinite scorll directive에서 호출 
	  * 
	  * @return {Object}
	  */
	 $scope.beforeSearch = function() {
	 	var searchParams = angular.copy($scope.searchParams);
	 	searchParams.fleet_group_id = searchParams.group ? searchParams.group.id : '';
	 	searchParams.fleet_id = searchParams.fleet ? searchParams.fleet.name : '';
	 	return $scope.normalizeSearchParams(searchParams);
	 };

	 /**
	  * infinite scorll directive에서 호출 
	  * 
	  * @param  {Object}
	  * @param  {Function}
	  * @return N/A
	  */
	 $scope.doSearch = function(params, callback) {
	 	RestApi.search('/events.json', params, function(dataSet) {
	 		callback(dataSet);
	 	});
	 };

	 /**
	  * infinite scorll directive에서 호출 
	  * 
	  * @param  {Object}
	  * @return N/A
	  */
	 $scope.afterSearch = function(dataSet) {
	 	$scope.setPageReultInfo(dataSet.total, dataSet.total_page, dataSet.page);
 		FmsUtils.setEventTypeClasses($scope.items);
 		$scope.eventTypeSummaries = FmsUtils.getEventTypeSummaries($scope.items);
 		// Map에 정보를 전달하여 지도에 표시하게 한다.
		$scope.$emit('monitor-event-list-change', $scope.items);
		// grid container를 새로 설정한다.
		FmsUtils.setGridContainerHieght('monitor-alert-table-container');
	 };

	/**
	 * show event info window to map
	 */
	 $scope.showEventInfo = function(fmsEvent) {
	 	$scope.$emit('monitor-event-info-change', fmsEvent);
	 };

	/**
	 * send show event to map
	 */
	 $scope.showTrip = function(fmsEvent) {
	 	$scope.$emit('monitor-event-trip-change', fmsEvent);
	 };

	/**
	 * map refresh 
	 */	
	 $rootScope.$on('monitor-refresh-event', function(evt, value) {
		// TODO Refresh는 Items Start ~ End No.로 조회한다.
		$scope.searchEvents(null);
	});

	/**
	 * form value 변화를 감지해서 자동 검색 
	 */
	 $scope.$watchCollection('searchParams', function() {
	 	if($scope.eventInit) {
	 		$scope.searchEvents(null);
	 	}
	 });

	 $scope.init = function() {
	 	$scope.findGroups({});
	 	$scope.findFleets({});
	 };

	 $scope.init();

	});