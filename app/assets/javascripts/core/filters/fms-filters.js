angular.module('fmsCore')
	.filter('fmstime', function($rootScope, $filter) { 
		return function(input) { 
			if(input) {
				var timezone = $rootScope.getSetting('timezone');
				if(!timezone || timezone == 'Local') {
					return $filter('date')(input, $rootScope.dateFimeFormat);
				} else {
					return $filter('date')(input, $rootScope.dateFimeFormat, '+0000');
				}
			} else {
				return input;
			}
		}; 
	});