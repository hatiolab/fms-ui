angular.module('fmsCore')
	.filter('fms-time', function() { 
		return function(input) { 
			return input + '-test';
		}; 
	});