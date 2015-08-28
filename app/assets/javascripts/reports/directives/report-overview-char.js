angular.module('fmsReports').directive('reportsOverviewChart', function() { 
	return { 
		restrict: 'E',
		controller: 'reportsOverviewCtrl',
		templateUrl: '/assets/reports/views/contents/overview.html',
		scope: {}
	}; 
})
.controller('reportsOverviewCtrl', function($rootScope, $scope, $element, ModalUtils, RestApi) {


	var itemsChangeListener = $rootScope.$on('report-overview-items-change', function(event, items) {
		$scope.items = items;
	});

	/**
	 * Scope destroy시 
	 */
	$scope.$on('$destroy', function(event) {
		itemsChangeListener();
	});		
	// --------------------------- E N D ----------------------------
});