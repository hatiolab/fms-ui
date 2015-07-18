angular.module('fmsMonitor').controller('MonitorMapCtrl', function($scope) {
	
	$scope.markers = [ {
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
	
	$scope.mapOption = { center: { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG }, zoom: 9 };

	$scope.winShowInfo = {
		show1 : false,
		show2 : false,
		show3 : false,
		show4 : false
	};

});