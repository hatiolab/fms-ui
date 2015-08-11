angular.module('fmsCore').directive('topMenu', function() { 
	return { 
		restrict: 'E',
		replace: true,
		controller: 'topMenuCtrl',
		templateUrl: '/assets/core/views/top-menu.html'
	}; 
})

.controller('topMenuCtrl', function($scope, $element) {

	$scope.items = [ {
		name : 'Map', 
		cls : 'icon-map',
		href : '#/',
		active : true
	}, {
		name : 'Geofence', 
		cls : 'icon-geofence',
		href : '#/geofence',
		active : false
	}, {
		name : 'HR', 
		cls : 'icon-hr',
		href : '',
		active : false
	}, {
		name : 'Report', 
		cls : 'icon-report',
		href : '#/reports',
		active : false
	}, {
		name : 'Setting', 
		cls : 'icon-setting',
		href : '#/settings/drivers',
		active : false
	} ];

	$scope.setActive = function(activeItem) {
		for(var i = 0 ; i < $scope.items.length ; i++) {
			var item = $scope.items[i];
			item.active = (item.name == activeItem.name);
		}
	};

});
