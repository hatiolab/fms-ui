//var fmsApp = angular.module('fmsApp', ['ngResource', 'ui.router', 'uiGmapgoogle-maps']);
var fmsApp = angular.module('fmsApp', ['ui.router', 'uiGmapgoogle-maps']);

fmsApp.config(function($stateProvider, $urlRouterProvider) {
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/monitor');
});