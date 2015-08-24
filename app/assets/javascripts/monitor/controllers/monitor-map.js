angular.module('fmsMonitor').controller('MapModeControlCtrl', function ($rootScope, $scope, $timeout) {

	$scope.viewModes = [ 
		{ mode: 'FLEET', name: 'FLEET', eventName : 'monitor-refresh-fleet', cls : 'btn-primary' }, 
		{ mode: 'EVENT', name: 'ALERT', eventName : 'monitor-refresh-event', cls : '' }, 
		{ mode: 'TRIP',  name: 'TRIP',  eventName : 'monitor-refresh-trip',  cls : '' } 
	];

	/**
	 * View 모드 변경 버튼 클릭시 View 모드 변경  
	 */
	$scope.changeViewMode = function(modeItem) {
		angular.forEach($scope.viewModes, function(viewMode) {
			if(viewMode.mode == modeItem.mode) {
				$scope.$emit(modeItem.eventName, '');
			}
		});		
	};

	/**
	 * View 모드가 변경되었는지 체크, 즉 이전에 선택된 것과 비교 
	 */
	$scope.checkChangeMode = function(mode) {
		for(var i = 0 ; i < $scope.viewModes.length ; i++) {
			var viewMode = $scope.viewModes[i];
			if(viewMode.cls != '' && viewMode.mode == mode) {
				return false;
			} 
		}

		return true;
	};

	/**
	 * Button Class 변경 
	 */
	$scope.changeButtonClass = function(mode) {
		for(var i = 0 ; i < $scope.viewModes.length ; i++) {
			var viewMode = $scope.viewModes[i];
			viewMode.cls = (viewMode.mode == mode) ? 'btn-primary' : '';
		}
	};

	/**
	 * mode change listener
	 */
	var modeChangeListener = $rootScope.$on('monitor-view-mode-change', function(event, mode) {
		if($scope.checkChangeMode(mode)) {
			$scope.changeButtonClass(mode);
		}
	});

	/**
	 * Scope destroy시 timeout 제거 
	 */
	$scope.$on('$destroy', function(event) {
		modeChangeListener();
	});	

}).controller('MapRefreshControlCtrl', function ($rootScope, $scope, $timeout) {
	/**
	 * Map Refresh 여부, Map Refresh Interval, Map Auto Fit 여부 
	 * @type {Object}
	 */
	$scope.refreshOption = { refresh : false, interval : 10, autoFit : true };

	/**
	 * 1. Refresh 여부 값을 Setting에서 가져와서 초기화, 
	 * 2. 여기서 Refresh 처리한 후 요청만 emit하기 
	 */
	$scope.$watchCollection('refreshOption', function(event) {
		$scope.$emit('monitor-refresh-options-change', $scope.refreshOption);
	});

	/**
	 * Refresh 설정이 변경된 경우 
	 */	
	$scope.$on('setting-map_refresh-change', function(evt, value) {
		$scope.refreshOption.refresh = (!value || value == 'N') ? false : true;
	});

	/**
	 * Refresh Interval 설정이 변경된 경우 
	 */	
	$scope.$on('setting-map_refresh_interval-change', function(evt, value) {
		$scope.refreshOption.interval = parseInt(value);
	});

	var refreshYn = $rootScope.getSetting('map_refresh');

	$timeout(function() {
		$scope.refreshOption.refresh = (!refreshYn || refreshYn == 'N') ? false : true;
		$scope.refreshOption.interval = $rootScope.getIntSetting('map_refresh_interval');
	}, 5 * 1000);

}).controller('MonitorMapCtrl', function($rootScope, $scope, $element, $timeout, ConstantSpeed, FmsUtils, RestApi) {
	
	/**
	 * View Mode - FLEET, TRIP, EVENT
	 */
	$scope.viewMode = 'FLEET';	
	/**
	 * 현재 선택된 Trip ID
	 */
	$scope.currentTripId = null;
	/**
	 * map option
	 */
	$scope.mapOption = { center: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }, zoom: 9, fit : false };
	/**
	 * map marker models for fleets, map polyline model for tracks, currently selected marker, progress bar
	 */
	$scope.markers = [], $scope.polylines = [], $scope.selectedMarker = null; $scope.progressBar = null;
	/**
	 * map control, marker control, polyline control
	 */
	$scope.mapControl = {}; $scope.markerControl = {}; $scope.polylineControl = {};
	/**
	 * Map Refresh 여부, Map Refresh Interval, Map Auto Fit 여부 
	 * @type {Object}
	 */
	$scope.refreshOption = { refresh : false, interval : 10, autoFit : true };
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
	 * Init Progress Bar
	 */
	$scope.initProgress = function() {
		if(!$scope.progressBar) {
			$scope.progressBar = new progressBar();
			var gmap = $scope.mapControl.getGMap();
			gmap.controls[google.maps.ControlPosition.CENTER].push($scope.progressBar.getDiv());
		}
	};

	/**
	 * Start Progress Bar
	 */
	$scope.startProgress = function(maxCnt) {
		if(!$scope.progressBar) {
			$scope.initProgress();
		}

		$scope.progressBar.start(maxCnt);
		$timeout($scope.monitorProgress, 100, true, maxCnt);
	};

	/**
	 * Fit Bounds
	 */
	$scope.fitBounds = function() {
		var gmap = $scope.mapControl.getGMap();

		if($scope.refreshOption.autoFit && $scope.markers && $scope.markers.length > 0) {
			var startPoint = new google.maps.LatLng($scope.markers[0].lat, $scope.markers[0].lng);
			var bounds = new google.maps.LatLngBounds(startPoint, startPoint);

			angular.forEach($scope.markers, function(marker) {
				bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
			});

			gmap.fitBounds(bounds);	
		}
	};

	/**
	 * Monitor Progressing ...
	 */
	$scope.monitorProgress = function(totalMarkerCount) {
		var gMarkerCount = $scope.markerControl.getGMarkers().length;
		if(gMarkerCount >= totalMarkerCount) {
			$scope.progressBar.setCurrent(gMarkerCount);
			$scope.progressBar.hide();
		} else {
			$scope.progressBar.setCurrent(gMarkerCount);
			$timeout($scope.monitorProgress, 100, true, totalMarkerCount);
		}
	};

	/**
	 * Refresh Fleet Markers
	 */
	$scope.refreshFleets = function(fleets) {
		if(fleets && fleets.length > 0) {
			// start progress ...		
			$scope.startProgress(fleets.length);
			$scope.clearAll(null);		
			
			for(var i = 0 ; i < fleets.length ; i++) {
				var marker = $scope.fleetToMarker(fleets[i]);
				$scope.addMarker(marker);
			}

			// fit bounds
			$scope.fitBounds();
		}
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
		if(eventDataList && eventDataList.length > 0) {
			// start progress ...		
			$scope.startProgress(eventDataList.length);
			$scope.clearAll(null);

			for(var i = 0 ; i < eventDataList.length ; i++) {
				var eventData = eventDataList[i];
				var marker = $scope.eventToMarker(eventData);
				$scope.addMarker(marker);
			}

			// fit bounds
			$scope.fitBounds();
		}
	};	

	/**
	 * 지도 초기화 
	 */
	$scope.clearAll = function(center) {
		// 선택된 마커 해제 
		$scope.changeMarker(null);

		// clear polylines
		angular.forEach($scope.polylines, function(polyline) { polyline = null; });
		$scope.polylines.splice(0, $scope.polylines.length);

		// clear markers
		if($scope.markerControl && $scope.markerControl.getGMarkers) {
			var gMarkers = $scope.markerControl.getGMarkers();
			angular.forEach(gMarkers, function(marker) { marker.setMap(null); });
			$scope.markerControl.getGMarkers().splice(0, gMarkers.length);
			$scope.markerControl.clean();
			angular.forEach($scope.markers, function(marker) { marker = null; });
			$scope.markers.splice(0, $scope.markers.length);
		}

		if(center) {
			$scope.mapOption.center = center;
		}
	};

	/**
	 * Move to trip of fleet
	 */
	$scope.goTrip = function(tripId, callback) {
		$scope.changeViewMode('TRIP');

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
			// start progress : Trip Count (1) + Batch Count + Track Count + Event Count
			$scope.startProgress(1 + dataSet.batches.length + dataSet.tracks.length + dataSet.events.length);			
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

		// fit bounds
		$scope.fitBounds();		

		if(callback) {
			// 0.5초 후 callback - event 선택 
			$timeout(callback, 500);
		}
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
		//$scope.progressBar.updateBar(1);
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
	 * View Mode를 변경한다. - FLEET, EVENT, TRIP
	 */
	$scope.changeViewMode = function(mode) {
		$scope.viewMode = mode;
		$scope.$emit('monitor-view-mode-change', mode);
	}

	/**
	 * Sidebar에서 Fleet 조회시
	 */
	var rootScopeListener1 = $rootScope.$on('monitor-fleet-list-change', function(evt, fleetItems) {
		$scope.changeViewMode('FLEET');

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
		if($scope.viewMode != 'TRIP' || trip.id != $scope.currentTripId) {
			$scope.goTrip(trip.id);
		}
	});

	/**
	 * Sidebar에서 Event 조회시
	 */
	var rootScopeListener5 = $rootScope.$on('monitor-event-list-change', function(evt, eventItems) {
		$scope.changeViewMode('EVENT');

		if(eventItems && eventItems.length > 0) {
			$scope.refreshEvents(eventItems);
		}
	});

	/**
	 * Sidebar Event 그리드의 Trip 클릭시
	 */
	var rootScopeListener6 = $rootScope.$on('monitor-event-trip-change', function(evt, eventData) {
		$scope.switchOffAll();
		var marker = $scope.eventToMarker(eventData);

		if($scope.viewMode == 'TRIP' && eventData.tid == $scope.currentTripId) {
			$scope.changeMarker(marker, 'showEventInfo');
		} else {
			$scope.goTrip(eventData.tid, function() {
				$scope.changeMarker(marker, 'showEventInfo');
			});			
		}
	});

	/**
	 * Sidebar Event 그리드의 Event 선택시
	 */
	var rootScopeListener7 = $rootScope.$on('monitor-event-info-change', function(evt, eventData) {
		$scope.switchOffAll();
		var marker = $scope.eventToMarker(eventData);
		$scope.changeMarker(marker, 'showEventInfo');
	});

	/**
	 * Refresh Option이 변경되었을 때 
	 */
	var rootScopeListener8 = $rootScope.$on('monitor-refresh-options-change', function(evt, refreshOption) {
		$scope.refreshOption = refreshOption;
		if($scope.refreshOption.refresh) {
			$scope.refreshTimer();
		} else {
			$timeout.cancel();
		}
	});

	/**
	 * Trip Refresh 이벤트  
	 */
	var rootScopeListener9 = $rootScope.$on('monitor-refresh-trip', function(evt, tripId) {
		if(tripId && tripId != '') {
			$scope.currentTripId = tripId;
		}

		if($scope.currentTripId) {
			$scope.goTrip($scope.currentTripId);
		}
	});

	/**
	 * Scope destroy시 timeout 제거 
	 */
	$scope.$on('$destroy', function(event) {
		$timeout.cancel();
		rootScopeListener1();
		rootScopeListener2();
		rootScopeListener3();
		rootScopeListener4();
		rootScopeListener5();
		rootScopeListener6();
		rootScopeListener7();
		rootScopeListener8();
		rootScopeListener9();
		$scope.clearAll(null);
	});

	/**
	 * Refresh timer를 시작 
	 */
	$scope.refreshTimer = function() {
		$timeout.cancel();
		if($scope.refreshOption.refresh && $scope.refreshOption.interval >= 1) {
			var interval = $scope.refreshOption.interval >= 10 ? $scope.refreshOption.interval : 10;
			$timeout($scope.refreshMap, interval * 1000);
		}
	};

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

});