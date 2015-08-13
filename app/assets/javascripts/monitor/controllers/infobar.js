angular.module('fmsMonitor').controller('InfobarCtrl', function($rootScope, $scope, GridUtils) {
	
	/**
	 * Infobar toggle show / hide model
	 */
	$scope.isInfobarToggle = true;
	/**
	 * 그리드 크기 모드 변경
	 * @param {[type]} mode [full(screen size-55px), half((screen height-55px) * 50%), mini(272)]
	 */
	$scope.setInfobarGridContainerMode = function(mode) {
		GridUtils.setInfobarGridContainerMode("monitor-info-alert-table-container",mode);
		GridUtils.setInfobarGridContainerMode("monitor-info-trip-table-container",mode);
	};

});