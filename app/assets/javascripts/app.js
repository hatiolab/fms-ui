// 1. core module
angular.module('fmsCore', ['ui.router', 'ngResource', 'ui.grid', 'uiGmapgoogle-maps']);
// 2. settings module
angular.module('fmsSettings', ['fmsCore']);
// 3. monitor module
angular.module('fmsMonitor', ['fmsCore', 'pip']);
// 4. main module
angular.module('fmsApp', ['fmsCore', 'fmsSettings', 'fmsMonitor'])
.config(function($stateProvider, $urlRouterProvider) {
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/');
});
