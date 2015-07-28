// angular.module('fmsCore').directive('alertZone', function() { 
// 	return { 
// 		restrict: 'E',
// 		templateUrl: '/assets/core/views/alert-popup.html',
// 		scope: {}
// 	}; 
// })
// .controller('alertZoneCtrl', function($rootScope, $scope, $resource, $element, $interval, FmsUtils, RestApi) {
// 	alert('Alert Zone');
// 	/**
// 	 * 임시 방안 - 추후 pub / sub으로 구현 
// 	 * alert 조회 - 마지막 조회시간을 저장하고 있다가 10초에 한 번씩 마지막 조회 이 후 시간으로 조회 ...
// 	 */
// 	$scope.lastSearchAlertTime = 1437964420594; //new Date().getTime();

// 	/**
// 	 * Refresh timer를 시작 
// 	 */
// 	$scope.searchNewAlert = function() {
// 		RestApi.get('/events/' + $scope.lastSearchAlertTime + '/latest_one.json', {}, function(alert) {
// 			if(alert && alert.driver) {
// 				FmsUtils.setAlertTypeClass(alert.alert);
// 				$scope.alertItem.id = alert.alert.id;
// 				$scope.alertItem.type = alert.alert.typ;
// 				$scope.alertItem.tripId = alert.alert.tid;
// 				$scope.alertItem.title = alert.driver.name;
// 				$scope.alertItem.time = alert.alert.ctm;
// 				$scope.alertItem.typeClass = alert.alert.typeClass;
// 				$scope.alertItem.isShow = true;
// 				$scope.lastSearchAlertTime = $scope.alertItem.time + 1;
// 			}
// 		});

// 		$scope.lastSearchAlertTime = new Date().getTime();
// 	};

// 	/**
// 	 * Scope destroy시 timeout 제거 
// 	 */
// 	$scope.$on('$destroy', function(event) {
// 		$interval.cancel();
// 	});

// 	/**
// 	 * Go Trip
// 	 */
// 	$scope.goTrip = function(tripId) {
// 		alert(tripId);
// 	};

// 	$interval($scope.searchNewAlert, 3 * 1000);	
// });
