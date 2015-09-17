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

			if(!angular.isNumber(input)) {
				input = Number(input);
			}

			input = Number(input.toFixed(1));

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
		}; 
	})

	.filter('fmsdistance', function($rootScope) { 
		return function(input, displayUnit) {

			if(!angular.isNumber(input)) {
				input = Number(input);
			}

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
		}; 
	})

	.filter('fmsworktime', function($rootScope) { 
		return function(input, displayUnit) {

			if(!input) {
				return 0;
			}

			if(!angular.isNumber(input)) {
				input = Number(input);
			}

			var output = (input / 60);
			output = Number(output.toFixed(1));

			if(input && !displayUnit) {
				return output;
			} else if(input && displayUnit) {
				return output + ' hour';
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
			return 'hour'
		};
	})

	.filter('tripendtime', function($rootScope, $filter) { 
		return function(input) { 
			if(input) {
				var tripInterval = $rootScope.getIntSetting('trip_interval');
				var currentTime = new Date().getTime();
				var gap = currentTime - input;

				if(gap > (tripInterval * 60 * 60 * 1000)) {
					return $filter('fmstime')(input);
				} else {
					return '';
				}

			} else {
				return input;
			}
		}; 
	})

	.filter('triplastspeed', function($rootScope, $filter) { 
		return function(input, tripEndtime) { 
			if(input) {
				var tripInterval = $rootScope.getIntSetting('trip_interval');
				var currentTime = new Date().getTime();
				var gap = currentTime - tripEndtime;

				if(gap > (tripInterval * 60 * 60 * 1000)) {
					return $filter('fmsvelocity')(0, true);
				} else {
					return $filter('fmsvelocity')(input, true);
				}

			} else {
				return $filter('fmsvelocity')(0, true);
			}
		}; 
	});