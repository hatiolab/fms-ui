fmsApp.directive('monitorMap', function() { 
	return { 
		restrict: 'E',
		replace: true,
		template: "<div ng-controller='MonitorMapCtrl'>" +
		"	<ui-gmap-google-map center='mapOption.center' zoom='mapOption.zoom' id='mapCanvas'>" + 
		"	<ui-gmap-marker coords='marker.coords' options='marker.options' events='marker.events' idkey='marker.id'/>" + 
		"</ui-gmap-google-map></div>"
	}; 
});