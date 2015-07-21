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
					sideFleetsCtrl.searchFleets(null);
				}
      });
		}
	};
})

.controller('sideFleetsCtrl', function($rootScope, $scope, $resource, $element, ConstantSpeed, RestApi) {

	/**
	 * 폼 모델 초기화 
	 */
	$scope.fleetSearchParams = {};

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

		// TODO Speed값 파라미터 변경 ...
		
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

			for(var i = 0 ; i < $scope.fleetItems.length ; i++) {
				var fleetItem = $scope.fleetItems[i];
				var level = $rootScope.getSpeedLevel(fleetItem.velocity);

				if(level == ConstantSpeed.SPEED_IDLE) {
					fleetItem.typeClass = 'status-box dark';

				} else if(level == ConstantSpeed.SPEED_SLOW) {
					fleetItem.typeClass = 'status-box blue';

				} else if(level == ConstantSpeed.SPEED_NORMAL) {
					fleetItem.typeClass = 'status-box green';

				} else if(level == ConstantSpeed.SPEED_HIGH) {
					fleetItem.typeClass = 'status-box orange';

				} else if(level == ConstantSpeed.SPEED_OVER) {
					fleetItem.typeClass = 'status-box red';

				} else {
					fleetItem.typeClass = 'status-box gray';
				}
			};

			$scope.speedRangeSummaries = {
				speed_off : 1,
				speed_idle : 3,
				speed_slow : 2,
				speed_normal : 4,
				speed_high : 3,
				speed_over : 1
			};

			$scope.$emit('monitor-fleet-list-change', $scope.fleets);
		});
	};

	$scope.findFleets = this.searchFleets;

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
		$scope.findFleets(null);
	};

	$scope.init();

});
