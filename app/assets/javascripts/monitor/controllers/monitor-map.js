angular.module('fmsMonitor').controller('MonitorMapCtrl', function($rootScope, $scope) {
	
	/**
	 * center position of the map
	 */
	$scope.center = { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG };
	/**
	 * map option
	 */
	$scope.mapOption = { center: $scope.center, zoom: 9 };
	/**
	 * map markers for fleets
	 */
	$scope.markers = [];
	/**
	 * window show / hide switch
	 */
	$scope.windowSwitch = { showFleetInfo : false };
	/**
	 * 선택된 마커 
	 */
	$scope.selectedMarker = null;

	/**
	 * Refresh Fleet Markers
	 */
	$scope.refreshFleetMarkers = function(fleets) {
		$scope.markers = [];

		for(var i = 0 ; i < fleets.length ; i++) {
			var fleet = fleets[i];
			fleet.latitude = fleets[i].lat;
			fleet.longitude = fleets[i].lng;
			fleet.events = {
					click : function(e) {
						$scope.selectedMarker = e.model;
						$scope.windowSwitch.showFleetInfo = true;
						$scope.getAddress($scope.selectedMarker);
					}
			};
			
			$scope.markers.push(fleet);
		}
	};

	/**
	 * get address from lat, lng
	 */
	$scope.getAddress = function(marker) {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(marker.latitude, marker.longitude);
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                $scope.selectedMarker.address = results[1].formatted_address;
            } else {
                $scope.selectedMarker.address = 'Location not found';
            }
        } else {
            $scope.selectedMarker.address = 'Geocoder failed due to: ' + status;
        }
    });
	};

	/**
	 * Move to trip of fleet
	 */
	$scope.goTrip = function(fleetId, tripId) {
		if(!tripId) {
			alert('This car has no trip information!');
		}

		// TODO go trip
		
	};

	/**
	 * Fleet 조회시 이벤트 리슨
	 */
	$rootScope.$on('monitor-fleet-list-change', function(evt, fleetDataSet) {
		if(fleetDataSet && fleetDataSet.items) {
			$scope.refreshFleetMarkers(fleetDataSet.items);
		}
	});

	/**
	 * Fleet 하나 선택시 이벤트 리슨
	 */
	$rootScope.$on('monitor-fleet-change', function(evt, fleet) {
		if(fleet.id && fleet.trip_id) {
			$scope.goTrip(fleet.id, fleet.trip_id);
		}
	});

});