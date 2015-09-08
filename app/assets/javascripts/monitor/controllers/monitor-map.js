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
	$scope.refreshOption = { refresh : true, interval : 1, autoFit : true };

	/**
	 * 1. Refresh 여부 값을 Setting에서 가져와서 초기화, 
	 * 2. 여기서 Refresh 처리한 후 요청만 emit하기 
	 */
	$scope.$watchCollection('refreshOption', function(event) {
		$scope.$emit('monitor-refresh-options-change', $scope.refreshOption);
	});

}).controller('MonitorMapCtrl', function($rootScope, $scope, $element, $timeout, ConstantSpeed, FmsUtils, ModalUtils, RestApi) {
	
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
	$scope.mapOption = { 
		mapTypeControlOptions : { position: google.maps.ControlPosition.TOP_CENTER },
		center : { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }, 
		zoom : 9, 
		fit : false 
	};
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
	$scope.refreshOption = { refresh : true, interval : 1, autoFit : true };
	/**
	 * window show / hide switch model
	 */
	$scope.windowSwitch = { 
		showFleetInfo : false,
		showTripInfo : false,
		showBatchInfo : false,
		showTrackInfo : false,
		showEventInfo : false,
		showMovieInfo : false
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
	 * Ready Progress Bar : 서버 사이드 호출 전 
	 */
	$scope.readyProgress = function(msg) {
		if(!$scope.progressBar) {
			$scope.initProgress();
		}

		$scope.progressBar.ready(msg === undefined ? 'Loading data ...' : msg);
	};	

	/**
	 * Start Progress Bar : 서버에서 데이터를 받은 후 시작 
	 */
	$scope.startProgress = function(maxCnt) {
		$scope.progressBar.start(maxCnt);
		$timeout($scope.monitorProgress, 100, true, maxCnt);
	};

	/**
	 * Fit Bounds
	 */
	$scope.fitBounds = function(callback) {
		if($scope.markers && $scope.markers.length > 0) {
			var startPoint = new google.maps.LatLng($scope.markers[0].lat, $scope.markers[0].lng);
			var bounds = new google.maps.LatLngBounds(startPoint, startPoint);

			angular.forEach($scope.markers, function(marker) {
				bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
			});

			if($scope.refreshOption.autoFit) {
				$scope.mapControl.getGMap().fitBounds(bounds);
			} else {
				$scope.mapOption.center = { latitude: bounds.getCenter().G, longitude: bounds.getCenter().K };
			}

			if(callback) {
				$timeout(callback, 1000);
			}
		}
	};

	/**
	 * Monitor Progressing ...
	 */
	$scope.monitorProgress = function(totalMarkerCount) {
		if($scope.markerControl && $scope.markerControl.getGMarkers) {
			var drawingCount = $scope.markerControl.getGMarkers().length;
			if(drawingCount >= totalMarkerCount - 3) {
				$scope.progressBar.setCurrent(drawingCount);
				$scope.progressBar.hide();
			} else {
				$scope.progressBar.setCurrent(drawingCount);
				$timeout($scope.monitorProgress, 100, true, totalMarkerCount);
			}
		} else {
			$scope.progressBar.hide();
		}
	};

	/**
	 * Refresh Fleet Markers
	 */
	$scope.refreshFleets = function(fleets) {
		if(fleets && fleets.length > 0) {
			// ready progress
			$scope.readyProgress();
			// clear all map data
			$scope.clearAll(null);
			// start progress ...		
			$scope.startProgress(fleets.length);
			
			for(var i = 0 ; i < fleets.length ; i++) {
				var marker = $scope.fleetToMarker(fleets[i]);
				$scope.addMarker(marker);
			}

			$scope.fitBounds();
		}
	};

	/**
	 * Get address from lat, lng
	 */
	$scope.getAddress = function(marker, lat, lng, callback) {
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
	 			divAddr.innerHTML = address;
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
			// ready progress
			$scope.readyProgress();
			// clear all map data 
			$scope.clearAll(null);			
			// start progress ...		
			$scope.startProgress(eventDataList.length);

			for(var i = 0 ; i < eventDataList.length ; i++) {
				var eventData = eventDataList[i];
				var marker = $scope.eventToMarker(eventData);
				$scope.addMarker(marker);
			}

			$scope.fitBounds();
		}
	};	

	/**
	 * 지도 초기화 
	 */
	$scope.clearAll = function(center) {
		// 선택된 마커 해제 
		$scope.changeMarker(null);

		// clear markers
		if($scope.markerControl && $scope.markerControl.getGMarkers) {
			var gMarkers = $scope.markerControl.getGMarkers();
			angular.forEach(gMarkers, function(marker) { marker.setMap(null); });
			$scope.markerControl.getGMarkers().splice(0, gMarkers.length);
			$scope.markerControl.clean();
			angular.forEach($scope.markers, function(marker) { marker = null; });
			$scope.markers.splice(0, $scope.markers.length);
		}

		// clear polylines
		if($scope.polylineControl && $scope.polylineControl.getPlurals) {
			var plurals = $scope.polylineControl.getPlurals().values();
			for(var i = 0 ; i < plurals.length ; i++) {
				var plural = plurals[i];

				if(plural && plural.clonedModel) {
					var paths = plural.clonedModel.path;
					angular.forEach(paths, function(path) { path = null; });
					plural.clonedModel.path.splice(0, paths.length);
				}

				if(plural && plural.gObject) {
					plural.gObject.setMap(null);
				}
			}

			$scope.polylineControl.clean();
		}

		angular.forEach($scope.polylines, function(polyline) { polyline = null; });
		$scope.polylines.splice(0, $scope.polylines.length);

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
		// 0. ready progress
		$scope.readyProgress();
		// 1. invoke rest api
		RestApi.get('/trips/' + tripId + '/trip_set.json', {}, 
			// success
			function(dataSet) {
				// 1. filter tracks
				var tripSet = $scope.filterTrip(dataSet);
				// 2. 호출이 완료되었으면 진행 + 1
				$scope.progressBar.updateBar(1);
				// 3. Data
				var trip = tripSet[0];
				var batches = tripSet[1];
				var tracks = tripSet[2];				
				// 4. Total Count : Track Count
				$scope.startProgress(tracks.length);
				// 5. 호출이 완료되었으면 진행 + 1
				$scope.progressBar.updateBar(1);
				// 6. Map Data Reset
				$scope.clearAll(null);
				// 7. Map Data Reset이 되었다면 진행 + 1
				$scope.progressBar.updateBar(1);
				// 8. trip 그리기 
				$scope.showTrip(trip, batches, tracks, callback);
			// error
			}, function(error) {
				$scope.progressBar.hide();
			});
	};

	/**
	 * Trip, Batch와 Track이 포인트가 일치하는 Track은 제거하고 소팅하여 리턴 
	 */
	$scope.filterTrip = function(tripDataSet) {
		var trip = tripDataSet.trip;
		var batches = tripDataSet.batches;
		var tracks = tripDataSet.tracks.concat(tripDataSet.events);

		// sort by time tracks, events
		tracks.sort(function(a, b) {
			var aTime = a.ttm ? a.ttm : a.etm;
			var bTime = b.ttm ? b.ttm : b.etm;
			return (aTime < bTime) ? -1 : (aTime > bTime) ? 1 : 0;
		});

		return [trip, batches, tracks];
	};

	/**
	 * Show Trip
	 */
	$scope.showTrip = function(trip, batches, tracks, callback) {

		// 1. trip start
		$scope.addMarker($scope.tripToMarker(trip, 'start'));
		var batchSize = batches.length;

		// 2. batches
		for(var i = 0 ; i < batchSize ; i++) {
			var batch = batches[i];
			var batchLine = $scope.addBatchLine(batch);

			// 2.1 batch start
			//if(i > 0) {
				var startBatchMarker = $scope.batchToMarker(batch, 'start');
				$scope.addMarker(startBatchMarker);
				batchLine.path.push(startBatchMarker);
			//}

			// 2.2 tracks & events : 시간순
			var trackSize = tracks.length;
			for(var j = 0 ; j < trackSize ; j++) {
				var m = tracks[j];
				if(m.bid == batch.id) {
					var trackMarker = m.ttm ? $scope.trackToMarker(m) : $scope.eventToMarker(m);
					$scope.addMarker(trackMarker);
					batchLine.path.push(trackMarker);
				}
			}

			// 2.3 batch end
			//if(i != batchSize - 1) {
				var endBatchMarker = $scope.batchToMarker(batch, 'end');
				$scope.addMarker(endBatchMarker);
				batchLine.path.push(endBatchMarker);
			//}

			$scope.polylines.push(batchLine);
		}

		// 3. trip end
		if(trip.sts == '2') {
			$scope.addMarker($scope.tripToMarker(trip, 'end'));	
		} else {
			$scope.addMarker($scope.lastTripToMarker(trip));
		}

		// 5. Speed Class 설정 
		FmsUtils.setSpeedClass(trip, trip.vlc);

		// 6. 현재 선택된 Trip을 변경 
		$scope.changeCurrentTrip(trip);

		// 7. fit bounds
		$scope.fitBounds(callback);
	};

	/**
	 * Batch Line 추가
	 *  
	 * @param {Object}
	 */
	$scope.addBatchLine = function(batch) {
		return {
			id : batch.id, 
			geodesic : true, 
			visible : true,
			stroke : { color: '#FF0000', opacity: 1.0, weight: 4 },
			path : []
		};
	};

	/**
	 * 현재 선택된 Trip을 변경한다.
	 * 
	 */
	$scope.changeCurrentTrip = function(newTrip) {
		// TODO 아래 주석. 체크 필요 
		// if($scope.currentTripId != newTrip.id) {
		$scope.currentTripId = newTrip.id;
		// send trip information to infobar
		$rootScope.$broadcast('monitor-trip-info-change', newTrip);
		$scope.getAddress(newTrip, newTrip.s_lat, newTrip.s_lng, function(marker, address) {
 			newTrip['fromAddress'] = address;
		});
		// }
	};

	/**
	 * set marker unique id and add marker
	 */
	$scope.addMarker = function(marker) {
		$scope.markers.push(marker);
		return marker;
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
			// showMovieInfo
			if(marker.vdo && marker.vdo != '') {
				$scope.changeMovieMarker(marker);

			// other
			} else {
				if(marker.latitude != 0 && marker.longitude != 0) {
					$scope.getAddress(marker, null, null, $scope.updateMapWindowAddress);
				}

				if(marker.f_img && marker.f_img != '' && marker.f_img.indexOf('http') < 0) {
					marker.f_img = CONTENT_BASE_URL + marker.f_img;
					marker.r_img = CONTENT_BASE_URL + marker.r_img;
				}

				$scope.selectedMarker = marker;
				$scope.switchOn(switchName);
			}
		}
	};

	/**
	 * Movie Marker를 변경한다.
	 */
	$scope.changeMovieMarker = function(marker) {
		if(marker.vdo.indexOf('http') < 0) {
			marker.vdo = CONTENT_BASE_URL + marker.vdo;
			marker.f_vdo = CONTENT_BASE_URL + marker.f_vdo;
			marker.r_vdo = CONTENT_BASE_URL + marker.r_vdo;
			marker.ado = CONTENT_BASE_URL + marker.ado;
		}

		if(marker.latitude != 0 && marker.longitude != 0) {
			$scope.readyProgress('Loading Movie....');
			$scope.startProgressForMovie();

			$scope.getAddress(marker, null, null, function(marker, address) {
				$scope.monitorProgressForMovie(true);
				marker.address = address;
				$scope.selectedMarker = marker;
				$scope.switchOn('showMovieInfo');
			});
		}	else {
			$scope.selectedMarker = marker;
			$scope.switchOn('showMovieInfo');			
		}
	};

	/**
	 * 동영상 로딩 시작 ...
	 */
	$scope.startProgressForMovie = function() {
		$scope.progressBar.start(100);
		$timeout($scope.monitorProgressForMovie, 100, true, false);
	};

	/**
	 * Monitor Progressing ...
	 */
	$scope.monitorProgressForMovie = function(stopFlag) {
		if(stopFlag) {
			$scope.progressBar.setCurrent(100);
			$scope.progressBar.hide();
		} else {
			$scope.progressBar.setCurrent($scope.progressBar.getCurrent() + 1);
			$timeout($scope.monitorProgressForMovie, 100, true, false);
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
	};

	/**
	 * Toggle Highlight Batch Line
	 * 
	 * @param  {String}
	 */
	$scope.toggleHighlightBatchLine = function(batchId) {
		var batchLines = $scope.polylines.filter(function(polyline) {
			return polyline.id == batchId;
		});

		if(batchLines && batchLines.length > 0) {
			var batchLine = batchLines[0];
			if(batchLine.stroke.weight == 4) {
				batchLine.stroke.color = '#0101DF';
				batchLine.stroke.weight = 8;
			} else {
				batchLine.stroke.color = '#FF0000';
				batchLine.stroke.weight = 4;
			}
		}
	};

	/**
	 * convert fleet to marker
	 */
	$scope.fleetToMarker = function(fleet) {
		var marker = angular.copy(fleet);
		marker._id = fleet.id;
		marker.latitude = fleet.lat;
		marker.longitude = fleet.lng;
		$scope.getFleetMarkerIcon(marker);
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
		marker._id = 'trip-' + trip.id + '-' + type;
		marker.latitude = (type == 'start') ? trip.s_lat : trip.lat;
		marker.longitude = (type == 'start') ? trip.s_lng : trip.lng;
		$scope.getTripMarkerIcon(marker, type);
		marker.type = type;
		marker.options = { zIndex : google.maps.Marker.MAX_ZINDEX + 1 };
		marker.events = {
			click : function(e) {
				$scope.addMarkerClickEvent(e, 'showTripInfo');
			}/*,
			mouseover : function(e) {
				$scope.addTooltipEvent(e);
			},
			mouseout : function(e) {
				$scope.switchOffAll();
			}*/
		};
		return marker;
	};	

	/**
	 * Trip을 Fleet으로 변환 
	 */
	$scope.lastTripToMarker = function(trip) {
		var marker = null;

		var tracks = $scope.markers.filter(function(m) { return m.ttm && m.lat == trip.lat && m.lng == trip.lng; });
		if(tracks && tracks.length > 0) {
			track = tracks[tracks.length - 1];
			marker = $scope.trackToMarker(track);
			marker.ttm = trip.etm;
		} else {
			marker = $scope.tripToMarker(trip, 'end');
		}

		var type = 'end';
		marker._id = 'trip-' + trip.id + '-' + type;
		$scope.getFleetMarkerIcon(marker);
		marker.title = 'Trip (End)';
		marker.type = type;
		marker.options = { zIndex : google.maps.Marker.MAX_ZINDEX + 1 };
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
		$scope.getBatchMarkerIcon(marker, type);
		marker.type = type;
		marker.options = { zIndex : google.maps.Marker.MAX_ZINDEX - 1 };
		marker.events = {
			click : function(e) {
				$scope.addMarkerClickEvent(e, 'showBatchInfo');
			},
			mouseover : function(e) {
				$scope.toggleHighlightBatchLine(batch.id);
			},
			mouseout : function(e) {
				$scope.toggleHighlightBatchLine(batch.id);
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
		marker.ctm = track.ctm;
		marker.utm = track.utm;
		marker.ttm = track.ttm;
		$scope.getTrackMarkerIcon(marker);

		marker.events = {
			click : function(e) {
				$scope.addMarkerClickEvent(e, 'showTrackInfo');
			},
			mouseover : function(e) {
				$scope.toggleHighlightBatchLine(marker.bid);
			},
			mouseout : function(e) {
				$scope.toggleHighlightBatchLine(marker.bid);
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
		$scope.getEventMarkerIcon(marker);

		if(marker.geofence && marker.geofence.name) {
			marker.geoInfo = marker.geofence.name + '/' + (marker.typ == 'I' ? 'In' : 'Out');
		} else {
			marker.geoInfo = 'N/A';
		}

		marker.events = {
			click : function(e) {
				$scope.addMarkerClickEvent(e, 'showEventInfo');
			},
			mouseover : function(e) {
				$scope.toggleHighlightBatchLine(marker.bid);
			},
			mouseout : function(e) {
				$scope.toggleHighlightBatchLine(marker.bid);
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
		fleet.icon = '/assets/fleet_' + level + '.png';
		fleet.title = 'Track (' + speedLevel + ')';
	};

	/**
	 * Trip Marker Icon
	 */
	$scope.getTripMarkerIcon = function(trip, type) {
		trip.icon = '/assets/trip' + type + '.png';
		trip.title = 'Trip (' + type + ')';
	};

	/**
	 * Batch Marker Icon
	 */
	$scope.getBatchMarkerIcon = function(batch, type) {
		batch.icon = '/assets/batch' + type + '.png';
		batch.title = 'Batch (' + type + ')';
	};

	/**
	 * Event Marker Icon
	 */
	$scope.getEventMarkerIcon = function(evt) {
		var icon = 'assets/event_';
		if(evt.typ == 'B') {
			evt.icon = icon + 'emergency.png';
			evt.title = 'Event (Emergency)';

		} else if(evt.typ == 'G') {
			evt.icon = icon + 'g_sensor.png';
			evt.title = 'Event (Impact)';

		} else if(evt.typ == 'I') {
			evt.icon = icon + 'geofence_in.png';
			evt.title = 'Event (Geofence IN)';

		} else if(evt.typ == 'O') {
			evt.icon = icon + 'geofence_out.png';
			evt.title = 'Event (Geofence OUT)';

		} else if(evt.typ == 'V') {
			evt.icon = icon + 'overspeed.png';
			evt.title = 'Event (Over Speed)';
		}
	};

	/**
	 * Track Marker Icon
	 */
	$scope.getTrackMarkerIcon = function(track) {
		var prefix = 'assets/track_';
		if(track.f_img || track.r_img)
			prefix += 'i_';

		var speedLevel = $rootScope.getSpeedLevel(track.vlc);
		prefix += speedLevel.split('_')[1];
		track.icon = prefix + '.png';
		track.title = 'Track (' + speedLevel + ')';
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
		// if($scope.viewMode != 'TRIP' || trip.id != $scope.currentTripId) {
			$scope.goTrip(trip.id);
		// }
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
	 * Content View Resize 이벤트  
	 */
	$scope.$on('content-view-resize', function(evt) {
		if($scope.mapControl) {
			var gmap = $scope.mapControl.getGMap();
			google.maps.event.trigger(gmap, 'resize');
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
			var interval = $scope.refreshOption.interval >= 1 ? $scope.refreshOption.interval : 1;
			$timeout($scope.refreshMap, interval * 60 * 1000);
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

		$scope.refreshTimer();	
	};

});