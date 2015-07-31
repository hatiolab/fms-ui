angular.module('fmsGeofence')
	.controller('GeofenceItem', function($rootScope, $scope, $resource, $element, $interval, uiGmapIsReady, ConstantSpeed, FmsUtils, RestApi) {

		/**
		 * sidebar toggle
		 */
		$scope.isSidebarToggle = true;
		/**
		 * polygon option
		 */
		$scope.polygon = {
			id : 1,
			option : {
				static : true,
				stroke : { color : '#ff0000', weight : 5 },
				visible : true,
				geodesic : false,
				fill : { color : '#ff00000', opacity : 1 },
				editable : false,
				draggable : true,
			},
			path : [
				{ latitude: DEFAULT_LAT,       longitude: DEFAULT_LNG }, 
				{ latitude: DEFAULT_LAT + 0.1, longitude: DEFAULT_LNG + 0.1 },
				{ latitude: DEFAULT_LAT + 0.2, longitude: DEFAULT_LNG + 0.2 },
				{ latitude: DEFAULT_LAT + 0.3, longitude: DEFAULT_LNG + 0.3 }
			]
		};
		/**
		 * map option
		 */
		$scope.mapOption = {
			center: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG },
			zoom: 9
		};

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

		uiGmapIsReady.promise().then(function(map_instances) {
				// Draw Polygon if data exist
		});

		$scope.drawingManagerEvents = {
			polygoncomplete: function(drawingManager, eventName, scope, args) {
				var polygon = args[0];
				var path = polygon.getPath();
				console.log(path);
				var coords = [];
				for (var i = 0; i < path.length; i++) {
					coords.push({
						latitude: path.getAt(i).lat(),
						longitude: path.getAt(i).lng()
					});
				}
				console.log(coords);
			}
		};

	});