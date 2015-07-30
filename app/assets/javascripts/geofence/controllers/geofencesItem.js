angular.module('fmsGeofence')
	.controller('GeofenceItem', function($rootScope, $scope, $resource, $element, $interval, uiGmapIsReady, ConstantSpeed, FmsUtils, RestApi) {

		//alert('Geofence Item');

		$scope.isSidebarToggle = true;

		/**
		 * 현재 선택된 Trip ID
		 */
		$scope.currentTripId = null;
		/**
		 * map option
		 */
		$scope.mapOption = {
			center: {
				latitude: DEFAULT_LAT,
				longitude: DEFAULT_LNG
			},
			zoom: 9
		};
		/**
		 * map marker models for fleets, map polyline model for tracks, currently selected marker, map control
		 */
		$scope.markers = [], $scope.polylines = [], $scope.selectedMarker = null;
		$scope.mapControl = {};

		$scope.drawingManagerOptions = {
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: true,
			drawingControlOptions: {
				position: google.maps.ControlPosition.TOP_CENTER,
				drawingModes: [
					//google.maps.drawing.OverlayType.MARKER,
					//google.maps.drawing.OverlayType.CIRCLE,
					google.maps.drawing.OverlayType.POLYGON
					//google.maps.drawing.OverlayType.POLYLINE,
					//google.maps.drawing.OverlayType.RECTANGLE
				]
			},
			circleOptions: {
				fillColor: '#ffff00',
				fillOpacity: 1,
				strokeWeight: 5,
				clickable: false,
				editable: true,
				zIndex: 1
			}
		};

		uiGmapIsReady.promise()
			.then(function(map_instances) {
				// var map1 = $scope.mapOption.control.getGMap();    // get map object through $scope.map.control getGMap() function
				if (map_instances) {
					console.log(map_instances);
				}
			});

		$scope.drawingManagerEvents = {
			polygoncomplete: function(drawingManager, eventName, scope, args) {
				var polygon = args[0];
				var path = polygon.getPath();
				var coords = [];
				for (var i = 0; i < path.length; i++) {
					coords.push({
						latitude: path.getAt(i).lat(),
						longitude: path.getAt(i).lng()
					});
				}
			}
		};
		console.log($scope.drawingManagerOptions);

	});