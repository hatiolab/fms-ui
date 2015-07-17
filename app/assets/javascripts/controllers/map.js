fmsApp.controller('MapCtrl', function($scope) {
	
	$scope.marker = {
		id: 0,
		coords: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG },
		options: { draggable: true },
		events: {
			dragend: function (marker, eventName, args) {
				$scope.marker.options = {
					draggable: true,
					labelContent: "lat: " + $scope.marker.coords.latitude + ', </br>lng: ' + $scope.marker.coords.longitude,
					labelAnchor: "100 0",
					labelClass: "marker-labels"
				};
			}
		}
	};
	
	$scope.mapOption = { center: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }, zoom: 8 };

});