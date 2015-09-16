angular.module('fmsGeofence')
	.controller('GeofenceSettingMapCtrl', function($rootScope, $scope, $element, $timeout, ModalUtils, RestApi, StorageUtils) {

		/**
		 * selected geofence
		 * 
		 * @type {Object}
		 */
		$scope.geofence = { id : '', name : '', description : '' };
		/**
		 * map option
		 */
		$scope.mapOption = { center: StorageUtils.getGeofenceBasicLoc(), zoom: 9 };
		/**
		 * Map Type Control Option
		 */
		$scope.mapTypeControlOptions = {
			mapTypeControlOptions : { position: google.maps.ControlPosition.TOP_CENTER }
		};		
		/**
		 * map control
		 * 
		 * @type {Object}
		 */
		$scope.mapControl = {};
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
				fit : true
			}
		};

		/**
		 * DrawingManagerOptions Object
		 * 
		 * @type {Object}
		 */
		$scope.drawingManagerOptions = {
			drawingMode: null,
			drawingControl: false,
			drawingControlOptions: {
				position: google.maps.ControlPosition.TOP_CENTER,
				drawingModes: [
					//google.maps.drawing.OverlayType.POLYGON,
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
				editable: false,
				zIndex: 1
			}
		};

		/**
		 * DrawingManagerEvents Object
		 * 
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
		 * Set Polygon Drawing Mode
		 * 
		 * @param {Boolean}
		 */
		$scope.setDrawingMode = function(drawingFlag) {
			$scope.drawingManagerOptions.drawingControl = drawingFlag;

			if(drawingFlag) {
				$scope.drawingManagerOptions.drawingMode = google.maps.drawing.OverlayType.POLYGON;
				if($scope.drawingManagerOptions.drawingControlOptions.drawingModes.indexOf(google.maps.drawing.OverlayType.POLYGON) < 0)
					$scope.drawingManagerOptions.drawingControlOptions.drawingModes.push(google.maps.drawing.OverlayType.POLYGON);

			} else {
				$scope.drawingManagerOptions.drawingMode = null;
				$scope.drawingManagerOptions.drawingControlOptions.drawingModes.pop(google.maps.drawing.OverlayType.POLYGON);
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
				$scope.mapOption.center = StorageUtils.getGeofenceBasicLoc();
			} else {
				angular.forEach(paths, function(path) {
					$scope.polygon.path.push({ latitude : path.lat, longitude : path.lng });
				});

				$timeout($scope.setDefaultLoc, 500);
			}
		};

		/**
		 * 로케이션 정보를 저장한다.
		 */
		$scope.setDefaultLoc = function() {
			var gmap = $scope.mapControl.getGMap();
			StorageUtils.setGeofenceBasicLoc(gmap.center.lat(), gmap.center.lng());
		};

		/**
		 * save polygon
		 * 
		 * @return {Object}
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

			var url = '/geofences/' + $scope.geofence.id + '/update_multiple_polygons.json';
			var result = RestApi.updateMultiple(url, null, multipleData);
			result.$promise.then(
				function(data) { ModalUtils.alert('sm', 'Complete', 'Succeeded to save!'); },
				function(data) { 
					if(data.status == 0) {
						$timeout($scope.setDefaultLoc, 500);
						ModalUtils.alert('sm', 'Error', 'Connection Failure');
					} else {
						ModalUtils.alert('sm', 'Failure', 'Status : ' + data.status + ', Reason : ' + data.statusText); 
					}
				}
			);
		};

		/**
		 * Delete polygon
		 * 
		 * @return N/A
		 */
		$scope.deletePolygon = function() {
			if(!$scope.polygon.id || $scope.polygon.id == '') {
				return;
			}

			RestApi.delete('/polygons/' + $scope.polygon.id + '.json', {}, function(result) {
				$scope.resetPolygon();
				$scope.$emit('geofence-items-change', null);
			});
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
		 * geofence item selected
		 * 
		 * @param  {String}
		 * @param  handler function
		 */
		var geofenceSelectionListener = $rootScope.$on('geofence-item-selected', function(event, geofence) {
			$scope.geofence = geofence;
			$scope.resetPolygon();
			$scope.setDrawingMode(true);

			RestApi.get('/polygons.json', { '_q[geofence_id-eq]' : geofence.id }, function(dataSet) {
				$scope.setPolygon(dataSet.items);
			});
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
		 * geofence item new
		 * 
		 * @param  {Object}
		 * @param  {Object}
		 */
		var geofenceNewListener = $rootScope.$on('geofence-item-new', function(event, emptyGeofence) {
			$scope.geofence = emptyGeofence;
			$scope.resetPolygon();
			$scope.setDrawingMode(false);
		});

	  /**
	   * Destroy Scope - RootScope Event Listener 정리 
	   */
	  $scope.$on('$destroy', function(event) {
	    geofenceSelectionListener();
	    geofenceNewListener();
	  });

		//--------------------------------- E N D ------------------------------------
	});