angular.module('fmsMonitor').controller('MonitorMapCtrl', function($rootScope, $scope, $timeout, $interval, RestApi) {
	
	/**
	 * map option
	 */
	$scope.mapOption = { center: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }, zoom: 9 };
	/**
	 * map marker models for fleets, map polyline model for tracks, currently selected marker, map control
	 */
	$scope.markers = [], $scope.polylines = [], $scope.selectedMarker = null; $scope.mapControl = {};
	/**
	 * window show / hide switch model
	 */
	$scope.windowSwitch = { 
		showFleetInfo : false,
		showTripInfo : false,
		showBatchInfo : false,
		showTrackInfo : false,
		showEventInfo : false
	};

	/**
	 * window information switch on
	 */
	$scope.switchOn = function(switchName) {
		for (property in $scope.windowSwitch) {
			if(property == switchName) {
				$scope.windowSwitch[property] = true;	
			} else {
				$scope.windowSwitch[property] = false;	
			}
		}
	};

	/**
	 * window information switch off all
	 */
	$scope.switchOffAll = function() {
		for (property in $scope.windowSwitch) {
			$scope.windowSwitch[property] = false;
		}		
	};

	/**
	 * Refresh Fleet Markers
	 */
	$scope.refreshFleets = function(fleets) {
		if(!fleets && fleets.length == 0) {
			alert('Fleet does not exist!');
			return;
		}

		$scope.clearAll(null);
		var gmap = $scope.mapControl.getGMap();
		var startPoint = new google.maps.LatLng(fleets[0].lat, fleets[0].lng);
		var bounds = new google.maps.LatLngBounds(startPoint, startPoint);
		var markerId = 1;

		for(var i = 0 ; i < fleets.length ; i++) {
			var marker = $scope.fleetToMarker(fleets[i]);
			markerId = $scope.addMarker(markerId, marker);
			bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
		}

		gmap.setCenter(bounds.getCenter());
		gmap.fitBounds(bounds);
	};

	/**
	 * fleet info window
	 */
	$scope.showFleetInfo = function(fleet) {
		$scope.selectedMarker = $scope.fleetToMarker(fleet);
		$scope.switchOn('showFleetInfo');
		if(!$scope.selectedMarker.address) {
			$scope.getAddress($scope.selectedMarker);
		}
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
            marker.address = results[1].formatted_address;
        } else {
            marker.address = 'Location not found';
        }
      } else {
        marker.address = 'Geocoder failed due to: ' + status;
      }
    });
	};

	/**
	 * Refresh Event Markers
	 */
	$scope.refreshEvents = function(eventDataList) {
		if(!eventDataList && eventDataList.length == 0) {
			alert('Alert does not exist!');
			return;
		}

		$scope.clearAll(null);
		var firstEvent = eventDataList[0];
		var gmap = $scope.mapControl.getGMap();
		var startPoint = new google.maps.LatLng(firstEvent.lat, firstEvent.lng);
		var bounds = new google.maps.LatLngBounds(startPoint, startPoint);
		var markerId = 1;

		for(var i = 0 ; i < eventDataList.length ; i++) {
			var eventData = eventDataList[i];
			var marker = $scope.eventToMarker(eventData);
			markerId = $scope.addMarker(markerId, marker);
			bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
		}

		gmap.setCenter(bounds.getCenter());
		gmap.fitBounds(bounds);
	};	

	/**
	 * 지도 초기화 
	 */
	$scope.clearAll = function(center) {
		angular.forEach($scope.markers, function(marker) {
			marker = null;
		});

		$scope.markers = null;
		$scope.markers = [];
		$scope.polylines = [];
		$scope.selectedMarker = null;
		$scope.switchOffAll();

		if(center) {
			$scope.mapOption.center = center;
		}
	};

	/**
	 * Move to trip of fleet
	 */
	$scope.goTripByFleet = function() {
		if(!$scope.selectedMarker.trip_id) {
			alert('This car has no trip information!');
			return;
		}

		$scope.getTripDataSet($scope.selectedMarker.id);
	};

	/**
	 * Move to trip of fleet
	 */
	$scope.goTripByEvent = function() {
		if(!$scope.selectedMarker.tid) {
			alert('This event has no trip information!');
			return;
		}

		$scope.getTripDataSet($scope.selectedMarker.fid);
	};

	$scope.getTripDataSet = function(fid) {
		// 1. invoke rest api
		RestApi.get('/fleets/' + fid + '/trip.json', {}, function(dataSet) {
			// 1. map 초기화 
			$scope.clearAll(null);
			// 2. trip 그리기 
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
		var events = tripDataSet.events;
		var gmap = $scope.mapControl.getGMap();
		var markerId = 10000;

		// 1. trip
		var startPoint = new google.maps.LatLng(trip.s_lat, trip.s_lng);
		var bounds = new google.maps.LatLngBounds(startPoint, startPoint);
		markerId = $scope.addMarker(markerId, $scope.tripToMarker(trip, 'start'));

		// 2. batches
		for(var i = 0 ; i < batches.length ; i++) {
			var batch = batches[i];

			// 2.1 batch start
			markerId = $scope.addMarker(markerId, $scope.batchToMarker(batch, 'start'));
			bounds.extend(new google.maps.LatLng(batch.s_lat, batch.s_lng));

			// 2.2 batch polyline
			var batchline = {
				id : batch.id,
				path : [],
				geodesic : true,
				visible : true,
				stroke : { color: '#FF0000', opacity: 1.0, weight: 4 }
			};

			$scope.polylines.push(batchline);

			// 2.3 tracks
			for(var j = 0 ; j < tracks.length ; j++) {
				if(tracks[j].bid == batch.id) {
					markerId = $scope.addMarker(markerId, $scope.trackToMarker(tracks[j]));
					batchline.path.push({latitude : tracks[j].lat, longitude : tracks[j].lng});
					bounds.extend(new google.maps.LatLng(tracks[j].lat, tracks[j].lng));
				}
			}

			// 2.4 events
			for(var k = 0 ; k < events.length ; k++) {
				if(events[k].bid == batch.id && events[k].typ != 'V') {
					markerId = $scope.addMarker(markerId, $scope.eventToMarker(events[k]));
					bounds.extend(new google.maps.LatLng(events[k].lat, events[k].lng));
				}
			}

			// 2.5 batch end
			if(batch.sts == '2') {
				markerId = $scope.addMarker(markerId, $scope.batchToMarker(batch, 'end'));
				batchline.path.push({latitude : batch.lat, longitude : batch.lng});
				bounds.extend(new google.maps.LatLng(batch.lat, batch.lng));
			}
		}

		// 3. trip end
		if(trip.sts == '2') {
			markerId = $scope.addMarker(markerId, $scope.tripToMarker(trip, 'end'));
		}

		gmap.setCenter(bounds.getCenter());
		gmap.fitBounds(bounds);
	};

	/**
	 * set marker unique id and add marker
	 */
	$scope.addMarker = function(markerIdx, marker) {
		//marker.id = markerIdx;
		$scope.markers.push(marker);
		return markerIdx + 1;
	};

	/**
	 * add marker click event
	 */
	$scope.addMarkerClickEvent = function(e, switchName) {
		$scope.selectedMarker = e.model;
		$scope.switchOn(switchName);
		if(!$scope.selectedMarker.address) {
			$scope.getAddress(e.model);
		}
	}

	/**
	 * convert fleet to marker
	 */
	$scope.fleetToMarker = function(fleet) {
		var marker = angular.copy(fleet);
		marker._id = fleet.id;
		marker.latitude = fleet.lat;
		marker.longitude = fleet.lng;
		marker.icon = $scope.getFleetMarkerIcon(fleet);
		marker.events = {
			click : function(e) {
				$scope.addMarkerClickEvent(e, 'showFleetInfo');
			}
		};
		return marker;
	};

	/**
	 * convert trip to marker
	 */
	$scope.tripToMarker = function(trip, type) {
		var marker = angular.copy(trip);
		marker._id = 'trip-' + trip.id;
		marker.latitude = (type == 'start') ? trip.s_lat : trip.lat;
		marker.longitude = (type == 'start') ? trip.s_lng : trip.lng;
		marker.icon = $scope.getTripMarkerIcon(trip, type);
		marker.type = type;
		marker.events = {
			click : function(e) {
				$scope.addMarkerClickEvent(e, 'showTripInfo');
			}
		};
		return marker;
	};	

	/**
	 * convert batch to marker
	 */
	$scope.batchToMarker = function(batch, type) {
		var marker = angular.copy(batch);
		marker._id = batch.id + '-' + type;
		marker.latitude = (type == 'start') ? batch.s_lat : batch.lat;
		marker.longitude = (type == 'start') ? batch.s_lng : batch.lng;
		marker.icon = $scope.getBatchMarkerIcon(batch, type);
		marker.type = type;
		marker.events = {
			click : function(e) {
				$scope.addMarkerClickEvent(e, 'showBatchInfo');
			}
		};
		return marker;
	};

	/**
	 * convert track to marker
	 */
	$scope.trackToMarker = function(track) {
		var marker = angular.copy(track);
		marker._id = 'track-' + track.id;
		marker.latitude = track.lat;
		marker.longitude = track.lng;
		marker.ctm = parseInt(track.ctm);
		marker.utm = parseInt(track.utm);
		marker.ttm = parseInt(track.ttm);

		if(marker.f_img && marker.f_img != '' && marker.f_img.indexOf('http') < 0) {
			marker.f_img = CONTENT_BASE_URL + marker.f_img;
		}
		
		if(marker.r_img && marker.r_img != '' && marker.r_img.indexOf('http') < 0) {
			marker.r_img = CONTENT_BASE_URL + marker.r_img;
		}
		
		marker.icon = $scope.getTrackMarkerIcon(track);
		marker.events = {
			click : function(e) {
				$scope.addMarkerClickEvent(e, 'showTrackInfo');
			}
		};
		return marker;
	};

	/**
	 * convert event to marker
	 */
	$scope.eventToMarker = function(evt) {
		var marker = angular.copy(evt);
		marker._id = evt.id + '-' + evt.typ;
		marker.latitude = evt.lat;
		marker.longitude = evt.lng;
		
		if(marker.vdo && marker.vdo != '' && marker.vdo.indexOf('http') < 0) {
			marker.vdo = CONTENT_BASE_URL + marker.vdo;
		}
		
		if(marker.f_vdo && marker.f_vdo != '' && marker.f_vdo.indexOf('http') < 0) {
			marker.f_vdo = CONTENT_BASE_URL + marker.f_vdo;
		}

		if(marker.r_vdo && marker.r_vdo != '' && marker.r_vdo.indexOf('http') < 0) {
			marker.r_vdo = CONTENT_BASE_URL + marker.r_vdo;
		}

		if(marker.ado && marker.ado != '' && marker.ado.indexOf('http') < 0) {
			marker.ado = CONTENT_BASE_URL + marker.ado;
		}

		marker.icon = $scope.getEventMarkerIcon(evt);
		marker.events = {
			click : function(e) {
				$scope.addMarkerClickEvent(e, 'showEventInfo');
			}
		};
		return marker;
	};

	/**
	 * Fleet Marker Icon
	 */
	$scope.getFleetMarkerIcon = function(fleet) {
		var velocity = fleet.velocity;
		var speedLevel = $rootScope.getSpeedLevel(velocity);
		var level = speedLevel.split('_')[1];
		return '/assets/fleet_' + level + '.png';
	};

	/**
	 * Trip Marker Icon
	 */
	$scope.getTripMarkerIcon = function(trip, type) {
		return '/assets/trip' + type + '.png';
	};

	/**
	 * Batch Marker Icon
	 */
	$scope.getBatchMarkerIcon = function(batch, type) {
		return '/assets/batch' + type + '.png';
	};

	/**
	 * Event Marker Icon
	 */
	$scope.getEventMarkerIcon = function(evt) {
		var icon = 'assets/event_';
		if(evt.typ == 'B') {
			icon += 'emergency.png';

		} else if(evt.typ == 'G') {
			icon += 'g_sensor.png';

		} else if(evt.typ == 'I') {
			icon += 'geofence_in.png';

		} else if(evt.typ == 'O') {
			icon += 'geofence_out.png';

		} else if(evt.typ == 'V') {
			icon += 'overspeed.png';
		}

		return icon;
	};

	/**
	 * Track Marker Icon
	 */
	$scope.getTrackMarkerIcon = function(track) {
		var icon = null, status = track.status;
		var prefix = 'assets/track_';
		if(track.f_img || track.r_img)
			prefix += 'i_';

		var speedLevel = $rootScope.getSpeedLevel(track.vlc);
		prefix += speedLevel.split('_')[1];
		return prefix + '.png';
	};

	/**
	 * Fleet 조회시
	 */
	$rootScope.$on('monitor-fleet-list-change', function(evt, fleetDataSet) {
		if(fleetDataSet && fleetDataSet.items) {
			$scope.refreshFleets(fleetDataSet.items);
		}
	});

	/**
	 * Fleet Trip 버튼 클릭시
	 */
	$rootScope.$on('monitor-fleet-trip-change', function(evt, fleet) {
			$scope.selectedMarker = $scope.fleetToMarker(fleet);
			$scope.goTripByFleet();
	});

	/**
	 * Grid에서 Fleet 선택시
	 */
	$rootScope.$on('monitor-fleet-info-change', function(evt, fleet) {
		// $scope.showFleetInfo(fleet);
		// TODO 1. center 이동 
		// 2. 마커 아이콘 변경 
	});

	/**
	 * Event 조회시
	 */
	$rootScope.$on('monitor-event-list-change', function(evt, eventDataSet) {
		if(eventDataSet && eventDataSet.items) {
			$scope.refreshEvents(eventDataSet.items);
		}
	});

	/**
	 * Event Trip 버튼 클릭시
	 */
	$rootScope.$on('monitor-event-trip-change', function(evt, eventData) {
		console.log(eventData);
		$scope.selectedMarker = $scope.eventToMarker(eventData);
		$scope.goTripByEvent();
	});

	/**
	 * Grid에서 Event 선택시
	 */
	$rootScope.$on('monitor-event-info-change', function(evt, eventData) {
		// $scope.showEventInfo(eventData);
		// TODO 1. center 이동 
		// 2. 마커 아이콘 변경 
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