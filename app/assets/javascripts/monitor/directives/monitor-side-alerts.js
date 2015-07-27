angular.module('fmsMonitor').directive('monitorSideAlerts', function() {
	return {
		restrict: 'E',
		controller: 'sideAlertsCtrl',
		templateUrl: '/assets/monitor/views/sidebar/monitor-side-alerts.html',
		scope: {},
		link : function(scope, element, attr, sideAlertsCtrl) {
			$(function() {
				$('.input-append.date').datetimepicker();
			});

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
	 * 폼 모델 초기화 
	 */
	$scope.eventSearchParams = {};

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

		// date from ~ to
		if(params.from_date) {
			console.log(params.from_date);
		}

		if(params.to_date) {
			console.log(params.to_date);
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
	 * call by pagination
	 */
	$scope.pageEvents = function(tablestate) {
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