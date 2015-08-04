angular.module('fmsGeofence')
	.controller('GeofenceItemCtrl', function($rootScope, $scope, $resource, $element, $interval, uiGmapIsReady, ConstantSpeed, FmsUtils, RestApi) {

		/**
		 * sidebar toggle
		 */
		$scope.isSidebarToggle = true;
		/**
		 * map option
		 */
		$scope.mapOption = { center: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }, zoom: 9 };
		/**
		 * map control
		 * @type {Object}
		 */
		$scope.mapControl = {};
		/**
		 * selected geofence
		 * 
		 * @type {Object}
		 */
		$scope.geofence = {id : '', name : '', description : ''};
		/**
		 * polygon option
		 */
		$scope.polygon = {
			path : [],
			option : {
				static : true,
				stroke : { color : '#ff0000', weight : 5 },
				visible : true,
				geodesic : false,
				fill : { color : '#ff0000', opacity : 0.45 },
				editable : true,
				draggable : false,
			}
		};

		/**
		 * [drawingManagerOptions description]
		 * @type {Object}
		 */
		$scope.drawingManagerOptions = {
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: true,
			drawingControlOptions: {
				position: google.maps.ControlPosition.TOP_CENTER,
				drawingModes: [
					google.maps.drawing.OverlayType.POLYGON
					//google.maps.drawing.OverlayType.MARKER,
					//google.maps.drawing.OverlayType.CIRCLE,
					//google.maps.drawing.OverlayType.POLYLINE,
					//google.maps.drawing.OverlayType.RECTANGLE
				]
			},
			polygonOptions: {
				fillColor: '#ff0000',
				fillOpacity: 1,
				strokeWeight: 5,
				clickable: false,
				editable: true,
				zIndex: 1
			}
		};

		/**
		 * [drawingManagerEvents description]
		 * @type {Object}
		 */
		$scope.drawingManagerEvents = {
			polygoncomplete: function(drawingManager, eventName, scope, args) {
				var polygon = args[0];
				var paths = polygon.getPath();
				$scope.clearPolygon();

				// set new polygon
				for (var i = 0 ; i < paths.length ; i++) {
					var path = paths.getAt(i);
					$scope.polygon.path.push({ latitude : path.lat(), longitude : path.lng() });
				}

				// remove original polygon
				polygon.setMap(null);

				// Save Polygon 
				$scope.savePolygon();
			}
		};

		/**
		 * @param  {[type]}
		 * @return {[type]}
		 */
		uiGmapIsReady.promise().then(function(map_instances) {
			// Draw Polygon if data exist
		});

		/**
		 * @return {[type]}
		 */
		$scope.clearPolygon = function() {
			var polyPath = $scope.polygon.path;

			if(polyPath && polyPath.length > 0) {
				angular.forEach(polyPath, function(path) { path = null; });
				$scope.polygon.path = [];
			}
		};

		/**
		 * @param {[type]}
		 */
		$scope.setPolygon = function(paths) {
			$scope.clearPolygon();

			if(!paths || paths.length == 0) {
				$scope.mapOption.center.latitude = DEFAULT_LAT;
				$scope.mapOption.center.longitude = DEFAULT_LNG;

			} else {
				var startPoint = new google.maps.LatLng(paths[0].lat, paths[0].lng);
				var bounds = new google.maps.LatLngBounds(startPoint, startPoint);

				angular.forEach(paths, function(path) {
					$scope.polygon.path.push({ latitude : path.lat, longitude : path.lng });
					bounds.extend(new google.maps.LatLng(path.lat, path.lng));
				});

				var center = bounds.getCenter();
				$scope.mapOption.center.latitude = center.lat();
				$scope.mapOption.center.longitude = center.lng();				
			}
		};

		/**
		 * geofence item selected
		 * 
		 * @param  {string}
		 * @param  handler function
		 */
		$rootScope.$on('geofence-item-selected', function(event, geofence) {
			$scope.geofence = geofence;
			$scope.resetPolygon();

			RestApi.get('/polygons.json', { '_q[geofence_id-eq]' : geofence.id }, function(dataSet) {
				$scope.setPolygon(dataSet.items);
			});
		});

		/**
		 * save polygon
		 * 
		 * @return {object}
		 */
		$scope.savePolygon = function() {
			var multipleData = [], paths = $scope.polygon.path;
			for (var i = 0 ; i < paths.length ; i++) {
				multipleData.push({
					id : '',
					geofence_id : $scope.geofence.id,
					lat : paths[i].latitude,
					lng : paths[i].longitude
				});
			}

			var result = RestApi.updateMultiple('/geofences/' + $scope.geofence.id + '/update_multiple_polygons.json', null, multipleData);
			result.$promise.then(function(data) {
				// TODO success or failure popup
			});
		};

		/**
		 * delete polygon
		 * 
		 * @return {[type]}
		 */
		$scope.deletePolygon = function() {
			if($scope.polygon.id && $scope.polygon.id != '') {
				RestApi.delete('/polygons/' + $scope.polygon.id + '.json', {}, function(result) {
					$scope.resetPolygon();
					$scope.$emit('geofence-items-change', null);
				});
			}
		};

		/**
		 * reset polygon
		 * 
		 * @return {[type]}
		 */
		$scope.resetPolygon = function() {
			$scope.clearPolygon();
			$scope.polygon.id = '';
			$scope.polygon.name = '';
			$scope.polygon.description = '';
		};

		//--------------------------------- E N D ------------------------------------
	});