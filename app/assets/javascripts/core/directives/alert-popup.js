angular.module('fmsCore').directive('alertPopup', function() { 
	return { 
		restrict: 'E',
		replace: true,
		templateUrl: '/assets/core/views/alert-popup.html',
		scope: { alert : '@' },
		link: function() {
		}
	}; 
})
.controller('alertPopupCtrl', function($rootScope, $scope, $resource, $element, FmsUtils, RestApi) {

});
