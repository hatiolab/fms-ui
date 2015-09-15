angular.module('fmsGeofence')
  .controller('GeofenceRefreshControlCtrl', function ($rootScope, $scope, $timeout) {
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
			$scope.$emit('geofence-refresh-options-change', $scope.refreshOption);
		});
	
	}).controller('GeofenceViewMapCtrl', function($rootScope, $scope, $element, $timeout, ConstantSpeed, FmsUtils, RestApi, StorageUtils) {

		/**
		 * Map option
		 * 
		 * @type {Object}
		 */
		$scope.mapOption = { center: StorageUtils.getGeofenceBasicLoc(), zoom: 9, fit : false };
		/**
		 * Map Type Control Option
		 */
		$scope.mapTypeControlOptions = {
			mapTypeControlOptions : { position: google.maps.ControlPosition.TOP_CENTER }
		};
		/**
	   	 * Map Refresh 여부, Map Refresh Interval, Map Auto Fit 여부 
	     * 
	     * @type {Object}
	     */
	  	$scope.refreshOption = { refresh : true, interval : 1, autoFit : true };
		/**
		 * map control
		 *
		 * @type {Object}
		 */
		$scope.mapControl = {}; 
		/**
		 * marker control
		 *
		 * @type {Object}
		 */
		$scope.markerControl = {};
		/**
		 * Markers
		 * 
		 * @type {Array}
		 */
		$scope.markers = [],
		/**
		 * Selected Marker
		 * 
		 * @type {Object}
		 */
		$scope.selectedMarker = null;
		/**
		 * Selected geofence
		 * 
		 * @type {Object}
		 */
		$scope.geofence = { id : '', name : '', description : '' };
		/**
		 * window show / hide switch model
		 *
		 * @type {Object}
		 */
		$scope.windowSwitch = { showFleetInfo : false, showEventInfo : false };

		/**
		 * Polygon option
		 *
		 * @type {Object}
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
			if(!paths || paths.length == 0) {
				$scope.mapOption.center = StorageUtils.getGeofenceBasicLoc();
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
			if(fleets && fleets.length > 0) {
				for(var i = 0 ; i < fleets.length ; i++) {
					var marker = $scope.fleetToMarker(fleets[i]);
					$scope.addMarker(marker);
				}
			}

			$scope.setBounds();
		};

		/**
		 * Set Bounds
		 */
		$scope.setBounds = function() {
			if($scope.polygon.path.length == 0)
				return;

			var startPoint = new google.maps.LatLng($scope.polygon.path[0].latitude, $scope.polygon.path[0].longitude);
			var bounds = new google.maps.LatLngBounds(startPoint, startPoint);

			angular.forEach($scope.polygon.path, function(path) {
				bounds.extend(new google.maps.LatLng(path.latitude, path.longitude));
			});

			var center = { latitude : bounds.getCenter().G, longitude : bounds.getCenter().K };
			StorageUtils.setGeofenceBasicLoc(center.latitude, center.longitude);

			if($scope.refreshOption.autoFit) {
				$scope.mapControl.getGMap().fitBounds(bounds);
			} else {
				$scope.mapOption.center = center;
			}
		};

		/**
		 * Refresh Event Markers
		 */
		$scope.refreshEvents = function(events) {
			if(events && events.length > 0) {
				for(var i = 0 ; i < events.length ; i++) {
					var marker = $scope.eventToMarker(events[i]);
					$scope.addMarker(marker);
				}
			}
		};

		/**
		 * Refresh Events Only
		 */
		$scope.refreshEventsOnly = function(events) {
			var newMarkers = $scope.markers.filter(function(marker) {
				return marker.name !== undefined;
			});

			newMarkers = newMarkers.concat(events);
			$scope.clearAllMarkers();
			$scope.markers = newMarkers;
		};

		/**
		 * 지도 초기화 
		 */
		$scope.clearAll = function() {
			// 선택된 마커 해제 
			$scope.changeMarker(null);

			// clear markers
			$scope.clearAllMarkers();

			// polygon clean
			$scope.clearPolygon();
		};

		/**
		 * Clear All Markers
		 */
		$scope.clearAllMarkers = function() {
			if($scope.markerControl && $scope.markerControl.getGMarkers) {
				var gMarkers = $scope.markerControl.getGMarkers();
				angular.forEach(gMarkers, function(marker) { marker.setMap(null); });
				$scope.markerControl.getGMarkers().splice(0, gMarkers.length);
				$scope.markerControl.clean();
				angular.forEach($scope.markers, function(marker) { marker = null; });
				$scope.markers.splice(0, $scope.markers.length);
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
		 * convert event to marker
		 */
		$scope.eventToMarker = function(evt) {
			var marker = angular.copy(evt);
			marker._id = evt.id + '-' + evt.typ;
			marker.latitude = evt.lat;
			marker.longitude = evt.lng;
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
		 * Event Marker Icon
		 */
		$scope.getEventMarkerIcon = function(evt) {
			var icon = 'assets/event_';
			if(evt.typ == 'I') {
				icon += 'geofence_in.png';

			} else if(evt.typ == 'O') {
				icon += 'geofence_out.png';
			} 

			return icon;
		};

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
			if($scope.geofence && $scope.geofence.id && !$scope.isSwitchOn()) {
				$scope.$emit('geofence-map-refresh-request', $scope.geofence);
			}

			$scope.refreshTimer();	
		};

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
		 * Sidebar Event 그리드의 Event 선택시
		 */
		var rootScopeListener1 = $rootScope.$on('geofence-event-info-change', function(evt, eventData) {
			$scope.switchOffAll();
			var marker = $scope.eventToMarker(eventData);
			$scope.changeMarker(marker, 'showEventInfo');
		});

		/**
		 * Refresh Option이 변경되었을 때 
		 */
		var rootScopeListener2 = $rootScope.$on('geofence-refresh-options-change', function(evt, refreshOption) {
			$scope.refreshOption = refreshOption;
			if($scope.refreshOption.refresh) {
				$scope.refreshTimer();
			} else {
				$timeout.cancel();
			}
		});

		/**
		 * Geofence item change
		 * 
		 * @param  {String}
		 * @param  handler function
		 */
		var rootScopeListener3 = $rootScope.$on('geofence-item-change', function(event, geofence, polygons, fleets, events) {
			if(geofence) {
				$scope.clearAll();
				$scope.geofence = geofence;
				$scope.setPolygon(polygons);
				$scope.refreshFleets(fleets);
				$scope.refreshEvents(events);
			}
		});

		/**
		 * Geofence events change
		 * 
		 * @param  {String}
		 * @param  handler function
		 */
		var rootScopeListener4 = $rootScope.$on('geofence-event-list-change', function(event, geofence, events) {
			$scope.refreshEventsOnly(events);
		});		

		/**
		 * Scope destroy시 timeout 제거 
		 */
		$scope.$on('$destroy', function(event) {
			$timeout.cancel();
			$scope.clearAll();		
			rootScopeListener1();
			rootScopeListener2();
			rootScopeListener3();
			rootScopeListener4();
		});

		//------------------------------- E N D ----------------------------------------
	});