angular.module('fmsGeofence')
	.controller('GeofenceItem', function($rootScope, $scope, $resource, $element, $interval, uiGmapIsReady, ConstantSpeed, FmsUtils, RestApi) {

		/**
		 * sidebar toggle
		 */
		$scope.isSidebarToggle = true;
		/**
		 * map option
		 */
		$scope.mapOption = { center: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }, zoom: 9 };
		/**
		 * polygon option
		 */
		$scope.polygon = {
			id : '',
			name : '',
			description : '',
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

			angular.forEach(paths, function(path) {
				$scope.polygon.path.push({ latitude : path.lat, longitude : path.lng });
			});
		};

		/**
		 * geofence item selected
		 * 
		 * @param  {eventName}
		 * @param  handler function
		 */
		$rootScope.$on('geofence-item-selected', function(event, geofence) {
			$scope.polygon.id = geofence.id;
			$scope.polygon.name = geofence.name;
			$scope.polygon.description = geofence.description;

			RestApi.get('/polygons.json', { '_q[geofence_id-eq]' : geofence.id }, function(dataSet) {
				if(dataSet.items && dataSet.items.length > 0) {
					$scope.setPolygon(dataSet.items);
				}
			});
		});

		/**
		 * save polygon
		 * 
		 * @return {[type]}
		 */
		$scope.savePolygon = function() {
			if($scope.polygon.id && $scope.polygon.id != '') {
				RestApi.update('/polygons/' + $scope.polygon.id + '.json', {}, function(result) {
					// TODO
					$scope.$emit('geofence-items-change', null);
				});
			} else if(!$scope.polygon.id || $scope.polygon.id == '') {
				RestApi.create('/polygons/' + $scope.polygon.id + '.json', {}, function(result) {
					// TODO
					$scope.$emit('geofence-items-change', null);
				});
			}
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