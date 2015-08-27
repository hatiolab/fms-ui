// 1. core module
angular.module('fmsCore', ['ui.router', 'ngCookies', 'ngResource', 'ui.bootstrap', 'smart-table', 'uiGmapgoogle-maps', 'ngFileUpload'])
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
	if(typeof CONTENT_BASE_URL != 'undefined') {
		$sceDelegateProvider.resourceUrlWhitelist([
	  	// Allow same origin resource loads.
	    'self',
	    // Allow loading from our assets domain.  Notice the difference between * and **.
	    CONTENT_BASE_URL + '**'
	  ]);
	}
});

// 5. reports geofence
angular.module('fmsReports', ['fmsCore', 'chart.js']);

// 6. reports human resource
angular.module('fmsHr', ['fmsReports']);

// 6. main module
angular.module('fmsApp', ['fmsCore', 'fmsSettings', 'fmsGeofence', 'fmsMonitor', 'fmsReports', 'fmsHr'])
.config(function($httpProvider, $stateProvider, $urlRouterProvider) {
	// CSRF Token
	$httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/');	
})
.run(function($state, $rootScope, $location, RestApi) {
	// go to signin screen
	$rootScope.goToSignin = function() {
		window.location = '/users/sign_in';
		window.location.reload();
	};

	/*$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
		if(typeof login !== 'undefined') {
			RestApi.isSignedIn(function(data, response) {
				if(typeof response == 'object' && response.status && response.status == 401) {
					e.preventDefault();
					$rootScope.goToSignin();
				}
			});
		} else {
			e.preventDefault();
		}
  });*/
});