angular.module('fmsCore').directive('alertZone', function() { 
	return { 
		restrict: 'E',
		//replace: true,
		templateUrl: 'assets/core/views/alert-zone.html',
		scope: {},
		controller: 'AlertZoneCtrl'
	}; 
});