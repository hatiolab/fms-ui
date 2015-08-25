angular.module('fmsMonitor').controller('SidebarCtrl', function($rootScope, $scope, $element) {
	
	/**
	 * Tabs Model
	 * @type {Array}
	 */
	$scope.tabs = [  { 
		id: 'side-fleets', 
		name: 'Fleets',
		showRefreshBtn : true,
		eventName : 'monitor-refresh-fleet', 
		cls : 'active' 
	}, { 
		id: 'side-alerts', 
		name: 'Alerts', 				
		showRefreshBtn : true,  
		eventName : 'monitor-refresh-event', 
		cls : '' 
	}, { 
		id: 'side-info', 	 
		name: 'Trip', 
		showRefreshBtn : false, 
		eventName : 'monitor-refresh-trip', 
		cls : '' 
	} ];

	/**
	 * Toggle Refresh Button
	 * @param  {Boolean}
	 */
	$scope.toggleRefreshButton = function(show) {
		if(show) {
			$element.find('button.panel-refresh').show();
		} else {
			$element.find('button.panel-refresh').hide();	
		}
	};

	/**
	 * Tab 선택
	 */
	$scope.selectTab = function(tab) {
		$scope.toggleRefreshButton(tab.showRefreshBtn);
		if(tab.eventName != '') {
			$scope.$emit(tab.eventName, '');
		}
	};

});