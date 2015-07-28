angular.module('fmsCore').directive('alertPopup', function() { 
	return { 
		restrict: 'E',
		templateUrl: '/assets/core/views/alert-popup.html',
		scope: { alert : '@' },
		linke: function() {
			alert('alert popup');
		}
	}; 
})
.controller('alertPopupCtrl', function($rootScope, $scope, $resource, $element, FmsUtils, RestApi) {
alert('Alert Popup');
});
