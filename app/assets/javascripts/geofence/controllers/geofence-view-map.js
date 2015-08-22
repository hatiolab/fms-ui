angular.module('fmsGeofence')
	.controller('GeofenceViewMapCtrl', function($rootScope, $scope, $element, $timeout, ConstantSpeed, FmsUtils, RestApi) {

		/**
		 * Selected geofence
		 * @type {Object}
		 */
		$scope.geofence = { id : '', name : '', description : '' };
		/**
		 * map option
		 * @type {Object}
		 */
		$scope.mapOption = { center: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }, zoom: 9 };
		/**
		 * map control
		 * @type {Object}
		 */
		$scope.mapControl = {}; 
		/**
		 * Markers
		 * @type {Array}
		 */
		$scope.markers = [], 
		/**
		 * Selected Marker
		 * @type {Array}
		 */
		$scope.selectedMarker = null;

		/**
		 * Polygon option
		 */
		$scope.polygon = {
			path : [],
			option : {
				static : true,
				stroke : { color : '#ff0000', weight : 5 },
				visible : true,
				geodesic : false,
				fill : { color : '#ff0000', opacity : 0.45 },
				editable : false,
				draggable : false,
			}
		};

		/**
		 * Clear Polygon
		 * 
		 * @return N/A
		 */
		$scope.clearPolygon = function() {
			var polyPath = $scope.polygon.path;

			if(polyPath && polyPath.length > 0) {
				angular.forEach(polyPath, function(path) { path = null; });
				$scope.polygon.path = [];
			}
		};

		/**
		 * Set Polygon Type
		 * 
		 * @param {Object}
		 */
		$scope.setPolygon = function(paths) {
			$scope.clearPolygon();

			if(!paths || paths.length == 0) {
				$scope.mapOption.center = { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG };
			} else {
				angular.forEach(paths, function(path) {
					$scope.polygon.path.push({ latitude : path.lat, longitude : path.lng });
				});
			}
		};

		/**
		 * Reset polygon
		 * 
		 * @return N/A
		 */
		$scope.resetPolygon = function() {
			$scope.clearPolygon();
			$scope.polygon.id = '';
			$scope.polygon.name = '';
			$scope.polygon.description = '';
		};

		/**
		 * Geofence item selected
		 * 
		 * @param  {String}
		 * @param  handler function
		 */
		var geofenceSelectionListener = $rootScope.$on('geofence-item-selected', function(event, geofence) {
			$scope.geofence = geofence;
			$scope.resetPolygon();

			// Get polygon
			RestApi.get('/polygons.json', { '_q[geofence_id-eq]' : geofence.id }, function(dataSet) {
				$scope.setPolygon(dataSet.items);
				// Search Fleets
				RestApi.list('/geofence_groups.json', { '_q[geofence_id-eq]' : geofence.id }, function(items) {
					var groupIdList = items.map(function(item) { return item.fleet_group_id });
					RestApi.list('/fleets.json', { '_q[fleet_group_id-in]' : groupIdList.join(',') }, function(list) {
						$scope.refreshFleets(list);
					});
				});
			});
		});

	  /**
	   * Destroy Scope - RootScope Event Listener 정리 
	   */
	  $scope.$on('$destroy', function(event) {
	    geofenceSelectionListener();
	  });

	//--------------------------------- E N D ------------------------------------
		
		/**
		 * 현재 선택된 Trip ID
		 */
		$scope.currentTripId = null;	
		/**
		 * View Mode - FLEET, TRIP, EVENT
		 */
		$scope.viewMode = 'FLEET';	
		/**
		 * map option
		 */
		$scope.mapOption = { center: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }, zoom: 9, fit : false };
		/**
		 * map marker models for fleets, map polyline model for tracks, currently selected marker, progress bar
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
			$scope.clearAll(null);

			if(fleets && fleets.length > 0) {
				for(var i = 0 ; i < fleets.length ; i++) {
					var marker = $scope.fleetToMarker(fleets[i]);
					$scope.addMarker(marker);
				}
			}

			$scope.setBounds();
		};

		$scope.setBounds = function() {
			if($scope.markers.length == 0 && $scope.polygon.path.length == 0)
				return;

			var startPoint = ($scope.markers && $scope.markers.length > 0) ? 
											new google.maps.LatLng($scope.markers[0].lat, $scope.markers[0].lng) :
											new google.maps.LatLng($scope.polygon.path[0].latitude, $scope.polygon.path[0].longitude);
			var bounds = new google.maps.LatLngBounds(startPoint, startPoint);

			angular.forEach($scope.markers, function(marker) {
				bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
			});

			angular.forEach($scope.polygon.path, function(path) {
				bounds.extend(new google.maps.LatLng(path.latitude, path.longitude));
			});

			var gmap = $scope.mapControl.getGMap();
			gmap.fitBounds(bounds);			
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
			$scope.clearAll(null);

			if(eventDataList && eventDataList.length > 0) {
				for(var i = 0 ; i < eventDataList.length ; i++) {
					var eventData = eventDataList[i];
					var marker = $scope.eventToMarker(eventData);
					$scope.addMarker(marker);
				}
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
		};

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
		var rootScopeListener1 = $rootScope.$on('geofence-fleet-list-change', function(evt, fleetItems) {
			$scope.viewMode = 'FLEET';

			if(fleetItems) {
				$scope.refreshFleets(fleetItems);
			}
		});

		/**
		 * Sidebar Fleet 그리드의 Trip 클릭시
		 */
		var rootScopeListener2 = $rootScope.$on('geofence-fleet-trip-change', function(evt, fleet) {
			$scope.goTrip(fleet.trip_id);
		});

		/**
		 * Sidebar Fleet 그리드의 Fleet 클릭시
		 */
		var rootScopeListener3 = $rootScope.$on('geofence-fleet-info-change', function(evt, fleet) {
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
		var rootScopeListener4 = $rootScope.$on('geofence-info-trip-change', function(evt, trip) {
			if($scope.viewMode != 'TRIP' || trip.id != $scope.currentTripId) {
				$scope.goTrip(trip.id);
			}
		});

		/**
		 * Sidebar에서 Event 조회시
		 */
		var rootScopeListener5 = $rootScope.$on('geofence-event-list-change', function(evt, eventItems) {
			$scope.viewMode = 'EVENT';

			if(eventItems && eventItems.length > 0) {
				$scope.refreshEvents(eventItems);
			}
		});

		/**
		 * Sidebar Event 그리드의 Trip 클릭시
		 */
		var rootScopeListener6 = $rootScope.$on('geofence-event-trip-change', function(evt, eventData) {
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
		var rootScopeListener7 = $rootScope.$on('geofence-event-info-change', function(evt, eventData) {
			$scope.switchOffAll();
			var marker = $scope.eventToMarker(eventData);
			$scope.changeMarker(marker, 'showEventInfo');
		});

		/**
		 * Scope destroy시 timeout 제거 
		 */
		$scope.$on('$destroy', function(event) {
			rootScopeListener1();
			rootScopeListener2();
			rootScopeListener3();
			rootScopeListener4();
			rootScopeListener5();
			rootScopeListener6();
			rootScopeListener7();
			$scope.clearAll(null);
		});

		//
	});