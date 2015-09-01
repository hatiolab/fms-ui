angular.module('fmsMonitor').controller('SidebarCtrl', function($rootScope, $scope, $element) {
	
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
	 * Sidebar UI에서 사용자가 직접 Tab 선택시 on-click
	 */
	$scope.selectTab = function(tab) {
		$scope.toggleRefreshButton(tab.showRefreshBtn);
		if(tab.eventName != '') {
			$scope.$emit(tab.eventName, '');
		}

		/**
		 * send to alert indicator
		 */
		$scope.$emit('new-alert-count-reset', 0);
	};

	/**
	 * 다른 곳의 이벤트에 따라 Tab을 이동해야 할 경우 Tab 이동 
	 */
	$scope.moveTab = function(tabId) {
		var selectedTab = $scope.tabs.filter(function(tab) { return tab.id == tabId; });

		if(selectedTab && selectedTab.length > 0) {
			var tab = selectedTab[0];
			$scope.selectTab(tab);
		
			for(var i = 0 ; i < $scope.tabs.length ; i++) {
				var curTab = $scope.tabs[i];
				curTab.active = false;
				$element.find('#' + curTab.id).removeClass('active');
			}

			tab.active = true;
			var tabContent = $element.find('#' + tab.id);
			tabContent.addClass('active');
		}
	};

	/**
	 * Move to listener
	 */
	var moveListener = $rootScope.$on('go-to-monitor', function(event, tabId) {
		$scope.moveTab(tabId);
	});

	/**
	 * Scope destroy시 timeout 제거 
	 */
	$scope.$on('$destroy', function(event) {
		moveListener();
	});

});