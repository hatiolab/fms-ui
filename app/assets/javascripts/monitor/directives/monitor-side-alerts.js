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
					scope.findEvents(null);
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
	 * 폼 모델 초기화 
	 */
	$scope.eventSearchParams = {'ctm_gte' : fromDateStr, 'ctm_lte' : toDateStr};

	$(function() {
		var fromDt = $('#monitor-side-alert-datepicker1').datetimepicker({
			language : 'en',
			pickTime : false,
			autoclose : true
		}).on('changeDate', function(fev) {
			$scope.eventSearchParams["ctm_gte"] = FmsUtils.formatDate(fev.date, 'yyyy-MM-dd');
			fromDt.data('datetimepicker').hide();
		});
	});

	$(function() {
		var toDt = $('#monitor-side-alert-datepicker2').datetimepicker({
			language : 'en',
			pickTime : false,
			autoclose : true
		}).on('changeDate', function(tev) {
			$scope.eventSearchParams["ctm_lte"] = FmsUtils.formatDate(tev.date, 'yyyy-MM-dd');
			toDt.data('datetimepicker').hide();
		});
	});

	/**
	 * Rails Server의 스펙에 맞도록 파라미터 변경 ...
	 */
	this.convertSearchParams = function(params) {

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

	$scope.normalizeSearchParams = this.convertSearchParams;

	/**
	 * find groups
	 */
  this.searchGroups = function(params) {
		RestApi.list('/fleet_groups.json', params, function(dataSet) {
			$scope.groups = dataSet;
		});
  };

	$scope.findGroups = this.searchGroups;

	/**
	 * find fleets
	 */
	this.searchFleets = function(params) {
		params = params || {};
		params["_o[name]"] = "asc";
		RestApi.list('/fleets.json', params, function(dataSet) {
			$scope.fleets = dataSet;
		});
	};

	$scope.findFleets = this.searchFleets;

	/**
	 * find events
	 */
	this.searchEvents = function(params) {
		var searchParams = params;
		if(FmsUtils.isEmpty(searchParams)) {
			searchParams = angular.copy($scope.eventSearchParams);
			searchParams.fleet_group_id = searchParams.group ? searchParams.group.id : '';
			searchParams.fleet_id = searchParams.fleet ? searchParams.fleet.name : '';
		}

		searchParams = $scope.normalizeSearchParams(searchParams);
		searchParams.start = 0;
		searchParams.limit = 100;

		RestApi.search('/events.json', searchParams, function(dataSet) {
			$scope.events = dataSet;
			$scope.eventItems = dataSet.items;
			FmsUtils.setEventTypeClasses($scope.eventItems);
			$scope.eventTypeSummaries = FmsUtils.getEventTypeSummaries($scope.eventItems);
			$scope.$emit('monitor-event-list-change', $scope.events);
			// grid container를 새로 설정한다.
			FmsUtils.setGridContainerHieght('monitor-alert-table-container');
		});
	};

	$scope.findEvents = this.searchEvents;

	/**
	 * smart table object
	 */
	$scope.tablestate = null;
	/**
	 * 처음 전체 페이지 로딩시는 event data 자동조회 하지 않는다.
	 */
	$scope.eventInit = false;
	/**
	 * call by pagination
	 */
	$scope.pageEvents = function(tablestate) {
		if(!$scope.eventInit) {
			$scope.eventInit = true;
			$scope.tablestate = tablestate;
			$scope.tablestate.pagination.number = 100;
			return;
		}
		
		if(tablestate) {
			$scope.tablestate = tablestate;
		}

		var searchParams = angular.copy($scope.eventSearchParams);
		searchParams.fleet_group_id = searchParams.group ? searchParams.group.id : '';
		searchParams.fleet_id = searchParams.fleet ? searchParams.fleet.name : '';
		searchParams = $scope.normalizeSearchParams(searchParams);
		searchParams.start = $scope.tablestate.pagination.start;
		searchParams.limit = $scope.tablestate.pagination.number;

		RestApi.search('/events.json', searchParams, function(dataSet) {
			$scope.events = dataSet;
			$scope.eventItems = dataSet.items;
			FmsUtils.setEventTypeClasses($scope.eventItems);
			$scope.eventTypeSummaries = FmsUtils.getEventTypeSummaries($scope.eventItems);
			$scope.tablestate.pagination.totalItemCount = dataSet.total;
			$scope.tablestate.pagination.numberOfPages = dataSet.total_page;
			$scope.$emit('monitor-event-list-change', $scope.events);
			// grid container를 새로 설정한다.
			FmsUtils.setGridContainerHieght('monitor-alert-table-container');
		});
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
		//$scope.findEvents(null);
		$scope.pageEvents(null);
	});

	/**
	 * form value 변화를 감지해서 자동 검색 
	 */
	$scope.$watchCollection('eventSearchParams', function() {
		if($scope.eventInit) {
			$scope.pageEvents(null);
		}
	});

	$scope.init = function() {
		$scope.findGroups({});
		$scope.findFleets({});
	};

	$scope.init();

});