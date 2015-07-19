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
	 * 선택된 마커 
	 */
	$scope.selectedMarker = null;
	/**
	 * window show / hide switch
	 */
	$scope.windowSwitch = { 
		showFleetInfo : false,
		showTripInfo : false,
		showBatchInfo : false,
		showTrackInfo : false
	};

	$scope.switchOn = function(infoName) {
		if(infoName == 'fleet') {
			$scope.windowSwitch.showFleetInfo = true;
			$scope.windowSwitch.showTripInfo = false;
			$scope.windowSwitch.showBatchInfo = false;
			$scope.windowSwitch.showTrackInfo = false;

		} else if(infoName == 'trip') {
			$scope.windowSwitch.showFleetInfo = false;
			$scope.windowSwitch.showTripInfo = true;
			$scope.windowSwitch.showBatchInfo = false;
			$scope.windowSwitch.showTrackInfo = false;

		} else if(infoName == 'batch') {
			$scope.windowSwitch.showFleetInfo = false;
			$scope.windowSwitch.showTripInfo = false;
			$scope.windowSwitch.showBatchInfo = true;
			$scope.windowSwitch.showTrackInfo = false;

		} else if(infoName == 'track') {
			$scope.windowSwitch.showFleetInfo = false;
			$scope.windowSwitch.showTripInfo = false;
			$scope.windowSwitch.showBatchInfo = false;
			$scope.windowSwitch.showTrackInfo = true;
		}
	};

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
						$scope.switchOn('fleet');
						$scope.getAddress($scope.selectedMarker);
					}
			};
			return marker;
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
		$scope.polylines = [];

		if(center) {
			$scope.mapOption.center = center;
		}
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
			// 1. window 닫기.
			$scope.windowSwitch.showFleetInfo = false;
			// 2. map 초기화 
			$scope.clearAll({latitude : fleet.lat, longitude : fleet.lng});
			// 3. trip 그리기 
			$scope.showTrip(dataSet);
		});
	};

	/**
	 * Show Trip
	 */
	$scope.showTrip = function(tripDataSet) {
		var fleet = tripDataSet.fleet;
		var trip = tripDataSet.trip;
		var batches = tripDataSet.batches;
		var tracks = tripDataSet.tracks;
		var path = [];

		$scope.markers.push($scope.tripToMarker(trip));

		for(var i = 0 ; i < batches.length ; i++) {
			$scope.markers.push($scope.batchToMarker(batches[i]));
		}

		for(var i = 0 ; i < tracks.length ; i++) {
			$scope.markers.push($scope.trackToMarker(tracks[i]));
			path.push({latitude : tracks[i].lat, longitude : tracks[i].lng});
		}

		$scope.polylines.push({
			id : 1,
			path : path,
			stroke : {
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 2
			},
			geodesic : true,
			visible : true
		});

		console.log($scope.polylines);
	};

	/**
	 * convert trip to marker
	 */
	$scope.tripToMarker = function(trip) {
		var marker = trip;
		marker.latitude = trip.lat;
		marker.longitude = trip.lng;
		marker.events = {
			click : function(e) {
				$scope.selectedMarker = e.model;
				$scope.switchOn('trip');
				$scope.getAddress($scope.selectedMarker);
			}
		};
		return marker;
	};	

	/**
	 * convert batch to marker
	 */
	$scope.batchToMarker = function(batch) {
		var marker = batch;
		marker.latitude = batch.lat;
		marker.longitude = batch.lng;
		marker.events = {
			click : function(e) {
				$scope.selectedMarker = e.model;
				$scope.switchOn('batch');
				$scope.getAddress($scope.selectedMarker);
			}
		};
		return marker;
	};

	/**
	 * convert batch to marker
	 */
	$scope.trackToMarker = function(track) {
		var marker = track;
		marker.latitude = track.lat;
		marker.longitude = track.lng;
		marker.stroke = {
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		},
		marker.events = {
			click : function(e) {
				$scope.selectedMarker = e.model;
				$scope.switchOn('track');
				$scope.getAddress($scope.selectedMarker);
			}
		};
		return marker;
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