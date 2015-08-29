angular.module('fmsCore')
	.filter('fmstime', function($filter) { 
		return function(input) { 
			if(input) {
				var format = 'short';
				var timezone = '+0900';
				return $filter('date')(input, format, timezone);
			} else {
				return input;
			}
		}; 
	});