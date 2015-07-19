angular.module('fmsMonitor').controller('MonitorMapCtrl', function($rootScope, $scope) {
	
	/*$scope.markers = [ {
		id: 0,
		coords: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG },
		options: { draggable: true },
		events: {
			click : function(e) {
				$scope.winShowInfo.show1 = true;
				$scope.winShowInfo.show2 = false;
				$scope.winShowInfo.show3 = false;
				$scope.winShowInfo.show4 = false;
			}
		}
	}, {
		id: 1,
		coords: { latitude: DEFAULT_LAT + 0.3, longitude: DEFAULT_LNG + 0.3 },
		options: { draggable: true },
		events: {
			click : function(e) {
				$scope.winShowInfo.show1 = false;
				$scope.winShowInfo.show2 = true;
				$scope.winShowInfo.show3 = false;
				$scope.winShowInfo.show4 = false;
			}
		}
	}, {
		id: 2,
		coords: { latitude: DEFAULT_LAT + 0.6, longitude: DEFAULT_LNG + 0.6 },
		options: { draggable: true },
		events: {
			click : function(e) {
				$scope.winShowInfo.show1 = false;
				$scope.winShowInfo.show2 = false;
				$scope.winShowInfo.show3 = true;
				$scope.winShowInfo.show4 = false;
			}
		}
	}, {
		id: 3,
		coords: { latitude: DEFAULT_LAT + 0.9, longitude: DEFAULT_LNG + 0.9 },
		options: { draggable: true },
		events: {
			click : function(e) {
				$scope.winShowInfo.show1 = false;
				$scope.winShowInfo.show2 = false;
				$scope.winShowInfo.show3 = false;
				$scope.winShowInfo.show4 = true;
			}
		}
	} ];

	$scope.winShowInfo = {
		show1 : false,
		show2 : false,
		show3 : false,
		show4 : false
	};
	*/
	
	/**
	 * center position of the map
	 */
	$scope.center = { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG };
	/**
	 * map option
	 */
	$scope.mapOption = { center: $scope.center, zoom: 9 };
	/**
	 * map markers
	 */
	$scope.markers = [];

	/**
	 * 마커 찍기 ...
	 */
	$scope.drawMarkers = function(fleets) {
		for(var i = 0 ; i < fleets.length ; i++) {
			$scope.markers.push({
				id: fleets[i].id,
				latitude : fleets[i].lat,
				longitude : fleets[i].lng
			});
		}
	};

	/**
	 * Fleet 조회시 이벤트 리슨
	 */
	$rootScope.$on('monitor-fleet-list-change', function(evt, fleetDataSet) {
		if(fleetDataSet && fleetDataSet.items) {
			$scope.drawMarkers(fleetDataSet.items);
		}
	});

});