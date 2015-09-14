angular.module('fmsMonitor').controller('SidebarCtrl', function($rootScope, $scope, $element, $state, $stateParams, $timeout) {
	
	/**
	 * Tabs Model
	 * @type {Array}
	 */
	$scope.tabs = [ { 
		id: 'side-fleets', 
		name: 'Fleets',
		showRefreshBtn : true,
		eventName : 'monitor-refresh-fleet', 
		active : true
	}, { 
		id: 'side-alerts', 
		name: 'Alerts', 				
		showRefreshBtn : true,  
		eventName : 'monitor-refresh-event', 
		active : false
	}, { 
		id: 'side-info', 	 
		name: 'Trip', 
		showRefreshBtn : true, 
		eventName : 'monitor-refresh-trip', 
		active : false
	} ];

	/**
	 * Sidebar UI에서 사용자가 직접 Tab 선택시 on-click
	 */
	$scope.selectTab = function(tab) {
		if(tab.eventName != '') {
			$timeout(function(){$scope.$emit(tab.eventName, '')}, 500);
		}

		for(var i = 0 ; i < $scope.tabs.length ; i++) {
			var curTab = $scope.tabs[i];
			curTab.active = false;
			$element.find('#' + curTab.id).removeClass('active');
		}

		tab.active = true;
		var tabContent = $element.find('#' + tab.id);
		tabContent.addClass('active');

		if(tab.id == 'side-alerts') {
			/**
		 	* send to alert indicator
		 	*/
			$scope.$emit('new-alert-count-reset', 0);			
		}
	};

	/**
	 * tabId로 이동
	 */
	if($stateParams && $stateParams.tabId) {
		var selectedTab = $scope.tabs.filter(function(tab) { return tab.id == $stateParams.tabId; });
		if(selectedTab && selectedTab.length > 0) {
			var tab = selectedTab[0];
			$scope.selectTab(tab);
		}
	}

});