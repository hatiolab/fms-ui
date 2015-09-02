angular.module('fmsCore').directive('alertIndicator', function() { 
	return { 
		restrict: 'E',
		replace: true,
		controller: 'alertIndicatorCtrl',
		templateUrl: '/assets/core/views/alert-indicator.html',
		link: function() {
		}
	}; 
})
.controller('alertIndicatorCtrl', function($rootScope, $scope, $element, $state, $window) {

	/**
	 * Alert Count
	 */
	$scope.alertCount = 0;

	/**
	 * Alert List 화면으로 이동
	 */
	$scope.goToAlertList = function() {
		/*if($state.current.name && $state.current.name == 'monitor') {
			$scope.$emit('go-to-monitor', 'side-alerts');
		} else {
			//location.href = 'trkvue#side_alerts';
			$state.go('monitor', { 'tabId': $scope.item }, { reload : true });
		}*/

		$state.go('monitor', { 'tabId': 'side-alerts' }, { reload : true });
		$scope.$emit('go-to-monitor', 'side-alerts');
	};

	/**
	 * new alert count listener
	 */
	var newAlertListener = $rootScope.$on('new-alert-count-change', function(event, newAlertCount) {
		$scope.alertCount = $scope.alertCount + newAlertCount;
	});

	/**
	 * new alert count listener
	 */
	var resetCountListener = $rootScope.$on('new-alert-count-reset', function(event) {
		$scope.alertCount = 0;
	});

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		newAlertListener();
		resetCountListener();
	});

});
