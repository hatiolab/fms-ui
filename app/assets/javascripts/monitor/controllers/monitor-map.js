angular.module('fmsMonitor').controller('MonitorMapCtrl', function($rootScope, $scope, $timeout, $interval, RestApi) {
	
	/**
	 * map option
	 */
	$scope.mapOption = { center: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }, zoom: 9 };
	/**
	 * map markers for fleets
	 */
	$scope.markers = [];
	/**
	 * window show / hide switch
	 */
	$scope.windowSwitch = { showFleetInfo : false };
	/**
	 * 선택된 마커 
	 */
	$scope.selectedMarker = null;

	/**
	 * Refresh Fleet Markers
	 */
	$scope.refreshFleetMarkers = function(fleets) {
		$scope.markers = [];
		for(var i = 0 ; i < fleets.length ; i++) {
			var marker = $scope.fleetToMarker(fleets[i]);
			$scope.markers.push(marker);
		}
	};

	/**
	 * convert fleet to marker
	 */
	$scope.fleetToMarker = function(fleet) {
			var marker = fleet;
			marker.latitude = fleet.lat;
			marker.longitude = fleet.lng;
			marker.events = {
					click : function(e) {
						$scope.selectedMarker = e.model;
						$scope.windowSwitch.showFleetInfo = true;
						$scope.getAddress($scope.selectedMarker);
					}
			};
			return marker;
	};

	/**
	 * show fleet information window
	 */
	$scope.showFleetInfo = function(fleet) {
		$scope.selectedMarker = fleet;
		$scope.windowSwitch.showFleetInfo = true;
		$scope.getAddress($scope.selectedMarker);
	};

	/**
	 * get address from lat, lng
	 */
	$scope.getAddress = function(marker) {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(marker.latitude, marker.longitude);
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                $scope.selectedMarker.address = results[1].formatted_address;
            } else {
                $scope.selectedMarker.address = 'Location not found';
            }
        } else {
            $scope.selectedMarker.address = 'Geocoder failed due to: ' + status;
        }
    });
	};

	/**
	 * 지도 초기화 
	 */
	$scope.clearAll = function(center) {
		$scope.markers = [];
		if(center) {
			$scope.mapOption.center = center;
		}
	};

	/**
	 * fleet info window
	 */
	$scope.showFleetInfo = function(fleet) {
		$scope.selectedMarker = $scope.fleetToMarker(fleet);
		$scope.windowSwitch.showFleetInfo = true;
		$scope.getAddress($scope.selectedMarker);
	};

	/**
	 * Move to trip of fleet
	 */
	$scope.goTrip = function() {
		var fleet = $scope.selectedMarker;

		if(!fleet.trip_id) {
			alert('This car has no trip information!');
			return;
		}

		// 1. invoke rest api
		RestApi.get('/fleets/' + fleet.id + '/trip.json', {}, function(dataSet) {
			console.log(dataSet);
			// 2. map 초기화 
			$scope.clearAll({latitude : fleet.lat, longitude : fleet.lng});
			// 3. trip 그리기 
			// TODO
		});
	};

	/**
	 * Fleet 조회시 이벤트 리슨
	 */
	$rootScope.$on('monitor-fleet-list-change', function(evt, fleetDataSet) {
		if(fleetDataSet && fleetDataSet.items) {
			$scope.refreshFleetMarkers(fleetDataSet.items);
		}
	});

	/**
	 * Fleet 하나 선택시 이벤트 리슨
	 */
	$rootScope.$on('monitor-fleet-trip-change', function(evt, fleet) {
		if(fleet.id && fleet.trip_id) {
			$scope.selectedMarker = $scope.fleetToMarker(fleet);
			$scope.goTrip();
		}
	});

	/**
	 * Fleet 하나 선택시 이벤트 리슨
	 */
	$rootScope.$on('monitor-fleet-info-change', function(evt, fleet) {
		$scope.showFleetInfo(fleet);
	});

	/**
	 * Scope destroy시 timeout 제거 
	 */
	$scope.$on('$destroy', function(event) {
		$interval.cancel();
	});

	/**
	 * Refresh 설정이 변경된 경우 
	 */	
	$scope.$on('setting-map_refresh-change', function(evt, value) {
		$scope.refreshTimer();
	});

	/**
	 * Refresh Interval 설정이 변경된 경우 
	 */	
	$scope.$on('setting-map_refresh_interval-change', function(evt, value) {
		$scope.refreshTimer();
	});

	/**
	 * Refresh timer를 시작 
	 */
	$scope.refreshTimer = function() {
		$interval.cancel();
		var refresh = $rootScope.getSetting('map_refresh');
		var interval = $rootScope.getIntSetting('map_refresh_interval');

		if(refresh == 'Y' && interval && interval >= 1) {
			$interval($scope.refreshMap, interval * 1000);
		}
	};

	/**
	 * map을 refresh
	 */
	$scope.refreshMap = function() {
		$scope.$emit('monitor-refresh-fleet', 1);
	};

	/**
	 * start timer
	 */
	$scope.refreshTimer();

});