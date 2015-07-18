var fmsApp = angular.module('fmsApp', ['ui.router', 'ngResource', 'ui.grid', 'uiGmapgoogle-maps', 'pip']);

fmsApp.config(function($stateProvider, $urlRouterProvider) {
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/');
});
