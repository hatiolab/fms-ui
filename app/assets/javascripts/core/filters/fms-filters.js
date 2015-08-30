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
	})

	.filter('fmsvelocity', function($rootScope) { 
		return function(input, displayUnit) {

			if(!input) {
				return '';
			}

			if(!angular.isNumber(input)) {
				input = Number(input);
			}

			if(input) {
				var unit = $rootScope.getSetting('distance_unit');
				if(!unit || unit == 'km') {
					input = input;
				} else {
					input = parseInt(input * 0.62137);
				}

				if(displayUnit) {
					return input + ' ' + unit + '/h';
				} else {
					return input;
				}
			} else {
				return input;
			}
		}; 
	})

	.filter('fmsdistance', function($rootScope) { 
		return function(input, displayUnit) {

			if(!input) {
				return '';
			}

			if(!angular.isNumber(input)) {
				input = Number(input);
			}

			if(input) {
				var unit = $rootScope.getSetting('distance_unit');
				if(!unit || unit == 'km') {
					input = input;
				} else {
					input = parseInt(input * 0.62137);
				}

				if(displayUnit) {
					return input + ' ' + unit;
				} else {
					return input;
				}
			} else {
				return input;
			}
		}; 
	})

	.filter('fmsworktime', function($rootScope) { 
		return function(input, displayUnit) {

			if(input && !displayUnit) {
				return input;
			} else if(input && displayUnit) {
				return input + ' min.';
			} else {
				return input;
			}
		}; 
	})

	.filter('distunit', function($rootScope) { 
		return function(input) {
			return $rootScope.getSetting('distance_unit');
		};
	})

	.filter('speedunit', function($rootScope) { 
		return function(input) {
			return $rootScope.getSetting('distance_unit') + '/h';
		};
	})

	.filter('timeunit', function($rootScope) { 
		return function(input) {
			return 'min.'
		};
	});