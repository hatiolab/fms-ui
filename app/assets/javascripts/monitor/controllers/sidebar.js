angular.module('fmsMonitor').controller('SidebarCtrl', function($rootScope, $scope, $element) {
	
	/**
	 * Show Referesh Button
	 */
	$scope.showRefreshButton = function() {
		$element.find('button.panel-refresh').show();
	};

	/**
	 * Hide Referesh Button
	 */
	$scope.hideRefreshButton = function() {
		$element.find('button.panel-refresh').hide();	
	};

});