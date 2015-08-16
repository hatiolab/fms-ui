angular.module('fmsMonitor').controller('InfobarCtrl', function($rootScope, $scope, GridUtils) {
	
	/**
	 * Infobar toggle show / hide model
	 */
	$scope.isInfobarToggle = true;
	/**
	 * Infobar 높이 변경
	 */
	$scope.changeInfobarHeight = function(mode) {
		if(mode != 'toggle') {
			// 1. 전체 사이즈 
			var infobarSize = GridUtils.setInfobarHeight('div.infolist-panel', mode);
			// 2. 탭별 사이즈 
			angular.element('#info').height(infobarSize - 25);
			angular.element('#monitor-info-alert-table-container').height(infobarSize - 30);
			angular.element('#monitor-info-trip-table-container').height(infobarSize - 30);

		} else {
			var height = angular.element('div.infolist-panel').height();

			// hide
			if(height > 25) {
				angular.element('div.infolist-panel').height(25);
				angular.element('#info').height(0);
				angular.element('#monitor-info-alert-table-container').height(0);
				angular.element('#monitor-info-trip-table-container').height(0);
			// show
			} else {
				$scope.changeInfobarHeight('mini');
			}
		}
	};

});