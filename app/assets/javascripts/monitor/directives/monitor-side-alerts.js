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
					//sideAlertsCtrl.searchEvents(null);
					scope.pageEvents(null);
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
		var fromDt = $('#datepicker1').datetimepicker({
			language : 'en',
			pickTime : false,
			autoclose : true
		}).on('changeDate', function(fev) {
			$scope.eventSearchParams.ctm_gte = FmsUtils.formatDate(fev.date, 'yyyy-MM-dd');
			fromDt.data('datetimepicker').hide();
		});
	});

	$(function() {
		var toDt = $('#datepicker2').datetimepicker({
			language : 'en',
			pickTime : false,
			autoclose : true
		}).on('changeDate', function(tev) {
			FmsUtils.addDate(tev.date, -1);
			$scope.eventSearchParams.ctm_lte = FmsUtils.formatDate(tev.date, 'yyyy-MM-dd');
			toDt.data('datetimepicker').hide();
		});
	});

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

		// type
		if(params.typ) {
			var typeArr = [];

			for(var i = 0 ; i < 4 ; i++) {
				if(params.typ[i]) {
					typeArr.push(params.typ[i]);
					if(params.typ[i] == 'I') {
						typeArr.push('O');
					}
				}
			}

			if(typeArr.length > 1) {
				searchParams["_q[typ-in]"] = typeArr.join(',');
			} else if(typeArr.length == 1) {
				searchParams["_q[typ-eq]"] = typeArr[0];
			}
		}

		if(params['ctm_gte']) {
			var fromTime = new Date(params['ctm_gte']).getTime();
			searchParams['_q[ctm-gte]'] = fromTime;
		}

		if(params['ctm_lte']) {
			var toTime = FmsUtils.addDate(new Date(params['ctm_lte']), 1).getTime();
			searchParams['_q[ctm-lte]'] = toTime;
		}

		searchParams['_o[etm]'] = 'desc';
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
	 * find events
	 */
	this.searchEvents = function(params) {
		var searchParams = params;
		if(!params || params == {}) {
			searchParams = angular.copy($scope.eventSearchParams);
			searchParams.fleet_group_id = searchParams.group ? searchParams.group.id : '';
		}

		searchParams = $scope.normalizeSearchParams(searchParams);
		RestApi.search('/events.json', searchParams, function(dataSet) {
			$scope.events = dataSet;
			$scope.eventItems = dataSet.items;
			FmsUtils.setEventTypeClasses($scope.eventItems);
			$scope.eventTypeSummaries = FmsUtils.getEventTypeSummaries($scope.eventItems);
			$scope.$emit('monitor-event-list-change', $scope.events);
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
			return;
		}

		if(tablestate) {
			$scope.tablestate = tablestate;
			if($scope.tablestate.pagination.number < 20) {
				$scope.tablestate.pagination.number = 20;
			}
		}

		var searchParams = angular.copy($scope.eventSearchParams);
		searchParams.fleet_group_id = searchParams.group ? searchParams.group.id : '';
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
		});
	};

	/**
	 * show event info window to map
	 */
	$scope.showEventInfo = function(fmsEvent) {
		$scope.$emit('monitor-event-info-change', fmsEvent);
	};

	/**
	 * show event to map
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


	$scope.init = function() {
		$scope.findGroups({});
	};

	$scope.init();

});