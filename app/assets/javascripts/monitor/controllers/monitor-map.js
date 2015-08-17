angular.module('fmsMonitor').controller('MonitorMapCtrl', function($rootScope, $scope, $element, $timeout, $interval, ConstantSpeed, FmsUtils, RestApi) {
	
	/**
	 * 현재 선택된 Trip ID
	 */
	$scope.currentTripId = null;
	/**
	 * map option
	 */
	$scope.mapOption = { center: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }, zoom: 9, fit : false };
	/**
	 * map marker models for fleets, map polyline model for tracks, currently selected marker, 
	 */
	$scope.markers = [], $scope.polylines = [], $scope.selectedMarker = null; 
	/**
	 * map control, marker control, polyline control
	 */
	$scope.mapControl = {}; $scope.markerControl = {}; $scope.polylineControl = {};
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
	 * window information switch off all
	 */
	$scope.isSwitchOn = function() {
		var on = false;
		for (property in $scope.windowSwitch) {
			if($scope.windowSwitch[property]) {
				on = true;
			}
		}
		return on;
	};

	/**
	 * Refresh Fleet Markers
	 */
	$scope.refreshFleets = function(fleets) {
		$scope.mapOption.fit = false;

		if(!fleets || fleets.length == 0) {
			return;
		}

		$scope.clearAll(null);
		//var gmap = $scope.mapControl.getGMap();
		//var startPoint = new google.maps.LatLng(fleets[0].lat, fleets[0].lng);
		//var bounds = new google.maps.LatLngBounds(startPoint, startPoint);

		for(var i = 0 ; i < fleets.length ; i++) {
			var marker = $scope.fleetToMarker(fleets[i]);
			$scope.addMarker(marker);
			//bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
		}

		//gmap.setCenter(bounds.getCenter());
		//gmap.fitBounds(bounds);
		
		$scope.mapOption.fit = true;
	};

	/**
	 * Show Monitor Mode Control
	 */
	$scope.showMonitorModeControl = function(map) {
		// 맵 상단에 모드 Overlay
	};

	/**
	 * Get address from lat, lng
	 */
	$scope.getAddress = function(marker, lat, lng, callback) {
		$scope.resetMapWindowAddress();
		var latitude = lat ? lat : marker.lat;
		var longitude = lng ? lng : marker.lng;
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);

    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
    	var address = null;

    	if (status == google.maps.GeocoderStatus.OK) {
    		if (results[1]) {
    			address = results[1].formatted_address;

        } else {
          address = 'Location not found';
        }
      } else {
        address = 'Geocoder failed due to: ' + status;
      }

			if(callback) {
				callback(marker, address);
			}      
    });
	};

	/**
	 * Map Window의 Address를 업데이트한다. 
	 *
	 * @param {Object}
	 * @param {String} 
	 */
	 $scope.updateMapWindowAddress = function(marker, address) {
	 	if($scope.selectedMarker && $scope.selectedMarker._id == marker._id) {
	 		var divAddrs = $element.find("div.detail-address.map-window");
	 		for(var i = 0 ; i < divAddrs.length ; i++) {
	 			var divAddr = divAddrs[i];
	 			divAddr.innerHTML = 'Location : ' + address;
	 		}
	 	}
	 };

	 /**
	  * Map Window의 Address를 초기화한다.
	  */
	 $scope.resetMapWindowAddress = function() {
	 		var divAddrs = $element.find("div.detail-address");
	 		for(var i = 0 ; i < divAddrs.length ; i++) {
	 			var divAddr = divAddrs[i];
	 			divAddr.innerHTML = '';
	 		}
	 };

	/**
	 * Refresh Event Markers
	 */
	$scope.refreshEvents = function(eventDataList) {
		if(!eventDataList || eventDataList.length == 0) {
			return;
		}

		$scope.clearAll(null);

		$scope.mapOption.fit = false;

		for(var i = 0 ; i < eventDataList.length ; i++) {
			var eventData = eventDataList[i];
			var marker = $scope.eventToMarker(eventData);
			$scope.addMarker(marker);
		}

		$scope.mapOption.fit = true;
	};	

	/**
	 * 지도 초기화 
	 */
	$scope.clearAll = function(center) {
		if(!$scope.markerControl || !$scope.markerControl.getGMarkers) {
			return;
		}

		// clear markers
		var gMarkers = $scope.markerControl.getGMarkers();
		angular.forEach(gMarkers, function(marker) {
			marker.setMap(null);
		});

		$scope.markerControl.getGMarkers().splice(0, gMarkers.length);
		$scope.markerControl.clean();

		angular.forEach($scope.markers, function(marker) {
			marker = null;
		});

		$scope.markers.splice(0, $scope.markers.length);

		// clear polylines
		angular.forEach($scope.polylines, function(polyline) {
			//polyline.path.splice(0, polyline.path.length);
			polyline = null;
		});

		$scope.polylines.splice(0, $scope.polylines.length);

		// 선택된 마커 해제 
		$scope.changeMarker(null);

		if(center) {
			$scope.mapOption.center = center;
		}
	};

	/**
	 * Move to trip of fleet
	 */
	$scope.goTrip = function(tripId, callback) {
		$scope.viewMode = 'TRIP';

		if(tripId) {
			$scope.getTripDataSet(tripId, callback);
		}
	};	

	/**
	 * Get trip data set
	 */
	$scope.getTripDataSet = function(tripId, callback) {
		// 1. invoke rest api
		RestApi.get('/trips/' + tripId + '/trip_set.json', {}, function(dataSet) {
			// 1. map 초기화 
			$scope.clearAll(null);
			// 2. trip 그리기 
			$scope.showTrip(dataSet, callback);
		});
	};

	/**
	 * Show Trip
	 */
	$scope.showTrip = function(tripDataSet, callback) {
		$scope.mapOption.fit = false;

		var trip = tripDataSet.trip;
		var fleet = tripDataSet.fleet;
		var batches = tripDataSet.batches;
		var tracks = tripDataSet.tracks;
		var events = tripDataSet.events;

		// 1. trip
		$scope.addMarker($scope.tripToMarker(trip, 'start'));

		// 2. batches
		for(var i = 0 ; i < batches.length ; i++) {
			var batch = batches[i];

			// 2.1 batch start
			$scope.addMarker($scope.batchToMarker(batch, 'start'));

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
					$scope.addMarker($scope.trackToMarker(tracks[j]));
					batchline.path.push({latitude : tracks[j].lat, longitude : tracks[j].lng});
				}
			}

			// 2.4 events
			for(var k = 0 ; k < events.length ; k++) {
				if(events[k].bid == batch.id) {
					$scope.addMarker($scope.eventToMarker(events[k]));
				}
			}

			// 2.5 batch end
			if(batch.sts == '2') {
				$scope.addMarker($scope.batchToMarker(batch, 'end'));
				batchline.path.push({latitude : batch.lat, longitude : batch.lng});
			}
		}

		// 3. trip end
		if(trip.sts == '2') {
			$scope.addMarker($scope.tripToMarker(trip, 'end'));
		}

		FmsUtils.setSpeedClass(trip, trip.vlc);

		// 현재 선택된 Trip을 변경 
		$scope.changeCurrentTrip(trip);

		$scope.mapOption.fit = true;

		$timeout(callback, 1000);

		/*if(callback) {
			callback();
		}*/
	};

	/**
	 * 현재 선택된 Trip을 변경한다.
	 * 
	 */
	$scope.changeCurrentTrip = function(newTrip) {
		if($scope.currentTripId != newTrip.id) {
			$scope.currentTripId = newTrip.id;
			// send trip information to infobar
			$rootScope.$broadcast('monitor-trip-info-change', newTrip);

			$scope.getAddress(newTrip, newTrip.s_lat, newTrip.s_lng, function(marker, address) {
	 			newTrip['fromAddress'] = address;
			});
		}
	};

	/**
	 * set marker unique id and add marker
	 */
	$scope.addMarker = function(marker) {
		$scope.markers.push(marker);
	};

	/**
	 * 선택 Marker를 변경한다.
	 * 
	 * @param {Object}
	 * @param {String}
	 */
	$scope.changeMarker = function(marker, switchName) {
		if(marker == null) {
			$scope.selectedMarker = null;
			$scope.switchOffAll();

		} else if($scope.selectedMarker != marker) {
			$scope.selectedMarker = marker;
			$scope.switchOn(switchName);

			if(marker.latitude > 0 && marker.longitude > 0) {
				$scope.getAddress(marker, null, null, $scope.updateMapWindowAddress);
			}
		}
	};

	/**
	 * add marker click event
	 */
	$scope.addMarkerClickEvent = function(e, switchName) {
		if(!e.model.typeClass && e.model.vlc) {
			FmsUtils.setSpeedClass(e.model, e.model.vlc);
		}

		$scope.changeMarker(e.model, switchName);
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
	 * Sidebar에서 Fleet 조회시
	 */
	var rootScopeListener1 = $rootScope.$on('monitor-fleet-list-change', function(evt, fleetItems) {
		$scope.viewMode = 'FLEET';

		if(fleetItems) {
			$scope.refreshFleets(fleetItems);
		}
	});

	/**
	 * Sidebar Fleet 그리드의 Trip 클릭시
	 */
	var rootScopeListener2 = $rootScope.$on('monitor-fleet-trip-change', function(evt, fleet) {
		$scope.goTrip(fleet.trip_id);
	});

	/**
	 * Sidebar Fleet 그리드의 Fleet 클릭시
	 */
	var rootScopeListener3 = $rootScope.$on('monitor-fleet-info-change', function(evt, fleet) {
		if($scope.viewMode == 'FLEET') {
			var marker = $scope.fleetToMarker(fleet);
			$scope.changeMarker(marker, 'showFleetInfo');

		} else if($scope.viewMode == 'TRIP' || $scope.viewMode == 'EVENT') {
			if(fleet.trip_id) 
				$scope.goTrip(fleet.trip_id);
		} 
	});

	/**
	 * Infobar Trip 그리드의 Trip 선택시
	 */
	var rootScopeListener4 = $rootScope.$on('monitor-info-trip-change', function(evt, trip) {
		$scope.goTrip(trip.id);
	});

	/**
	 * Sidebar에서 Event 조회시
	 */
	var rootScopeListener5 = $rootScope.$on('monitor-event-list-change', function(evt, eventItems) {
		$scope.viewMode = 'EVENT';

		if(eventItems && eventItems.length > 0) {
			$scope.refreshEvents(eventItems);
		}
	});

	/**
	 * Sidebar Event 그리드의 Trip 클릭시
	 */
	var rootScopeListener6 = $rootScope.$on('monitor-event-trip-change', function(evt, eventData) {
		var marker = $scope.eventToMarker(eventData);
		$scope.goTrip(eventData.tid, function() {
			$scope.changeMarker(marker, 'showEventInfo');
		});
	});

	/**
	 * Sidebar Event 그리드의 Event 선택시
	 */
	var rootScopeListener7 = $rootScope.$on('monitor-event-info-change', function(evt, eventData) {
		var marker = $scope.eventToMarker(eventData);
		$scope.changeMarker(marker, 'showEventInfo');
	});

	/**
	 * Scope destroy시 timeout 제거 
	 */
	$scope.$on('$destroy', function(event) {
		$interval.cancel();
		rootScopeListener1();
		rootScopeListener2();
		rootScopeListener3();
		rootScopeListener4();
		rootScopeListener5();
		rootScopeListener6();
		rootScopeListener7();
		$scope.clearAll(null);
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
	 * View Mode - FLEET, TRIP, EVENT
	 */
	$scope.viewMode = 'FLEET';

	/**
	 * map을 refresh
	 */
	$scope.refreshMap = function() {
		if(!$scope.isSwitchOn()) {
			if($scope.viewMode == 'FLEET') {
				$scope.$emit('monitor-refresh-fleet', 1);

			} else if($scope.viewMode == 'TRIP') {
				if($scope.currentTripId) {
					$scope.goTrip($scope.currentTripId);
				}

			} else if($scope.viewMode == 'EVENT') {
				$scope.$emit('monitor-refresh-event', 1);
			}			
		}
	};

	/**
	 * start timer
	 */
	$scope.refreshTimer();

});