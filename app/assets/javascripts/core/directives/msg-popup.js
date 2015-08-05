angular.module('fmsCore').directive('msgPopup', function() { 
	return { 
		restrict: 'E',
		replace: true,
		templateUrl: '/assets/core/views/msg-popup.html',
		scope: { title : '@', msg : '@' },
		link: function() {
		}
	}; 
})
.controller('msgPopupCtrl', function($rootScope, $scope, $resource, $element, FmsUtils, RestApi) {

});