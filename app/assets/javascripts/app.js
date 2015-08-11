// 1. core module
angular.module('fmsCore', ['ui.router', 'ngResource', 'ui.bootstrap', 'smart-table', 'uiGmapgoogle-maps', 'ngFileUpload'])
.constant('ConstantSpeed', {
	SPEED_IDLE : 'speed_idle',
	SPEED_SLOW : 'speed_slow',
	SPEED_NORMAL : 'speed_normal',
	SPEED_HIGH : 'speed_high',
	SPEED_OVER : 'speed_over'
});

// 2. settings module
angular.module('fmsSettings', ['fmsCore']);

// 3. settings geofence
angular.module('fmsGeofence', ['fmsCore']);

// 4. monitor module
angular.module('fmsMonitor', ['fmsCore', 'pip'])
.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
	    // Allow same origin resource loads.
	    'self',
	    // Allow loading from our assets domain.  Notice the difference between * and **.
	    CONTENT_BASE_URL + '**'
	  ]);
});

// 5. reports geofence
angular.module('fmsReports', ['fmsCore', 'chart.js']);

// 6. main module
angular.module('fmsApp', ['fmsCore', 'fmsSettings', 'fmsGeofence', 'fmsMonitor', 'fmsReports'])
.config(function($httpProvider, $stateProvider, $urlRouterProvider) {
	// CSRF Token
	$httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/');
});