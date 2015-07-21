angular.module('fmsMonitor').directive('monitorSideAlerts', function() {
	return {
		restrict: 'E',
		controller: 'sideAlertsCtrl',
		templateUrl: '/assets/monitor/views/sidebar/monitor-side-alerts.html',
		scope: {},
		link : function(scope, element, attr, sideAlertsCtrl) {
			$(function() {
				// TODO auto close
				$('.input-append.date').datetimepicker();
			});

			// 버튼이 Directive Element 바깥쪽에 있어서 버튼 클릭함수를 이용 ...
			var refreshButton = angular.element('.panel-refresh');
			refreshButton.bind("click", function() {
				var fleetTab = angular.element('#alertTab');
				// side-fleets 탭이 액티브 된 경우만 호출하도록 변경 ...
				if(fleetTab.hasClass('active')) {
					sideAlertsCtrl.searchEvents(null);
				}
			});
		}
	};
})

.controller('sideAlertsCtrl', function($rootScope, $scope, $resource, $element, RestApi) {
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

		if(params.typ) {
			var typeArr = [];

			for(var i = 0 ; i < 3 ; i++) {
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

		return searchParams;
	};

	$scope.normalizeSearchParams = this.convertSearchParams;

  this.searchGroups = function(params) {
		RestApi.list('/fleet_groups.json', params, function(dataSet) {
			$scope.groups = dataSet;
		});
  };

	$scope.findGroups = this.searchGroups;

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
			for(var i = 0 ; i < $scope.eventItems.length ; i++) {
				var eventItem = $scope.eventItems[i];
				if(eventItem.typ == 'I') {
					eventItem.typeClass = 'type-icon geofence-red';

				} else if(eventItem.typ == 'O') {
					eventItem.typeClass = 'type-icon geofence-red';

				} else if(eventItem.typ == 'G') {
					eventItem.typeClass = 'type-icon impact-red';

				} else if(eventItem.typ == 'B') {
					eventItem.typeClass = 'type-icon emergency-red';

				} else if(eventItem.typ == 'V') {
					eventItem.typeClass = 'type-icon overspeed-red';
				}
			};
			
			$scope.eventTypeSummaries = {
				geofence : 27,
				impact : 18,
				overspeed : 38,
				emergency : 5
			};

			$scope.$emit('monitor-event-list-change', $scope.events);
		});
	};

	$scope.findEvents = this.searchEvents;

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
		$scope.findEvents(null);
	});


	$scope.init = function() {
		$scope.findGroups({});
	};

	$scope.init();

});